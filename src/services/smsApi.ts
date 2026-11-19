import { SmsLog, SmsProviderId, SmsTriggerType } from '../types';
import { getNowLocalDateTimeStr } from '../utils/numberWords';
import { findRecentDuplicateSms, getSmsMetrics, normalizePhoneClient } from '../utils/smsUtils';
import { StorageService } from './storage';

export interface BackendGatewayStatusResponse {
  defaultProvider: SmsProviderId;
  providers: {
    id: SmsProviderId;
    name: string;
    description: string;
    envKeys: string[];
    configured: boolean;
  }[];
  serverTime: string;
}

export interface BackendBalanceResponse {
  success: boolean;
  provider: SmsProviderId | string;
  providerName: string;
  configured: boolean;
  balanceText: string;
  note?: string;
  checkedAt: string;
}

export const SmsApiService = {
  async fetchGatewayStatus(): Promise<BackendGatewayStatusResponse> {
    const resp = await fetch('/api/sms/status');
    if (!resp.ok) {
      throw new Error('SMS gateway status unavailable');
    }
    return (await resp.json()) as BackendGatewayStatusResponse;
  },

  async checkBalance(providerId?: SmsProviderId): Promise<BackendBalanceResponse> {
    const settings = StorageService.getSmsSettings();
    const provider = providerId || settings.activeProvider;
    try {
      const resp = await fetch('/api/sms/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: provider,
          customBalanceUrl: settings.customBalanceUrl,
          customAuthHeader: settings.customAuthHeader,
        }),
      });
      return (await resp.json()) as BackendBalanceResponse;
    } catch {
      return {
        success: false,
        provider,
        providerName: provider,
        configured: false,
        balanceText: 'সার্ভার সংযোগ ব্যর্থ',
        checkedAt: new Date().toISOString(),
      };
    }
  },

  async sendSingleSms(params: {
    custId?: number;
    custName: string;
    phone: string;
    message: string;
    triggerType: SmsTriggerType;
    referenceNo?: string;
    sentBy: string;
    smsOptOut?: boolean;
    smsConsent?: boolean;
    onLogCreated?: (log: SmsLog) => void;
  }): Promise<SmsLog> {
    const settings = StorageService.getSmsSettings();
    const metrics = getSmsMetrics(params.message, settings.costPerSms);
    const id = StorageService.nextSmsLogId();
    const date = getNowLocalDateTimeStr();

    const saveAndSync = (log: SmsLog): SmsLog => {
      const logs = StorageService.getSmsLogs();
      const updated = [log, ...logs];
      StorageService.saveSmsLogs(updated);
      params.onLogCreated?.(log);
      return log;
    };

    if (!settings.smsEnabled) {
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        status: 'FAILED',
        deliveryStatus: 'FAILED',
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: 0,
        sentBy: params.sentBy,
        error: 'SMS সিস্টেম বন্ধ (OFF) আছে।',
      });
    }

    if (params.smsOptOut || (settings.requireConsent && params.smsConsent === false)) {
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        status: 'SKIPPED_OPT_OUT',
        deliveryStatus: 'FAILED',
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: 0,
        sentBy: params.sentBy,
        error: 'গ্রাহক Opt-Out / অনুমতি নেই।',
      });
    }

    const phoneCheck = normalizePhoneClient(params.phone);
    if (!phoneCheck.valid) {
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        status: 'FAILED',
        deliveryStatus: 'FAILED',
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: 0,
        sentBy: params.sentBy,
        error: phoneCheck.error || 'অবৈধ মোবাইল নম্বর',
      });
    }

    const dup = findRecentDuplicateSms(
      StorageService.getSmsLogs(),
      params.phone,
      params.message,
      settings.duplicateWindowMinutes,
      params.referenceNo
    );
    if (dup) {
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        status: 'SKIPPED_DUPLICATE',
        deliveryStatus: 'FAILED',
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: 0,
        sentBy: params.sentBy,
        error: `ডুপ্লিকেট সুরক্ষা: ${settings.duplicateWindowMinutes} মিনিটের মধ্যে একই মেসেজ পাঠানো হয়েছে।`,
      });
    }

    try {
      const resp = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.activeProvider,
          phone: phoneCheck.normalized,
          message: params.message,
          senderId: settings.senderId,
          customApiUrl: settings.customApiUrl,
          customAuthHeader: settings.customAuthHeader,
        }),
      });
      const data = (await resp.json()) as {
        success: boolean;
        providerMessageId?: string;
        deliveryStatus?: 'DELIVERED' | 'SENT' | 'PENDING' | 'FAILED';
        error?: string;
      };

      const isOk = Boolean(data.success);
      const delStatus = data.deliveryStatus || (isOk ? 'SENT' : 'FAILED');
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        providerMessageId: data.providerMessageId || '',
        status: isOk ? delStatus : 'FAILED',
        deliveryStatus: delStatus,
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: isOk ? metrics.estimatedCost : 0,
        sentBy: params.sentBy,
        error: isOk ? '' : data.error || 'SMS গেটওয়ে ব্যর্থ হয়েছে।',
      });
    } catch (err) {
      return saveAndSync({
        id,
        date,
        custId: params.custId,
        custName: params.custName,
        phone: params.phone,
        triggerType: params.triggerType,
        referenceNo: params.referenceNo || '',
        message: params.message,
        provider: settings.activeProvider,
        status: 'FAILED',
        deliveryStatus: 'FAILED',
        isUnicode: metrics.isUnicode,
        parts: metrics.parts,
        cost: 0,
        sentBy: params.sentBy,
        error: err instanceof Error ? err.message : 'Network error',
      });
    }
  },

  async sendBulkSms(params: {
    recipients: {
      custId?: number;
      custName: string;
      phone: string;
      message: string;
      referenceNo?: string;
      smsOptOut?: boolean;
      smsConsent?: boolean;
    }[];
    triggerType: SmsTriggerType;
    sentBy: string;
    confirmed?: boolean;
    onLogsCreated?: (logs: SmsLog[]) => void;
  }): Promise<{
    logs: SmsLog[];
    sentCount: number;
    failedCount: number;
    duplicateCount: number;
    optOutCount: number;
    totalCost: number;
  }> {
    const createdLogs: SmsLog[] = [];
    for (const r of params.recipients) {
      const log = await this.sendSingleSms({
        custId: r.custId,
        custName: r.custName,
        phone: r.phone,
        message: r.message,
        triggerType: params.triggerType,
        referenceNo: r.referenceNo,
        sentBy: params.sentBy,
        smsOptOut: r.smsOptOut,
        smsConsent: r.smsConsent,
      });
      createdLogs.push(log);
    }

    params.onLogsCreated?.(createdLogs);

    return {
      logs: createdLogs,
      sentCount: createdLogs.filter((l) => l.status === 'SENT' || l.status === 'DELIVERED').length,
      failedCount: createdLogs.filter((l) => l.status === 'FAILED').length,
      duplicateCount: createdLogs.filter((l) => l.status === 'SKIPPED_DUPLICATE').length,
      optOutCount: createdLogs.filter((l) => l.status === 'SKIPPED_OPT_OUT').length,
      totalCost:
        Math.round(createdLogs.reduce((sum, l) => sum + (l.cost || 0), 0) * 100) / 100,
    };
  },

  async refreshDeliveryReport(log: SmsLog): Promise<SmsLog> {
    try {
      const resp = await fetch('/api/sms/dlr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: log.provider,
          providerMessageId: log.providerMessageId || '',
        }),
      });
      const data = (await resp.json()) as {
        success: boolean;
        deliveryStatus?: 'DELIVERED' | 'SENT' | 'PENDING' | 'FAILED';
      };

      const nextDeliveryStatus = data.deliveryStatus || log.deliveryStatus;
      const updatedLog: SmsLog = {
        ...log,
        deliveryStatus: nextDeliveryStatus,
        status: nextDeliveryStatus,
      };
      const all = StorageService.getSmsLogs().map((l) => (l.id === log.id ? updatedLog : l));
      StorageService.saveSmsLogs(all);
      return updatedLog;
    } catch {
      return log;
    }
  },
};
