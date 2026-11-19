import {
  User,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from '../firebase';
import {
  AppUser,
  ContactsInfo,
  Customer,
  DealerDeal,
  DeliveryChallan,
  Invoice,
  NoticeBanner,
  Payment,
  Product,
  ShopConfig,
  SmsGatewaySettings,
  SmsLog,
  StaffPermissions,
  StockInRecord,
  Txn,
} from '../types';
import {
  STORAGE_KEYS,
  StorageService,
  defaultContactsInfo,
  defaultNoticeBanner,
  defaultPaymentMethods,
  defaultShop,
  defaultSmsSettings,
  defaultStaffPermissions,
} from './storage';
import { getTodayLocalDateStr } from '../utils/numberWords';

export type CloudSyncStatus =
  | 'disconnected'
  | 'connecting'
  | 'syncing'
  | 'synced'
  | 'error';

export interface CloudSyncState {
  status: CloudSyncStatus;
  userEmail: string | null;
  userName: string | null;
  userUid: string | null;
  lastSyncedAt: string | null;
  errorMessage: string | null;
  pendingCount: number;
}

type CollectionName =
  | 'shops'
  | 'products'
  | 'customers'
  | 'invoices'
  | 'payments'
  | 'txns'
  | 'stock_ins'
  | 'delivery_challans'
  | 'dealers'
  | 'app_users'
  | 'sms_logs'
  | 'sms_settings'
  | 'app_metadata';

const ALL_COLLECTIONS: CollectionName[] = [
  'shops',
  'invoices',
  'products',
  'customers',
  'payments',
  'txns',
  'stock_ins',
  'delivery_challans',
  'dealers',
  'app_users',
  'sms_logs',
  'sms_settings',
  'app_metadata',
];

const CHUNK_SIZE = 320;

interface KnownDocMeta {
  createdAt: Timestamp | null;
  hash: string;
}

interface PendingOp {
  type: 'set' | 'delete';
  col: CollectionName;
  docId: string;
  payload?: Record<string, unknown>;
  hash?: string;
}

function s(val: unknown, maxLen: number, fallback = ''): string {
  const str = typeof val === 'string' ? val : val == null ? '' : String(val);
  const trimmed = str.length > maxLen ? str.slice(0, maxLen) : str;
  return trimmed.length === 0 && fallback ? fallback.slice(0, maxLen) : trimmed;
}

function n(val: unknown, fallback = 0): number {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

function cleanId(raw: unknown, fallback = 'id_1'): string {
  const cleaned = String(raw ?? '')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .slice(0, 100);
  return cleaned.length > 0 ? cleaned : fallback;
}

function stripUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (obj && typeof obj === 'object' && !(obj instanceof Timestamp)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefined(v);
      }
    }
    return out as T;
  }
  return obj;
}

function stableStringify(val: unknown): string {
  if (val === null || val === undefined) return 'null';
  if (Array.isArray(val)) {
    return '[' + val.map((item) => stableStringify(item)).join(',') + ']';
  }
  if (typeof val === 'object') {
    if (val instanceof Timestamp) {
      return `"ts:${val.seconds}:${val.nanoseconds}"`;
    }
    const keys = Object.keys(val as Record<string, unknown>).sort();
    const parts: string[] = [];
    for (const k of keys) {
      const v = (val as Record<string, unknown>)[k];
      if (v !== undefined) {
        parts.push(`${JSON.stringify(k)}:${stableStringify(v)}`);
      }
    }
    return '{' + parts.join(',') + '}';
  }
  return JSON.stringify(val);
}

function computeHash(payload: Record<string, unknown>): string {
  return stableStringify(payload);
}

function formatSyncTime(): string {
  return new Date().toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function parseFriendlySyncError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('Quota exceeded') || raw.includes('resource-exhausted')) {
    return 'Firestore ফ্রি কোটা পূর্ণ হয়েছে। আগামীকাল রিসেট হবে অথবা কনসোল থেকে আপগ্রেড করুন।';
  }
  if (raw.includes('permission-denied') || raw.includes('Missing or insufficient permissions')) {
    return 'Firestore পারমিশন ত্রুটি: অনুগ্রহ করে যাচাইকৃত Google অ্যাকাউন্ট দিয়ে পুনরায় লগিন করুন।';
  }
  if (raw.includes('unavailable') || raw.includes('offline')) {
    return 'ইন্টারনেট সংযোগ বা Firestore সার্ভার সাময়িকভাবে অপ্রাপ্য। অনলাইন হলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।';
  }
  return `সিঙ্ক ত্রুটি: ${raw.slice(0, 140)}`;
}

class FirestoreSyncManager {
  private state: CloudSyncState = {
    status: 'disconnected',
    userEmail: null,
    userName: null,
    userUid: null,
    lastSyncedAt: null,
    errorMessage: null,
    pendingCount: 0,
  };

  private stateListeners = new Set<(state: CloudSyncState) => void>();
  private unsubAuth: Unsubscribe | null = null;
  private unsubSnapshots: Unsubscribe[] = [];
  private currentUser: User | null = null;
  private isBootstrapped = false;
  private isReadyForLocalWrites = false;

  // Map<"col/docId", KnownDocMeta>
  private knownDocs = new Map<string, KnownDocMeta>();
  // Map<CollectionName, Set<docId>>
  private knownColIds = new Map<CollectionName, Set<string>>();

  private dirtyKeys = new Set<string>();
  private flushingCols = new Set<CollectionName>();
  private flushTimer: number | null = null;
  private flushPromise: Promise<void> = Promise.resolve();

  constructor() {
    for (const col of ALL_COLLECTIONS) {
      this.knownColIds.set(col, new Set());
    }
  }

  private lastFocusPullAt = 0;

  public init(): void {
    if (this.unsubAuth) return;

    StorageService.registerSyncListener((storageKey) => {
      this.handleLocalStorageMutation(storageKey);
    });

    if (typeof window !== 'undefined') {
      const handleAppResume = () => {
        if (!this.currentUser || !this.isBootstrapped) return;
        const now = Date.now();
        if (this.dirtyKeys.size > 0) {
          void this.syncNow();
        } else if (now - this.lastFocusPullAt > 15000) {
          this.lastFocusPullAt = now;
          void this.forcePullFromCloud();
        }
      };

      window.addEventListener('online', () => {
        if (!this.currentUser || !this.isBootstrapped) return;
        void this.syncNow();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          handleAppResume();
        }
      });

      window.addEventListener('focus', handleAppResume);
      window.addEventListener('pageshow', handleAppResume);

      void getRedirectResult(auth).catch((err) => {
        const msg = this.formatGoogleAuthError(err);
        if (msg) {
          this.updateState({
            status: 'error',
            errorMessage: msg,
          });
        }
      });
    }

    this.unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        this.currentUser = user;
        void this.startSessionSync(user);
      } else {
        this.teardownSessionSync();
        this.currentUser = null;
        this.updateState({
          status: user && !user.emailVerified ? 'error' : 'disconnected',
          userEmail: user?.email || null,
          userName: user?.displayName || null,
          userUid: null,
          errorMessage:
            user && !user.emailVerified
              ? 'অনুগ্রহ করে ভেরিফায়েড Google ইমেইল অ্যাকাউন্ট দিয়ে লগিন করুন।'
              : null,
          pendingCount: 0,
        });
      }
    });
  }

  public clearError(): void {
    this.updateState({
      status: this.currentUser ? 'synced' : 'disconnected',
      errorMessage: null,
    });
  }

  public subscribe(listener: (state: CloudSyncState) => void): () => void {
    this.stateListeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public getState(): CloudSyncState {
    return { ...this.state };
  }

  private updateState(patch: Partial<CloudSyncState>): void {
    this.state = { ...this.state, ...patch };
    const snap = { ...this.state };
    this.stateListeners.forEach((cb) => cb(snap));
  }

  private formatGoogleAuthError(err: unknown): string {
    const code = (err as { code?: string })?.code || '';
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (code === 'auth/popup-blocked') {
      return 'ব্রাউজারে Pop-up ব্লক করা আছে। ব্রাউজার সেটিংস থেকে Pop-up Allow করে আবার চেষ্টা করুন বা নতুন ট্যাবে খুলুন।';
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'Google লগিন পপআপ বন্ধ করা হয়েছে। পুনরায় চেষ্টা করুন।';
    }
    if (code === 'auth/unauthorized-domain') {
      return `এই ডোমেইন (${host}) Firebase Auth Authorized Domains-এ যুক্ত করা নেই। Firebase Console > Authentication > Settings > Authorized domains-এ "${host}" যোগ করুন।`;
    }
    if (code === 'auth/network-request-failed') {
      return 'ইন্টারনেট সংযোগ ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করে আবার চেষ্টা করুন।';
    }
    if (code === 'auth/operation-not-supported-in-this-environment' || code === 'auth/web-storage-unsupported') {
      return 'এই ব্রাউজারে Google পপআপ/স্টোরেজ সমর্থিত নয়। অনুগ্রহ করে Chrome বা Safari-এর মূল ব্রাউজারে খুলুন (In-App ব্রাউজার নয়)।';
    }
    if (err instanceof Error && err.message) {
      return `Google লগিন ত্রুটি: ${err.message.slice(0, 140)}`;
    }
    return 'Google লগিন সম্পন্ন হয়নি। পুনরায় চেষ্টা করুন।';
  }

  public async signInWithGoogle(): Promise<boolean> {
    try {
      this.updateState({ status: 'connecting', errorMessage: null });
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      const isTopLevelWindow =
        typeof window !== 'undefined' &&
        (() => {
          try {
            return window.self === window.top;
          } catch {
            return false;
          }
        })();

      if (
        isTopLevelWindow &&
        (code === 'auth/popup-blocked' ||
          code === 'auth/operation-not-supported-in-this-environment')
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return true;
        } catch (redirectErr) {
          this.updateState({
            status: 'error',
            errorMessage: this.formatGoogleAuthError(redirectErr),
          });
          return false;
        }
      }

      this.updateState({
        status: 'error',
        errorMessage: this.formatGoogleAuthError(err),
      });
      return false;
    }
  }

  public async signOutGoogle(): Promise<void> {
    this.teardownSessionSync();
    await signOut(auth);
    this.updateState({
      status: 'disconnected',
      userEmail: null,
      userName: null,
      userUid: null,
      lastSyncedAt: null,
      errorMessage: null,
      pendingCount: 0,
    });
  }

  private teardownSessionSync(): void {
    this.isReadyForLocalWrites = false;
    this.isBootstrapped = false;
    if (this.flushTimer !== null) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.dirtyKeys.clear();
    this.flushingCols.clear();
    this.unsubSnapshots.forEach((unsub) => unsub());
    this.unsubSnapshots = [];
    this.knownDocs.clear();
    for (const col of ALL_COLLECTIONS) {
      this.knownColIds.set(col, new Set());
    }
  }

  private async startSessionSync(user: User): Promise<void> {
    this.teardownSessionSync();
    this.currentUser = user;
    this.updateState({
      status: 'connecting',
      userEmail: user.email,
      userName: user.displayName,
      userUid: user.uid,
      errorMessage: null,
    });

    try {
      const { hasCloudData, missingLocalKeysToPush } = await this.pullFromCloudServer(user.uid, false);
      this.isBootstrapped = true;

      if (!hasCloudData) {
        await this.pushAllLocalToCloud();
      } else if (missingLocalKeysToPush.length > 0) {
        missingLocalKeysToPush.forEach((k) => this.dirtyKeys.add(k));
        await this.flushDirtyKeys();
      }

      this.attachRealtimeListeners(user.uid);
      this.isReadyForLocalWrites = true;
      this.updateState({
        status: this.dirtyKeys.size > 0 ? 'error' : 'synced',
        lastSyncedAt: formatSyncTime(),
        errorMessage: this.dirtyKeys.size > 0 ? this.state.errorMessage : null,
        pendingCount: this.dirtyKeys.size,
      });
    } catch (err) {
      this.updateState({
        status: 'error',
        errorMessage: parseFriendlySyncError(err),
      });
    }
  }

  public async syncNow(): Promise<boolean> {
    if (!this.currentUser) return false;
    if (this.dirtyKeys.size > 0) {
      await this.flushDirtyKeys();
      if (this.state.status === 'error') return false;
    }
    return this.forcePullFromCloud();
  }

  public async forcePullFromCloud(): Promise<boolean> {
    if (!this.currentUser) return false;
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      await this.pullFromCloudServer(this.currentUser.uid, true);
      this.updateState({
        status: 'synced',
        lastSyncedAt: formatSyncTime(),
        errorMessage: null,
      });
      return true;
    } catch (err) {
      this.updateState({
        status: 'error',
        errorMessage: parseFriendlySyncError(err),
      });
      return false;
    }
  }

  public async pushAllLocalToCloud(): Promise<boolean> {
    if (!this.currentUser) return false;
    const allKeys = [
      STORAGE_KEYS.SHOP,
      STORAGE_KEYS.INVOICES,
      STORAGE_KEYS.PRODUCTS,
      STORAGE_KEYS.CUSTOMERS,
      STORAGE_KEYS.PAYMENTS,
      STORAGE_KEYS.TXNS,
      STORAGE_KEYS.STOCK_INS,
      STORAGE_KEYS.DELIVERY_CHALLANS,
      STORAGE_KEYS.DEALERS,
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.SMS_LOGS,
      STORAGE_KEYS.SMS_SETTINGS,
      STORAGE_KEYS.CATEGORIES,
      STORAGE_KEYS.VENDORS,
      STORAGE_KEYS.PAYMENT_METHODS,
      STORAGE_KEYS.STAFF_PERMS,
      STORAGE_KEYS.NOTICE,
      STORAGE_KEYS.CONTACTS,
    ];
    allKeys.forEach((k) => this.dirtyKeys.add(k));
    await this.flushDirtyKeys();
    return this.state.status !== 'error';
  }

  private async pullFromCloudServer(
    uid: string,
    explicitForcePull: boolean
  ): Promise<{ hasCloudData: boolean; missingLocalKeysToPush: string[] }> {
    const fetched = new Map<CollectionName, QuerySnapshot<DocumentData>>();

    await Promise.all(
      ALL_COLLECTIONS.map(async (col) => {
        const q = query(collection(db, col), where('ownerUid', '==', uid));
        try {
          const snap = await getDocsFromServer(q);
          fetched.set(col, snap);
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, col);
        }
      })
    );

    let totalDocs = 0;
    fetched.forEach((snap) => {
      totalDocs += snap.docs.length;
    });

    if (totalDocs === 0 && !explicitForcePull) {
      return { hasCloudData: false, missingLocalKeysToPush: [] };
    }

    const metaSnap = fetched.get('app_metadata');
    const shopSnap = fetched.get('shops');
    const isEstablishedWorkspace = Boolean(
      (metaSnap && metaSnap.docs.some((d) => d.data().kind === 'lists')) ||
        (shopSnap && shopSnap.docs.length > 0)
    );

    const missingLocalKeysToPush: string[] = [];

    StorageService.runWithoutSync(() => {
      ALL_COLLECTIONS.forEach((col) => {
        const snap = fetched.get(col);
        if (!snap) return;

        const docCount = snap.docs.length;
        if (!explicitForcePull && docCount === 0) {
          if (col === 'shops') {
            missingLocalKeysToPush.push(STORAGE_KEYS.SHOP);
            return;
          }
          if (col === 'app_users') {
            missingLocalKeysToPush.push(STORAGE_KEYS.USERS);
            return;
          }
          if (col === 'sms_settings') {
            missingLocalKeysToPush.push(STORAGE_KEYS.SMS_SETTINGS);
            return;
          }
          if (col === 'products' && StorageService.getProducts().length > 0) {
            missingLocalKeysToPush.push(STORAGE_KEYS.PRODUCTS);
            return;
          }
          if (col === 'app_metadata') {
            missingLocalKeysToPush.push(
              STORAGE_KEYS.CATEGORIES,
              STORAGE_KEYS.VENDORS,
              STORAGE_KEYS.PAYMENT_METHODS,
              STORAGE_KEYS.STAFF_PERMS,
              STORAGE_KEYS.NOTICE,
              STORAGE_KEYS.CONTACTS
            );
            return;
          }
          if (!isEstablishedWorkspace) {
            if (col === 'customers' && StorageService.getCustomers().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.CUSTOMERS);
              return;
            }
            if (col === 'invoices' && StorageService.getInvoices().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.INVOICES);
              return;
            }
            if (col === 'payments' && StorageService.getPayments().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.PAYMENTS);
              return;
            }
            if (col === 'txns' && StorageService.getTxns().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.TXNS);
              return;
            }
            if (col === 'stock_ins' && StorageService.getStockInRecords().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.STOCK_INS);
              return;
            }
            if (col === 'delivery_challans' && StorageService.getDeliveryChallans().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.DELIVERY_CHALLANS);
              return;
            }
            if (col === 'dealers' && StorageService.getDealers().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.DEALERS);
              return;
            }
            if (col === 'sms_logs' && StorageService.getSmsLogs().length > 0) {
              missingLocalKeysToPush.push(STORAGE_KEYS.SMS_LOGS);
              return;
            }
          }
        }

        this.applySnapshotToLocal(uid, col, snap, !explicitForcePull);
      });
    }, true);

    return { hasCloudData: true, missingLocalKeysToPush };
  }

  private isCollectionDirty(col: CollectionName): boolean {
    if (this.flushingCols.has(col)) return true;
    for (const k of this.dirtyKeys) {
      if (this.mapStorageKeyToCollections(k).includes(col)) {
        return true;
      }
    }
    return false;
  }

  private attachRealtimeListeners(uid: string): void {
    this.unsubSnapshots.forEach((u) => u());
    this.unsubSnapshots = [];

    for (const col of ALL_COLLECTIONS) {
      const q = query(collection(db, col), where('ownerUid', '==', uid));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (!this.isBootstrapped) return;
          if (snap.metadata.hasPendingWrites) return;
          if (snap.metadata.fromCache && snap.docs.length === 0) return;
          if (this.isCollectionDirty(col)) return;

          StorageService.runWithoutSync(() => {
            const changed = this.applySnapshotToLocal(uid, col, snap, false);
            if (changed) {
              window.dispatchEvent(new Event('app-storage-updated'));
            }
          }, false);

          this.updateState({
            status: this.dirtyKeys.size > 0 ? 'syncing' : 'synced',
            lastSyncedAt: formatSyncTime(),
          });
        },
        (error) => {
          try {
            handleFirestoreError(error, OperationType.GET, col);
          } catch (wrapped) {
            this.updateState({
              status: 'error',
              errorMessage: parseFriendlySyncError(wrapped),
            });
          }
        }
      );
      this.unsubSnapshots.push(unsub);
    }
  }

  private recordKnownDocsFromSnapshot(
    uid: string,
    col: CollectionName,
    snap: QuerySnapshot<DocumentData>
  ): void {
    const idSet = new Set<string>();
    snap.docs.forEach((d) => {
      idSet.add(d.id);
      const data = d.data();
      const createdAt =
        data.createdAt instanceof Timestamp ? data.createdAt : null;
      const comparable = this.normalizeComparableFromDoc(uid, col, data);
      this.knownDocs.set(`${col}/${d.id}`, {
        createdAt,
        hash: comparable ? computeHash(comparable) : '',
      });
    });

    // Clear removed docs from knownDocs
    const prevIds = this.knownColIds.get(col) || new Set<string>();
    prevIds.forEach((oldId) => {
      if (!idSet.has(oldId)) {
        this.knownDocs.delete(`${col}/${oldId}`);
      }
    });
    this.knownColIds.set(col, idSet);
  }

  private applySnapshotToLocal(
    uid: string,
    col: CollectionName,
    snap: QuerySnapshot<DocumentData>,
    isInitialHydration: boolean
  ): boolean {
    const prevCount = this.knownColIds.get(col)?.size || 0;
    this.recordKnownDocsFromSnapshot(uid, col, snap);
    const docs = snap.docs.map((d) => d.data());

    if (col === 'shops') {
      if (docs.length === 0) return false;
      const raw = docs[0];
      const nextShop: ShopConfig = {
        name: s(raw.name, 200, defaultShop.name),
        address: s(raw.address, 500),
        phones: s(raw.phones, 200),
        web: s(raw.web, 200),
        note: s(raw.note, 2000),
        preparedBy: s(raw.preparedBy, 150),
        startInvoiceNo: s(raw.startInvoiceNo, 30, '1001'),
        footerText: s(raw.footerText, 500),
        logoUrl: s(raw.logoUrl, 500000),
      };
      const cur = StorageService.getShop();
      if (stableStringify(cur) === stableStringify(nextShop)) return false;
      StorageService.saveShop(nextShop, true);
      return true;
    }

    if (col === 'products') {
      // Do not wipe local catalog when cloud never had products yet
      if (docs.length === 0 && (isInitialHydration || prevCount === 0)) return false;
      const nextList: Product[] = docs
        .map((d) => ({
          id: n(d.id),
          code: s(d.code, 80),
          category: s(d.category, 100),
          vendor: typeof d.vendor === 'string' ? d.vendor : '',
          grade: typeof d.grade === 'string' ? d.grade : '',
          name: s(d.name, 200),
          isTile: Boolean(d.isTile),
          w: n(d.w),
          h: n(d.h),
          scm: n(d.scm),
          sftPack: n(d.sftPack),
          qtyPack: n(d.qtyPack),
          rate: n(d.rate),
          price: n(d.price),
          stockBox: n(d.stockBox),
          stockPiece: n(d.stockPiece),
          stockSft: n(d.stockSft),
        }))
        .sort((a, b) => a.id - b.id);
      const cur = StorageService.getProducts();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveProducts(nextList, true);
      return true;
    }

    if (col === 'customers') {
      const nextList: Customer[] = docs
        .map((d) => {
          const item: Customer = {
            id: n(d.id),
            name: s(d.name, 200),
            address: s(d.address, 400),
            phone: s(d.phone, 50),
            deal: s(d.deal, 150),
            openDue: n(d.openDue),
          };
          if (typeof d.smsOptOut === 'boolean') item.smsOptOut = d.smsOptOut;
          if (typeof d.smsConsent === 'boolean') item.smsConsent = d.smsConsent;
          if (typeof d.smsConsentUpdatedAt === 'string') {
            item.smsConsentUpdatedAt = d.smsConsentUpdatedAt;
          }
          return item;
        })
        .sort((a, b) => a.id - b.id);
      const cur = StorageService.getCustomers();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveCustomers(nextList, true);
      return true;
    }

    if (col === 'invoices') {
      const nextList: Invoice[] = docs
        .map((d) => ({
          no: n(d.no),
          date: s(d.date, 40),
          custId: n(d.custId),
          custName: s(d.custName, 200),
          address: s(d.address, 400),
          phone: s(d.phone, 50),
          deal: s(d.deal, 150),
          comment: s(d.comment, 1000),
          labor: n(d.labor),
          discount: n(d.discount),
          prevDue: n(d.prevDue),
          cash: n(d.cash),
          bank: n(d.bank),
          bkash: n(d.bkash),
          items: Array.isArray(d.items) ? d.items : [],
          deliveryStatus:
            d.deliveryStatus === 'partial' || d.deliveryStatus === 'delivered'
              ? d.deliveryStatus
              : 'pending',
        }))
        .sort((a, b) => b.no - a.no);
      const cur = StorageService.getInvoices();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveInvoices(nextList, true);
      return true;
    }

    if (col === 'payments') {
      const nextList: Payment[] = docs
        .map((d) => ({
          id: n(d.id),
          date: s(d.date, 40),
          custId: n(d.custId),
          custName: s(d.custName, 200),
          amount: n(d.amount),
          discount: n(d.discount),
          remark: s(d.remark, 500),
          method: s(d.method, 60, 'Cash'),
        }))
        .sort((a, b) => b.id - a.id);
      const cur = StorageService.getPayments();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.savePayments(nextList, true);
      return true;
    }

    if (col === 'txns') {
      const nextList: Txn[] = docs
        .map((d) => ({
          id: n(d.id),
          date: s(d.date, 40),
          isIncome: Boolean(d.isIncome),
          head: s(d.head, 300),
          amount: n(d.amount),
        }))
        .sort((a, b) => b.id - a.id);
      const cur = StorageService.getTxns();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveTxns(nextList, true);
      return true;
    }

    if (col === 'stock_ins') {
      const nextList: StockInRecord[] = docs
        .map((d) => ({
          id: n(d.id),
          vendorName: s(d.vendorName, 150),
          vendorChallanNo: s(d.vendorChallanNo, 80),
          referenceNo: s(d.referenceNo, 80),
          date: s(d.date, 40),
          note: s(d.note, 500),
          items: Array.isArray(d.items) ? d.items : [],
          totalAmount: n(d.totalAmount),
          receivedBy: s(d.receivedBy, 120),
        }))
        .sort((a, b) => b.id - a.id);
      const cur = StorageService.getStockInRecords();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveStockInRecords(nextList, true);
      return true;
    }

    if (col === 'delivery_challans') {
      const nextList: DeliveryChallan[] = docs
        .map((d) => ({
          id: n(d.id),
          challanNo: s(d.challanNo, 80),
          outType: d.outType === 'manual' ? ('manual' as const) : ('challan' as const),
          manualRefNo: s(d.manualRefNo, 80),
          invoiceNo: n(d.invoiceNo),
          custId: n(d.custId),
          custName: s(d.custName, 200),
          address: s(d.address, 400),
          phone: s(d.phone, 50),
          deal: s(d.deal, 150),
          date: s(d.date, 40),
          vehicleNo: s(d.vehicleNo, 80),
          driverName: s(d.driverName, 120),
          driverPhone: s(d.driverPhone, 50),
          note: s(d.note, 500),
          items: Array.isArray(d.items) ? d.items : [],
          dispatchedBy: s(d.dispatchedBy, 120),
        }))
        .sort((a, b) => b.id - a.id);
      const cur = StorageService.getDeliveryChallans();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveDeliveryChallans(nextList, true);
      return true;
    }

    if (col === 'dealers') {
      const nextList: DealerDeal[] = docs
        .map((d) => ({
          id: n(d.id),
          name: s(d.name, 150),
          phone: s(d.phone, 50),
          address: s(d.address, 300),
          note: s(d.note, 400),
        }))
        .sort((a, b) => a.id - b.id);
      const cur = StorageService.getDealers();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveDealers(nextList, true);
      return true;
    }

    if (col === 'app_users') {
      if (docs.length === 0) return false;
      const nextList: AppUser[] = docs
        .map((d) => ({
          id: s(d.id, 100),
          username: s(d.username, 80),
          name: s(d.name, 150),
          role: d.role === 'staff' ? ('staff' as const) : ('admin' as const),
          password: s(d.password, 128),
          phone: s(d.phone, 50),
          createdAt: s(d.userCreatedAt, 64, getTodayLocalDateStr()),
        }))
        .sort((a, b) => a.id.localeCompare(b.id));
      const cur = StorageService.getUsers();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveUsers(nextList, true);
      return true;
    }

    if (col === 'sms_logs') {
      const nextList: SmsLog[] = docs
        .map((d) => {
          const item: SmsLog = {
            id: n(d.id),
            date: s(d.date, 40),
            custName: s(d.custName, 200),
            phone: s(d.phone, 50),
            triggerType: d.triggerType || 'custom',
            referenceNo: s(d.referenceNo, 80),
            message: s(d.message, 1600),
            provider: d.provider || 'sandbox',
            providerMessageId: s(d.providerMessageId, 150),
            status: d.status || 'SENT',
            deliveryStatus: d.deliveryStatus || 'SENT',
            isUnicode: Boolean(d.isUnicode),
            parts: n(d.parts, 1),
            cost: n(d.cost, 0),
            sentBy: s(d.sentBy, 120),
            error: s(d.error, 400),
          };
          if (typeof d.custId === 'number') item.custId = d.custId;
          return item;
        })
        .sort((a, b) => b.id - a.id);
      const cur = StorageService.getSmsLogs();
      if (stableStringify(cur) === stableStringify(nextList)) return false;
      StorageService.saveSmsLogs(nextList, true);
      return true;
    }

    if (col === 'sms_settings') {
      if (docs.length === 0) return false;
      const d = docs[0];
      const nextSettings: SmsGatewaySettings = {
        ...defaultSmsSettings,
        smsEnabled: Boolean(d.smsEnabled),
        activeProvider: d.activeProvider || 'sandbox',
        senderId: s(d.senderId, 40, 'MYSHOP'),
        costPerSms: n(d.costPerSms, 0.35),
        duplicateWindowMinutes: n(d.duplicateWindowMinutes, 5),
        requireConsent: Boolean(d.requireConsent),
        appendOptOutText: Boolean(d.appendOptOutText),
        customApiUrl: s(d.customApiUrl, 500),
        customBalanceUrl: s(d.customBalanceUrl, 500),
        customAuthHeader: s(d.customAuthHeader, 300),
        templates: Array.isArray(d.templates) && d.templates.length > 0 ? d.templates : defaultSmsSettings.templates,
        updatedBy: s(d.updatedBy, 120),
      };
      const cur = StorageService.getSmsSettings();
      if (stableStringify(cur) === stableStringify(nextSettings)) return false;
      StorageService.saveSmsSettings(nextSettings, true);
      return true;
    }

    if (col === 'app_metadata') {
      let changed = false;
      docs.forEach((d) => {
        if (d.kind === 'lists') {
          if (Array.isArray(d.categories) && d.categories.length > 0) {
            const curCats = StorageService.getCategories();
            if (stableStringify(curCats) !== stableStringify(d.categories)) {
              StorageService.saveCategories(d.categories as string[], true);
              changed = true;
            }
          }
          if (Array.isArray(d.vendors) && d.vendors.length > 0) {
            const curVends = StorageService.getVendors();
            if (stableStringify(curVends) !== stableStringify(d.vendors)) {
              StorageService.saveVendors(d.vendors as string[], true);
              changed = true;
            }
          }
          if (Array.isArray(d.paymentMethods) && d.paymentMethods.length > 0) {
            const curMethods = StorageService.getPaymentMethods();
            if (stableStringify(curMethods) !== stableStringify(d.paymentMethods)) {
              StorageService.savePaymentMethods(d.paymentMethods as string[], true);
              changed = true;
            }
          }
          if (d.staffPermissions && typeof d.staffPermissions === 'object') {
            const nextPerms: StaffPermissions = {
              ...defaultStaffPermissions,
              ...(d.staffPermissions as Partial<StaffPermissions>),
            };
            const curPerms = StorageService.getStaffPermissions();
            if (stableStringify(curPerms) !== stableStringify(nextPerms)) {
              StorageService.saveStaffPermissions(nextPerms, true);
              changed = true;
            }
          }
        } else if (d.kind === 'notice' && d.notice) {
          const nextNotice: NoticeBanner = {
            ...defaultNoticeBanner,
            ...(d.notice as Partial<NoticeBanner>),
          };
          if (stableStringify(StorageService.getNotice()) !== stableStringify(nextNotice)) {
            StorageService.saveNotice(nextNotice, true);
            changed = true;
          }
        } else if (d.kind === 'contacts' && d.contacts) {
          const nextContacts: ContactsInfo = {
            ...defaultContactsInfo,
            ...(d.contacts as Partial<ContactsInfo>),
          };
          if (stableStringify(StorageService.getContactsInfo()) !== stableStringify(nextContacts)) {
            StorageService.saveContactsInfo(nextContacts, true);
            changed = true;
          }
        }
      });
      return changed;
    }

    return false;
  }

  private handleLocalStorageMutation(storageKey: string): void {
    if (!this.currentUser || !this.isReadyForLocalWrites) return;
    if (
      storageKey === STORAGE_KEYS.CURRENT_USER ||
      storageKey === STORAGE_KEYS.AUTH_SESSION ||
      storageKey === STORAGE_KEYS.GW_CATALOG_SEEDED ||
      storageKey === STORAGE_KEYS.ALL_CATALOGS_SEEDED
    ) {
      return;
    }

    this.dirtyKeys.add(storageKey);
    this.updateState({
      status: 'syncing',
      pendingCount: this.dirtyKeys.size,
      errorMessage: null,
    });

    if (this.flushTimer !== null) {
      window.clearTimeout(this.flushTimer);
    }
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      void this.flushDirtyKeys();
    }, 150);
  }

  private async flushDirtyKeys(): Promise<void> {
    this.flushPromise = this.flushPromise.then(() => this.performFlush());
    return this.flushPromise;
  }

  private async performFlush(): Promise<void> {
    const user = this.currentUser;
    if (!user || !user.emailVerified || this.dirtyKeys.size === 0) return;

    const keysSnapshot = Array.from(this.dirtyKeys);
    const uid = user.uid;

    this.updateState({
      status: 'syncing',
      pendingCount: this.dirtyKeys.size,
      errorMessage: null,
    });

    const targetCollections = new Set<CollectionName>();
    keysSnapshot.forEach((k) => {
      this.mapStorageKeyToCollections(k).forEach((c) => targetCollections.add(c));
    });

    // Deterministic ordering: invoices MUST be written before delivery_challans (existsAfter rule!)
    const orderedCols = ALL_COLLECTIONS.filter((c) => targetCollections.has(c));
    const committedCols = new Set<CollectionName>();

    try {
      orderedCols.forEach((c) => this.flushingCols.add(c));

      for (const col of orderedCols) {
        const ops = this.buildDiffOpsForCollection(uid, col);
        if (ops.length > 0) {
          await this.commitOpsInChunks(ops);
        }
        committedCols.add(col);
      }

      // Remove only keys whose mapped collections all committed cleanly
      keysSnapshot.forEach((k) => {
        const mapped = this.mapStorageKeyToCollections(k);
        if (mapped.every((c) => committedCols.has(c))) {
          this.dirtyKeys.delete(k);
        }
      });

      if (this.dirtyKeys.size === 0) {
        this.updateState({
          status: 'synced',
          lastSyncedAt: formatSyncTime(),
          errorMessage: null,
          pendingCount: 0,
        });
      }
    } catch (err) {
      // Remove keys whose collections succeeded before failure, keep failed keys for retry
      keysSnapshot.forEach((k) => {
        const mapped = this.mapStorageKeyToCollections(k);
        if (mapped.length > 0 && mapped.every((c) => committedCols.has(c))) {
          this.dirtyKeys.delete(k);
        }
      });
      this.updateState({
        status: 'error',
        errorMessage: parseFriendlySyncError(err),
        pendingCount: this.dirtyKeys.size,
      });
    } finally {
      orderedCols.forEach((c) => this.flushingCols.delete(c));
    }
  }

  private mapStorageKeyToCollections(key: string): CollectionName[] {
    switch (key) {
      case STORAGE_KEYS.SHOP:
        return ['shops'];
      case STORAGE_KEYS.PRODUCTS:
        return ['products'];
      case STORAGE_KEYS.CUSTOMERS:
        return ['customers'];
      case STORAGE_KEYS.INVOICES:
        return ['invoices'];
      case STORAGE_KEYS.PAYMENTS:
        return ['payments'];
      case STORAGE_KEYS.TXNS:
        return ['txns'];
      case STORAGE_KEYS.STOCK_INS:
        return ['stock_ins'];
      case STORAGE_KEYS.DELIVERY_CHALLANS:
        return ['delivery_challans'];
      case STORAGE_KEYS.DEALERS:
        return ['dealers'];
      case STORAGE_KEYS.USERS:
        return ['app_users'];
      case STORAGE_KEYS.SMS_LOGS:
        return ['sms_logs'];
      case STORAGE_KEYS.SMS_SETTINGS:
        return ['sms_settings'];
      case STORAGE_KEYS.CATEGORIES:
      case STORAGE_KEYS.VENDORS:
      case STORAGE_KEYS.PAYMENT_METHODS:
      case STORAGE_KEYS.STAFF_PERMS:
      case STORAGE_KEYS.NOTICE:
      case STORAGE_KEYS.CONTACTS:
        return ['app_metadata'];
      default:
        return [];
    }
  }

  private buildDesiredDocs(
    uid: string,
    col: CollectionName
  ): Map<string, Record<string, unknown>> {
    const map = new Map<string, Record<string, unknown>>();

    if (col === 'shops') {
      const shop = StorageService.getShop();
      map.set(`${uid}_shop_main`, {
        ownerUid: uid,
        name: s(shop.name, 200, defaultShop.name),
        address: s(shop.address, 500),
        phones: s(shop.phones, 200),
        web: s(shop.web, 200),
        note: s(shop.note, 2000),
        preparedBy: s(shop.preparedBy, 150),
        startInvoiceNo: s(shop.startInvoiceNo, 30, '1001'),
        footerText: s(shop.footerText, 500),
        logoUrl: s(shop.logoUrl, 500000),
      });
    } else if (col === 'products') {
      StorageService.getProducts().forEach((p) => {
        if (!Number.isFinite(p.id)) return;
        map.set(`${uid}_prod_${p.id}`, {
          ownerUid: uid,
          id: n(p.id),
          code: s(p.code, 80),
          category: s(p.category, 100),
          vendor: s(p.vendor, 120),
          grade: s(p.grade, 30),
          name: s(p.name, 200, `Product ${p.id}`),
          isTile: Boolean(p.isTile),
          w: n(p.w),
          h: n(p.h),
          scm: n(p.scm),
          sftPack: n(p.sftPack),
          qtyPack: n(p.qtyPack),
          rate: n(p.rate),
          price: n(p.price),
          stockBox: n(p.stockBox),
          stockPiece: n(p.stockPiece),
          stockSft: n(p.stockSft),
        });
      });
    } else if (col === 'customers') {
      StorageService.getCustomers().forEach((c) => {
        if (!Number.isFinite(c.id)) return;
        const docData: Record<string, unknown> = {
          ownerUid: uid,
          id: n(c.id),
          name: s(c.name, 200, `Customer ${c.id}`),
          address: s(c.address, 400),
          phone: s(c.phone, 50),
          deal: s(c.deal, 150),
          openDue: n(c.openDue),
        };
        if (typeof c.smsOptOut === 'boolean') docData.smsOptOut = c.smsOptOut;
        if (typeof c.smsConsent === 'boolean') docData.smsConsent = c.smsConsent;
        if (typeof c.smsConsentUpdatedAt === 'string') {
          docData.smsConsentUpdatedAt = s(c.smsConsentUpdatedAt, 64);
        }
        map.set(`${uid}_cust_${c.id}`, docData);
      });
    } else if (col === 'invoices') {
      StorageService.getInvoices().forEach((inv) => {
        if (!Number.isFinite(inv.no)) return;
        const cleanItems = (inv.items || []).slice(0, 100).map((it) => ({
          productId: n(it.productId),
          name: s(it.name, 200),
          dim: s(it.dim, 80),
          box: n(it.box),
          piece: n(it.piece),
          sft: n(it.sft),
          unit: n(it.unit),
          total: n(it.total),
          isTile: Boolean(it.isTile),
        }));
        map.set(`${uid}_inv_${Math.trunc(inv.no)}`, {
          ownerUid: uid,
          no: n(inv.no),
          date: s(inv.date, 40, getTodayLocalDateStr()),
          custId: n(inv.custId),
          custName: s(inv.custName, 200),
          address: s(inv.address, 400),
          phone: s(inv.phone, 50),
          deal: s(inv.deal, 150),
          comment: s(inv.comment, 1000),
          labor: n(inv.labor),
          discount: n(inv.discount),
          prevDue: n(inv.prevDue),
          cash: n(inv.cash),
          bank: n(inv.bank),
          bkash: n(inv.bkash),
          items: cleanItems,
          deliveryStatus:
            inv.deliveryStatus === 'partial' || inv.deliveryStatus === 'delivered'
              ? inv.deliveryStatus
              : 'pending',
        });
      });
    } else if (col === 'payments') {
      StorageService.getPayments().forEach((p) => {
        if (!Number.isFinite(p.id)) return;
        map.set(`${uid}_pay_${p.id}`, {
          ownerUid: uid,
          id: n(p.id),
          date: s(p.date, 40, getTodayLocalDateStr()),
          custId: n(p.custId),
          custName: s(p.custName, 200, 'Customer'),
          amount: n(p.amount),
          discount: n(p.discount),
          remark: s(p.remark, 500),
          method: s(p.method, 60, 'Cash'),
        });
      });
    } else if (col === 'txns') {
      StorageService.getTxns().forEach((t) => {
        if (!Number.isFinite(t.id)) return;
        map.set(`${uid}_txn_${t.id}`, {
          ownerUid: uid,
          id: n(t.id),
          date: s(t.date, 40, getTodayLocalDateStr()),
          isIncome: Boolean(t.isIncome),
          head: s(t.head, 300, 'Transaction'),
          amount: n(t.amount),
        });
      });
    } else if (col === 'stock_ins') {
      StorageService.getStockInRecords().forEach((r) => {
        if (!Number.isFinite(r.id) || !Array.isArray(r.items) || r.items.length === 0) return;
        const cleanItems = r.items.slice(0, 100).map((it) => ({
          productId: n(it.productId),
          name: s(it.name, 200),
          dim: s(it.dim, 80),
          box: n(it.box),
          piece: n(it.piece),
          sft: n(it.sft),
          rate: n(it.rate),
          total: n(it.total),
          isTile: Boolean(it.isTile),
        }));
        map.set(`${uid}_stin_${r.id}`, {
          ownerUid: uid,
          id: n(r.id),
          vendorName: s(r.vendorName, 150, 'Vendor'),
          vendorChallanNo: s(r.vendorChallanNo, 80),
          referenceNo: s(r.referenceNo, 80),
          date: s(r.date, 40, getTodayLocalDateStr()),
          note: s(r.note, 500),
          items: cleanItems,
          totalAmount: n(r.totalAmount),
          receivedBy: s(r.receivedBy, 120),
        });
      });
    } else if (col === 'delivery_challans') {
      const validInvoiceNos = new Set(
        StorageService.getInvoices()
          .filter((inv) => Number.isFinite(inv.no))
          .map((inv) => Math.trunc(inv.no))
      );
      StorageService.getDeliveryChallans().forEach((c) => {
        if (!Number.isFinite(c.id) || !Array.isArray(c.items) || c.items.length === 0) return;
        if (c.invoiceNo > 0 && !validInvoiceNos.has(Math.trunc(c.invoiceNo))) return;
        const cleanItems = c.items.slice(0, 100).map((it) => ({
          productId: n(it.productId),
          name: s(it.name, 200),
          dim: s(it.dim, 80),
          box: n(it.box),
          piece: n(it.piece),
          sft: n(it.sft),
          isTile: Boolean(it.isTile),
        }));
        map.set(`${uid}_chal_${c.id}`, {
          ownerUid: uid,
          id: n(c.id),
          challanNo: s(c.challanNo, 80, `CH-${c.id}`),
          outType: c.outType === 'manual' ? 'manual' : 'challan',
          manualRefNo: s(c.manualRefNo, 80),
          invoiceNo: n(c.invoiceNo),
          custId: n(c.custId),
          custName: s(c.custName, 200),
          address: s(c.address, 400),
          phone: s(c.phone, 50),
          deal: s(c.deal, 150),
          date: s(c.date, 40, getTodayLocalDateStr()),
          vehicleNo: s(c.vehicleNo, 80),
          driverName: s(c.driverName, 120),
          driverPhone: s(c.driverPhone, 50),
          note: s(c.note, 500),
          items: cleanItems,
          dispatchedBy: s(c.dispatchedBy, 120),
        });
      });
    } else if (col === 'dealers') {
      StorageService.getDealers().forEach((d) => {
        if (!Number.isFinite(d.id)) return;
        map.set(`${uid}_dlr_${d.id}`, {
          ownerUid: uid,
          id: n(d.id),
          name: s(d.name, 150, `Dealer ${d.id}`),
          phone: s(d.phone, 50),
          address: s(d.address, 300),
          note: s(d.note, 400),
        });
      });
    } else if (col === 'app_users') {
      StorageService.getUsers().forEach((u) => {
        const safeId = cleanId(u.id);
        map.set(`${uid}_usr_${safeId}`, {
          ownerUid: uid,
          id: safeId,
          username: s(u.username, 80, 'user'),
          name: s(u.name, 150, 'User'),
          role: u.role === 'staff' ? 'staff' : 'admin',
          password: s(u.password, 128, '1234'),
          phone: s(u.phone, 50),
          userCreatedAt: s(u.createdAt, 64, getTodayLocalDateStr()),
        });
      });
    } else if (col === 'sms_logs') {
      StorageService.getSmsLogs().forEach((l) => {
        if (!Number.isFinite(l.id)) return;
        const docData: Record<string, unknown> = {
          ownerUid: uid,
          id: n(l.id),
          date: s(l.date, 40, getTodayLocalDateStr()),
          custName: s(l.custName, 200),
          phone: s(l.phone, 50, 'N/A'),
          triggerType: l.triggerType || 'custom',
          referenceNo: s(l.referenceNo, 80),
          message: s(l.message, 1600, 'SMS'),
          provider: l.provider || 'sandbox',
          providerMessageId: s(l.providerMessageId, 150),
          status: l.status || 'SENT',
          deliveryStatus: l.deliveryStatus || 'SENT',
          isUnicode: Boolean(l.isUnicode),
          parts: n(l.parts, 1),
          cost: n(l.cost, 0),
          sentBy: s(l.sentBy, 120),
          error: s(l.error, 400),
        };
        if (typeof l.custId === 'number' && Number.isFinite(l.custId)) {
          docData.custId = l.custId;
        }
        map.set(`${uid}_sms_${l.id}`, docData);
      });
    } else if (col === 'sms_settings') {
      const cfg = StorageService.getSmsSettings();
      map.set(`${uid}_smsset_main`, {
        ownerUid: uid,
        smsEnabled: Boolean(cfg.smsEnabled),
        activeProvider: cfg.activeProvider || 'sandbox',
        senderId: s(cfg.senderId, 40, 'MYSHOP'),
        costPerSms: n(cfg.costPerSms, 0.35),
        duplicateWindowMinutes: n(cfg.duplicateWindowMinutes, 5),
        requireConsent: Boolean(cfg.requireConsent),
        appendOptOutText: Boolean(cfg.appendOptOutText),
        customApiUrl: s(cfg.customApiUrl, 500),
        customBalanceUrl: s(cfg.customBalanceUrl, 500),
        customAuthHeader: s(cfg.customAuthHeader, 300),
        templates: (cfg.templates || []).slice(0, 50),
        updatedBy: s(cfg.updatedBy, 120),
      });
    } else if (col === 'app_metadata') {
      const categories = StorageService.getCategories().slice(0, 100).map((c) => s(c, 100));
      const vendors = StorageService.getVendors().slice(0, 100).map((v) => s(v, 120));
      const paymentMethods = (
        StorageService.getPaymentMethods().length > 0
          ? StorageService.getPaymentMethods()
          : defaultPaymentMethods
      )
        .slice(0, 50)
        .map((m) => s(m, 60));
      const staffPermissions = StorageService.getStaffPermissions();

      map.set(`${uid}_meta_lists`, {
        ownerUid: uid,
        kind: 'lists',
        categories,
        vendors,
        paymentMethods,
        staffPermissions: stripUndefined(staffPermissions),
      });

      const notice = StorageService.getNotice();
      map.set(`${uid}_meta_notice`, {
        ownerUid: uid,
        kind: 'notice',
        notice: {
          enabled: Boolean(notice.enabled),
          message: s(notice.message, 1000),
          updatedAt: s(notice.updatedAt, 64),
          updatedBy: s(notice.updatedBy, 120),
        },
      });

      const contacts = StorageService.getContactsInfo();
      map.set(`${uid}_meta_contacts`, {
        ownerUid: uid,
        kind: 'contacts',
        contacts: {
          companyName: s(contacts.companyName, 200),
          phones: s(contacts.phones, 200),
          serviceMessage: s(contacts.serviceMessage, 1000),
          updatedAt: s(contacts.updatedAt, 64),
          updatedBy: s(contacts.updatedBy, 120),
        },
      });
    }

    return map;
  }

  private normalizeComparableFromDoc(
    uid: string,
    col: CollectionName,
    raw: DocumentData
  ): Record<string, unknown> | null {
    const clean = { ...raw };
    delete clean.createdAt;
    delete clean.updatedAt;
    if (!clean.ownerUid) clean.ownerUid = uid;
    if (col === 'app_metadata') {
      return clean;
    }
    return stripUndefined(clean);
  }

  private buildDiffOpsForCollection(uid: string, col: CollectionName): PendingOp[] {
    const desiredMap = this.buildDesiredDocs(uid, col);
    const existingIds = this.knownColIds.get(col) || new Set<string>();
    const ops: PendingOp[] = [];

    desiredMap.forEach((rawPayload, docId) => {
      const payload = stripUndefined(rawPayload);
      const hash = computeHash(payload);
      const known = this.knownDocs.get(`${col}/${docId}`);
      if (known && known.hash === hash) {
        return;
      }
      ops.push({
        type: 'set',
        col,
        docId,
        payload,
        hash,
      });
    });

    existingIds.forEach((oldId) => {
      if (!desiredMap.has(oldId)) {
        ops.push({
          type: 'delete',
          col,
          docId: oldId,
        });
      }
    });

    return ops;
  }

  private async commitOpsInChunks(ops: PendingOp[]): Promise<void> {
    for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
      const chunk = ops.slice(i, i + CHUNK_SIZE);
      await this.commitSingleBatchWithRetry(chunk);
    }
  }

  private async commitSingleBatchWithRetry(chunk: PendingOp[]): Promise<void> {
    const missingTsOps = chunk.filter(
      (op) =>
        op.type === 'set' &&
        (this.knownColIds.get(op.col)?.has(op.docId) ?? false) &&
        !this.knownDocs.get(`${op.col}/${op.docId}`)?.createdAt
    );

    if (missingTsOps.length > 0) {
      await Promise.all(
        missingTsOps.map(async (op) => {
          try {
            const snap = await getDocFromServer(doc(db, op.col, op.docId));
            if (snap.exists()) {
              const data = snap.data();
              const existingTs = data.createdAt instanceof Timestamp ? data.createdAt : null;
              if (existingTs) {
                this.knownDocs.set(`${op.col}/${op.docId}`, {
                  createdAt: existingTs,
                  hash: this.knownDocs.get(`${op.col}/${op.docId}`)?.hash || '',
                });
              }
            }
          } catch {
            // ignore pre-fetch error; normal retry path handles race if needed
          }
        })
      );
    }

    const runBatch = async (items: PendingOp[]) => {
      const batch = writeBatch(db);
      for (const op of items) {
        const ref = doc(db, op.col, op.docId);
        if (op.type === 'delete') {
          batch.delete(ref);
        } else if (op.payload) {
          const known = this.knownDocs.get(`${op.col}/${op.docId}`);
          const createdAtValue = known?.createdAt ?? serverTimestamp();
          batch.set(ref, {
            ...op.payload,
            createdAt: createdAtValue,
            updatedAt: serverTimestamp(),
          });
        }
      }
      await batch.commit();
    };

    try {
      await runBatch(chunk);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        // Recover from create-vs-update race where another browser created the doc first
        let recoveredAnyCreatedAt = false;
        await Promise.all(
          chunk
            .filter((op) => op.type === 'set' && !this.knownDocs.get(`${op.col}/${op.docId}`)?.createdAt)
            .map(async (op) => {
              try {
                const snap = await getDocFromServer(doc(db, op.col, op.docId));
                if (snap.exists()) {
                  const data = snap.data();
                  const existingTs = data.createdAt instanceof Timestamp ? data.createdAt : null;
                  if (existingTs) {
                    this.knownDocs.set(`${op.col}/${op.docId}`, {
                      createdAt: existingTs,
                      hash: this.knownDocs.get(`${op.col}/${op.docId}`)?.hash || '',
                    });
                    recoveredAnyCreatedAt = true;
                  }
                }
              } catch {
                // ignore lookup failure, fall through to handleFirestoreError
              }
            })
        );

        if (recoveredAnyCreatedAt) {
          try {
            await runBatch(chunk);
            this.applyCommittedState(chunk);
            return;
          } catch (retryErr) {
            const firstOp = chunk[0];
            handleFirestoreError(
              retryErr,
              firstOp.type === 'delete' ? OperationType.DELETE : OperationType.WRITE,
              `${firstOp.col}/${firstOp.docId}`
            );
          }
        }
      }

      const firstOp = chunk[0];
      handleFirestoreError(
        err,
        firstOp.type === 'delete' ? OperationType.DELETE : OperationType.WRITE,
        `${firstOp.col}/${firstOp.docId}`
      );
    }

    this.applyCommittedState(chunk);
  }

  private applyCommittedState(chunk: PendingOp[]): void {
    for (const op of chunk) {
      const key = `${op.col}/${op.docId}`;
      let colSet = this.knownColIds.get(op.col);
      if (!colSet) {
        colSet = new Set<string>();
        this.knownColIds.set(op.col, colSet);
      }

      if (op.type === 'delete') {
        this.knownDocs.delete(key);
        colSet.delete(op.docId);
      } else if (op.hash) {
        const existing = this.knownDocs.get(key);
        this.knownDocs.set(key, {
          createdAt: existing?.createdAt ?? null,
          hash: op.hash,
        });
        colSet.add(op.docId);
      }
    }
  }
}

export const FirestoreSyncService = new FirestoreSyncManager();
