import { STORAGE_KEYS, StorageService } from './storage';

const SYNC_KEYS: string[] = [
  STORAGE_KEYS.SHOP,
  STORAGE_KEYS.PRODUCTS,
  STORAGE_KEYS.CUSTOMERS,
  STORAGE_KEYS.INVOICES,
  STORAGE_KEYS.PAYMENTS,
  STORAGE_KEYS.TXNS,
  STORAGE_KEYS.USERS,
  STORAGE_KEYS.DEALERS,
  STORAGE_KEYS.PAYMENT_METHODS,
  STORAGE_KEYS.CATEGORIES,
  STORAGE_KEYS.VENDORS,
  STORAGE_KEYS.STAFF_PERMS,
  STORAGE_KEYS.NOTICE,
  STORAGE_KEYS.CONTACTS,
  STORAGE_KEYS.SMS_LOGS,
  STORAGE_KEYS.SMS_SETTINGS,
  STORAGE_KEYS.STOCK_INS,
  STORAGE_KEYS.DELIVERY_CHALLANS,
];

const SYNC_KEY_SET = new Set<string>(SYNC_KEYS);
const BROADCAST_CHANNEL_NAME = 'ntiles_live_sync_v1';

type TransportMode = 'detecting' | 'node' | 'php' | 'offline';

interface SyncStateResponse {
  ok?: boolean;
  changed?: boolean;
  version?: number;
  full?: boolean;
  keys?: Record<string, unknown>;
}

interface SyncWsMessage {
  type?: string;
  version?: number;
  senderId?: string;
  keys?: Record<string, unknown>;
}

function stableStringify(val: unknown): string {
  if (val === null || val === undefined || typeof val !== 'object') {
    return JSON.stringify(val ?? null);
  }
  if (Array.isArray(val)) {
    return `[${val.map((item) => stableStringify(item)).join(',')}]`;
  }
  const obj = val as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

function createClientId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fallback below
  }
  return `tab_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readLocalParsed(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

async function fetchJsonWithTimeout<T>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 5000
): Promise<T | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
      return null;
    }
    return (await resp.json()) as T;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

class LiveSyncManager {
  private readonly clientId = createClientId();
  private initialized = false;
  private mode: TransportMode = 'detecting';
  private lastKnownVersion = 0;

  private dirtyKeys = new Set<string>();
  private pushDebounceTimer: number | null = null;
  private isFlushing = false;
  private needsAnotherFlush = false;

  private ws: WebSocket | null = null;
  private wsReconnectTimer: number | null = null;
  private wsReconnectAttempts = 0;
  private fallbackPollTimer: number | null = null;
  private phpPollTimer: number | null = null;
  private detectRetryTimer: number | null = null;
  private isReconciling = false;

  private broadcastChannel: BroadcastChannel | null = null;

  public init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    StorageService.registerSyncListener((key) => {
      this.handleLocalKeyWrite(key);
    });

    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data as SyncWsMessage | undefined;
          if (!data || data.senderId === this.clientId) return;
          if (data.type === 'tab:delta' && data.keys && typeof data.keys === 'object') {
            this.applyRemoteKeys(data.keys, false);
          }
        };
      } catch {
        this.broadcastChannel = null;
      }
    }

    window.addEventListener('storage', this.handleStorageEvent);
    window.addEventListener('online', this.handleWakeUp);
    window.addEventListener('focus', this.handleWakeUp);
    window.addEventListener('pageshow', this.handleWakeUp);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    void this.detectAndStart();
  }

  public destroy(): void {
    if (!this.initialized) return;
    this.initialized = false;

    StorageService.registerSyncListener(null);

    if (this.pushDebounceTimer !== null) {
      window.clearTimeout(this.pushDebounceTimer);
      this.pushDebounceTimer = null;
    }
    if (this.wsReconnectTimer !== null) {
      window.clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    this.stopFallbackPoll();
    this.stopPhpPolling();
    if (this.detectRetryTimer !== null) {
      window.clearTimeout(this.detectRetryTimer);
      this.detectRetryTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {
        // ignore
      }
      this.broadcastChannel = null;
    }

    window.removeEventListener('storage', this.handleStorageEvent);
    window.removeEventListener('online', this.handleWakeUp);
    window.removeEventListener('focus', this.handleWakeUp);
    window.removeEventListener('pageshow', this.handleWakeUp);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleStorageEvent = (e: StorageEvent): void => {
    if (!e.key || !SYNC_KEY_SET.has(e.key)) return;
    window.dispatchEvent(new Event('app-storage-updated'));
  };

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.handleWakeUp();
    } else if (this.mode === 'php') {
      this.stopPhpPolling();
    }
  };

  private handleWakeUp = (): void => {
    if (this.mode === 'detecting' || this.mode === 'offline') {
      void this.detectAndStart();
      return;
    }
    if (this.mode === 'node') {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connectWebSocket();
      }
      void this.reconcileFromServer();
      void this.flushDirtyKeys();
      return;
    }
    if (this.mode === 'php') {
      this.startPhpPolling();
      void this.pollPhpOnce();
      void this.flushDirtyKeys();
    }
  };

  private async detectAndStart(): Promise<void> {
    if (this.detectRetryTimer !== null) {
      window.clearTimeout(this.detectRetryTimer);
      this.detectRetryTimer = null;
    }

    const nodeState = await fetchJsonWithTimeout<SyncStateResponse>('/api/sync/state');
    if (nodeState && nodeState.ok === true) {
      this.mode = 'node';
      await this.handleInitialServerState(nodeState);
      this.connectWebSocket();
      if (this.dirtyKeys.size > 0) {
        void this.flushDirtyKeys();
      }
      return;
    }

    const phpState = await fetchJsonWithTimeout<SyncStateResponse>('/sync-bridge.php?action=state');
    if (phpState && phpState.ok === true) {
      this.mode = 'php';
      await this.handleInitialServerState(phpState);
      if (document.visibilityState === 'visible') {
        this.startPhpPolling();
      }
      if (this.dirtyKeys.size > 0) {
        void this.flushDirtyKeys();
      }
      return;
    }

    this.mode = 'offline';
    this.detectRetryTimer = window.setTimeout(() => {
      void this.detectAndStart();
    }, 8000);
  }

  private collectAllLocalPayload(): Record<string, unknown> {
    StorageService.ensureAllCatalogsSeeded(false);
    StorageService.getUsers();
    const payload: Record<string, unknown> = {};
    for (const key of SYNC_KEYS) {
      const val = readLocalParsed(key);
      if (val !== undefined) {
        payload[key] = val;
      }
    }
    return payload;
  }

  private async handleInitialServerState(state: SyncStateResponse): Promise<void> {
    const serverVersion = typeof state.version === 'number' ? state.version : 0;
    const serverKeys = state.keys && typeof state.keys === 'object' ? state.keys : {};

    if (serverVersion === 0 || Object.keys(serverKeys).length === 0) {
      const initialPayload = this.collectAllLocalPayload();
      if (Object.keys(initialPayload).length > 0) {
        const res = await this.pushPayload(initialPayload);
        if (res && typeof res.version === 'number') {
          this.lastKnownVersion = Math.max(this.lastKnownVersion, res.version);
        }
      }
      return;
    }

    this.lastKnownVersion = Math.max(this.lastKnownVersion, serverVersion);
    this.applyRemoteKeys(serverKeys, true);

    if (serverKeys[STORAGE_KEYS.PRODUCTS] === undefined) {
      StorageService.ensureAllCatalogsSeeded(false);
      const localProducts = readLocalParsed(STORAGE_KEYS.PRODUCTS);
      if (Array.isArray(localProducts) && localProducts.length > 0) {
        this.dirtyKeys.add(STORAGE_KEYS.PRODUCTS);
      }
    }
  }

  private applyRemoteKeys(keys: Record<string, unknown>, relayToTabs: boolean): void {
    const appliedSubset: Record<string, unknown> = {};
    let anyChanged = false;

    StorageService.runWithoutSync(() => {
      for (const [key, remoteVal] of Object.entries(keys)) {
        if (!SYNC_KEY_SET.has(key) || remoteVal === undefined) continue;
        if (this.dirtyKeys.has(key)) continue;

        const currentLocal = readLocalParsed(key);
        if (currentLocal !== undefined && stableStringify(currentLocal) === stableStringify(remoteVal)) {
          continue;
        }

        try {
          localStorage.setItem(key, JSON.stringify(remoteVal));
          appliedSubset[key] = remoteVal;
          anyChanged = true;
        } catch (err) {
          console.error(`Failed applying synced key ${key}:`, err);
        }
      }
    }, false);

    if (anyChanged) {
      window.dispatchEvent(new Event('app-storage-updated'));
      if (relayToTabs && this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage({
            type: 'tab:delta',
            senderId: this.clientId,
            keys: appliedSubset,
          });
        } catch {
          // ignore
        }
      }
    }
  }

  private handleLocalKeyWrite(key: string): void {
    if (!SYNC_KEY_SET.has(key)) return;

    this.dirtyKeys.add(key);

    if (this.broadcastChannel) {
      const val = readLocalParsed(key);
      if (val !== undefined) {
        try {
          this.broadcastChannel.postMessage({
            type: 'tab:delta',
            senderId: this.clientId,
            keys: { [key]: val },
          });
        } catch {
          // ignore
        }
      }
    }

    if (this.pushDebounceTimer !== null) {
      window.clearTimeout(this.pushDebounceTimer);
    }
    this.pushDebounceTimer = window.setTimeout(() => {
      this.pushDebounceTimer = null;
      void this.flushDirtyKeys();
    }, 120);
  }

  private async pushPayload(
    changes: Record<string, unknown>
  ): Promise<{ ok: boolean; version?: number } | null> {
    const endpoint =
      this.mode === 'node'
        ? '/api/sync/push'
        : this.mode === 'php'
        ? '/sync-bridge.php?action=push'
        : null;
    if (!endpoint) return null;

    const resp = await fetchJsonWithTimeout<{ ok?: boolean; version?: number }>(
      endpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: this.clientId,
          changes,
        }),
      },
      8000
    );

    if (!resp || resp.ok !== true) return null;
    return { ok: true, version: resp.version };
  }

  private async flushDirtyKeys(): Promise<void> {
    if (this.isFlushing) {
      this.needsAnotherFlush = true;
      return;
    }
    if (this.dirtyKeys.size === 0) return;
    if (this.mode !== 'node' && this.mode !== 'php') return;

    this.isFlushing = true;
    try {
      do {
        this.needsAnotherFlush = false;
        const keysToPush = Array.from(this.dirtyKeys);
        if (keysToPush.length === 0) break;

        this.dirtyKeys.clear();
        const changes: Record<string, unknown> = {};
        for (const key of keysToPush) {
          const val = readLocalParsed(key);
          if (val !== undefined) {
            changes[key] = val;
          }
        }

        if (Object.keys(changes).length === 0) continue;

        const res = await this.pushPayload(changes);
        if (res && res.ok) {
          if (typeof res.version === 'number') {
            this.lastKnownVersion = Math.max(this.lastKnownVersion, res.version);
          }
        } else {
          for (const key of keysToPush) {
            this.dirtyKeys.add(key);
          }
          break;
        }
      } while (this.needsAnotherFlush || this.dirtyKeys.size > 0);
    } finally {
      this.isFlushing = false;
    }
  }

  private async reconcileFromServer(): Promise<void> {
    if (this.isReconciling || (this.mode !== 'node' && this.mode !== 'php')) return;
    this.isReconciling = true;
    try {
      const base = this.mode === 'node' ? '/api/sync/state' : '/sync-bridge.php?action=state';
      const sep = base.includes('?') ? '&' : '?';
      const url =
        this.lastKnownVersion > 0 ? `${base}${sep}since=${this.lastKnownVersion}` : base;

      const data = await fetchJsonWithTimeout<SyncStateResponse>(url, {}, 5000);
      if (!data || data.ok !== true) return;

      if (typeof data.version === 'number') {
        if (data.version === 0 && this.lastKnownVersion === 0) {
          const initialPayload = this.collectAllLocalPayload();
          if (Object.keys(initialPayload).length > 0) {
            const res = await this.pushPayload(initialPayload);
            if (res && typeof res.version === 'number') {
              this.lastKnownVersion = Math.max(this.lastKnownVersion, res.version);
            }
          }
          return;
        }
        this.lastKnownVersion = Math.max(this.lastKnownVersion, data.version);
      }

      if (data.keys && typeof data.keys === 'object' && Object.keys(data.keys).length > 0) {
        this.applyRemoteKeys(data.keys, true);
      }
    } finally {
      this.isReconciling = false;
    }
  }

  private connectWebSocket(): void {
    if (this.mode !== 'node' || typeof window === 'undefined') return;
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/sync?clientId=${encodeURIComponent(
      this.clientId
    )}`;

    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        this.wsReconnectAttempts = 0;
        this.stopFallbackPoll();
        try {
          socket.send(JSON.stringify({ type: 'identify', senderId: this.clientId }));
        } catch {
          // ignore
        }
        void this.reconcileFromServer();
        void this.flushDirtyKeys();
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(String(event.data || '{}')) as SyncWsMessage;
          if (msg.type === 'sync:hello') {
            if (typeof msg.version === 'number' && msg.version !== this.lastKnownVersion) {
              void this.reconcileFromServer();
            }
            return;
          }
          if (msg.type === 'sync:delta') {
            const msgVer = typeof msg.version === 'number' ? msg.version : 0;
            if (msg.senderId === this.clientId) {
              if (msgVer > this.lastKnownVersion) {
                this.lastKnownVersion = msgVer;
              }
              return;
            }
            if (msgVer > 0 && this.lastKnownVersion > 0 && msgVer > this.lastKnownVersion + 1) {
              void this.reconcileFromServer();
              return;
            }
            if (msgVer > this.lastKnownVersion) {
              this.lastKnownVersion = msgVer;
            }
            if (msg.keys && typeof msg.keys === 'object') {
              this.applyRemoteKeys(msg.keys, true);
            }
          }
        } catch {
          // ignore malformed messages
        }
      };

      socket.onclose = () => {
        if (this.ws === socket) {
          this.ws = null;
        }
        this.startFallbackPoll();
        this.scheduleWsReconnect();
      };

      socket.onerror = () => {
        try {
          socket.close();
        } catch {
          // ignore
        }
      };
    } catch {
      this.startFallbackPoll();
      this.scheduleWsReconnect();
    }
  }

  private scheduleWsReconnect(): void {
    if (this.mode !== 'node' || !this.initialized) return;
    if (this.wsReconnectTimer !== null) return;

    const delay = Math.min(1000 * Math.pow(2, this.wsReconnectAttempts), 10000);
    this.wsReconnectAttempts += 1;
    this.wsReconnectTimer = window.setTimeout(() => {
      this.wsReconnectTimer = null;
      this.connectWebSocket();
    }, delay);
  }

  private startFallbackPoll(): void {
    if (this.fallbackPollTimer !== null) return;
    this.fallbackPollTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void this.reconcileFromServer();
      }
    }, 10000);
  }

  private stopFallbackPoll(): void {
    if (this.fallbackPollTimer !== null) {
      window.clearInterval(this.fallbackPollTimer);
      this.fallbackPollTimer = null;
    }
  }

  private startPhpPolling(): void {
    if (this.phpPollTimer !== null) return;
    this.phpPollTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void this.pollPhpOnce();
      }
    }, 1800);
  }

  private stopPhpPolling(): void {
    if (this.phpPollTimer !== null) {
      window.clearInterval(this.phpPollTimer);
      this.phpPollTimer = null;
    }
  }

  private async pollPhpOnce(): Promise<void> {
    if (this.isReconciling || this.mode !== 'php') return;
    this.isReconciling = true;
    try {
      const url = `/sync-bridge.php?action=poll&since=${this.lastKnownVersion}`;
      const data = await fetchJsonWithTimeout<SyncStateResponse>(url, {}, 5000);
      if (!data || data.ok !== true) return;

      if (data.changed) {
        if (typeof data.version === 'number') {
          this.lastKnownVersion = Math.max(this.lastKnownVersion, data.version);
        }
        if (data.keys && typeof data.keys === 'object' && Object.keys(data.keys).length > 0) {
          this.applyRemoteKeys(data.keys, true);
        }
      }
    } finally {
      this.isReconciling = false;
    }
  }
}

export const LiveSyncService = new LiveSyncManager();
