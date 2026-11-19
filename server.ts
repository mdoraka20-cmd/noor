import express from 'express';
import dotenv from 'dotenv';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface ProviderMeta {
  id: string;
  name: string;
  description: string;
  envKeys: string[];
  configured: boolean;
}

function getProvidersStatus(): ProviderMeta[] {
  return [
    {
      id: 'sandbox',
      name: 'Sandbox Test Gateway (সিমুলেশন)',
      description: 'অফলাইন বা লাইভ টেস্টের জন্য বিনামূল্যে সিমুলেশন গেটওয়ে।',
      envKeys: [],
      configured: true,
    },
    {
      id: 'bulksmsbd',
      name: 'BulkSMSBD (বাংলাদেশ)',
      description: 'বাংলাদেশি লোকাল ও মাস্কিং/নন-মাস্কিং BulkSMSBD REST API।',
      envKeys: ['BULKSMSBD_API_KEY', 'BULKSMSBD_SENDER_ID'],
      configured: Boolean(process.env.BULKSMSBD_API_KEY),
    },
    {
      id: 'greenweb',
      name: 'GreenWeb BD SMS (গ্রিনওয়েব)',
      description: 'GreenWeb BD SMS API গেটওয়ে ইন্টিগ্রেশন।',
      envKeys: ['GREENWEB_TOKEN'],
      configured: Boolean(process.env.GREENWEB_TOKEN || process.env.GREENWEB_API_TOKEN),
    },
    {
      id: 'sslwireless',
      name: 'SSL Wireless (এসএসএল ওয়্যারলেস)',
      description: 'SSL Wireless কর্পোরেট SMS গেটওয়ে।',
      envKeys: ['SSLWIRELESS_API_TOKEN', 'SSL_WIRELESS_SID'],
      configured: Boolean(process.env.SSLWIRELESS_API_TOKEN || process.env.SSL_WIRELESS_API_TOKEN),
    },
    {
      id: 'twilio',
      name: 'Twilio SMS (International)',
      description: 'Twilio গ্লোবাল SMS API সার্ভিস।',
      envKeys: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'],
      configured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    },
    {
      id: 'custom_webhook',
      name: 'Custom REST API Gateway',
      description: 'যেকোনো নিজস্ব JSON HTTP/REST SMS গেটওয়ে।',
      envKeys: ['CUSTOM_SMS_API_KEY', 'CUSTOM_SMS_API_URL'],
      configured: Boolean(process.env.CUSTOM_SMS_API_KEY || process.env.CUSTOM_SMS_API_URL),
    },
  ];
}

function normalizePhoneServer(raw: string): string {
  const cleaned = String(raw || '').replace(/[\s\-()]/g, '').trim();
  if (/^01[3-9]\d{8}$/.test(cleaned)) return `88${cleaned}`;
  if (/^8801[3-9]\d{8}$/.test(cleaned)) return cleaned;
  if (/^\+8801[3-9]\d{8}$/.test(cleaned)) return cleaned.slice(1);
  return cleaned.replace(/^\+/, '');
}

async function dispatchProviderSms(params: {
  provider: string;
  phone: string;
  message: string;
  senderId: string;
  customApiUrl?: string;
  customAuthHeader?: string;
}): Promise<{
  success: boolean;
  providerMessageId: string;
  deliveryStatus: 'DELIVERED' | 'SENT' | 'PENDING' | 'FAILED';
  error?: string;
}> {
  const { provider, phone, message, senderId, customApiUrl, customAuthHeader } = params;
  const normalizedPhone = normalizePhoneServer(phone);

  if (provider === 'sandbox' || !provider) {
    return {
      success: true,
      providerMessageId: `SBX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      deliveryStatus: 'DELIVERED',
    };
  }

  if (provider === 'bulksmsbd') {
    const apiKey = process.env.BULKSMSBD_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        providerMessageId: '',
        deliveryStatus: 'FAILED',
        error: 'BULKSMSBD_API_KEY সার্ভার এনভায়রনমেন্টে সেট করা নেই।',
      };
    }
    const usedSender = process.env.BULKSMSBD_SENDER_ID || senderId || '8809617611899';
    const url = new URL('https://bulksmsbd.net/api/smsapi');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('type', 'text');
    url.searchParams.set('number', normalizedPhone);
    url.searchParams.set('senderid', usedSender);
    url.searchParams.set('message', message);

    const resp = await fetch(url.toString());
    const data = (await resp.json().catch(() => ({}))) as { response_code?: number; success_message?: string; error_message?: string };
    if (resp.ok && (data.response_code === 202 || data.response_code === 200)) {
      return {
        success: true,
        providerMessageId: `BBD-${Date.now()}`,
        deliveryStatus: 'SENT',
      };
    }
    return {
      success: false,
      providerMessageId: '',
      deliveryStatus: 'FAILED',
      error: data.error_message || `BulkSMSBD Error (${resp.status})`,
    };
  }

  if (provider === 'greenweb') {
    const token = process.env.GREENWEB_TOKEN || process.env.GREENWEB_API_TOKEN;
    if (!token) {
      return {
        success: false,
        providerMessageId: '',
        deliveryStatus: 'FAILED',
        error: 'GREENWEB_API_TOKEN সার্ভার এনভায়রনমেন্টে সেট করা নেই।',
      };
    }
    const form = new URLSearchParams();
    form.set('token', token);
    form.set('to', normalizedPhone);
    form.set('message', message);
    const resp = await fetch('https://api.bdbulksms.net/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const text = await resp.text();
    if (resp.ok && text.toLowerCase().includes('ok')) {
      return {
        success: true,
        providerMessageId: `GW-${Date.now()}`,
        deliveryStatus: 'SENT',
      };
    }
    return {
      success: false,
      providerMessageId: '',
      deliveryStatus: 'FAILED',
      error: text.slice(0, 200) || `GreenWeb Error (${resp.status})`,
    };
  }

  if (provider === 'sslwireless') {
    const apiToken = process.env.SSLWIRELESS_API_TOKEN || process.env.SSL_WIRELESS_API_TOKEN;
    const sid = process.env.SSLWIRELESS_SID || process.env.SSL_WIRELESS_SID;
    if (!apiToken || !sid) {
      return {
        success: false,
        providerMessageId: '',
        deliveryStatus: 'FAILED',
        error: 'SSLWIRELESS_API_TOKEN এবং SSLWIRELESS_SID সেট করা নেই।',
      };
    }
    const resp = await fetch('https://smsplus.sslwireless.com/api/v3/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_token: apiToken,
        sid,
        msisdn: normalizedPhone,
        sms: message,
        csms_id: `INV${Date.now()}`,
      }),
    });
    const data = (await resp.json().catch(() => ({}))) as { status?: string; status_message?: string };
    if (resp.ok && data.status === 'SUCCESS') {
      return {
        success: true,
        providerMessageId: `SSL-${Date.now()}`,
        deliveryStatus: 'SENT',
      };
    }
    return {
      success: false,
      providerMessageId: '',
      deliveryStatus: 'FAILED',
      error: data.status_message || `SSL Wireless Error (${resp.status})`,
    };
  }

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNum = process.env.TWILIO_FROM_NUMBER;
    if (!sid || !authToken || !fromNum) {
      return {
        success: false,
        providerMessageId: '',
        deliveryStatus: 'FAILED',
        error: 'TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER সেট করা নেই।',
      };
    }
    const form = new URLSearchParams();
    form.set('To', `+${normalizedPhone}`);
    form.set('From', fromNum);
    form.set('Body', message);
    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const data = (await resp.json().catch(() => ({}))) as { sid?: string; message?: string };
    if (resp.ok && data.sid) {
      return {
        success: true,
        providerMessageId: data.sid,
        deliveryStatus: 'SENT',
      };
    }
    return {
      success: false,
      providerMessageId: '',
      deliveryStatus: 'FAILED',
      error: data.message || `Twilio Error (${resp.status})`,
    };
  }

  if (provider === 'custom_webhook') {
    const targetUrl = customApiUrl || process.env.CUSTOM_SMS_API_URL;
    const apiKey = process.env.CUSTOM_SMS_API_KEY;
    if (!targetUrl) {
      return {
        success: false,
        providerMessageId: '',
        deliveryStatus: 'FAILED',
        error: 'Custom SMS API URL সেট করা নেই।',
      };
    }
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers[customAuthHeader || 'Authorization'] =
        (customAuthHeader || 'Authorization').toLowerCase() === 'authorization' && !apiKey.startsWith('Bearer ')
          ? `Bearer ${apiKey}`
          : apiKey;
    }
    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ to: normalizedPhone, message, senderId }),
    });
    const data = (await resp.json().catch(() => ({}))) as { messageId?: string; id?: string; error?: string };
    if (resp.ok) {
      return {
        success: true,
        providerMessageId: data.messageId || data.id || `CST-${Date.now()}`,
        deliveryStatus: 'SENT',
      };
    }
    return {
      success: false,
      providerMessageId: '',
      deliveryStatus: 'FAILED',
      error: data.error || `Custom Gateway HTTP ${resp.status}`,
    };
  }

  return {
    success: false,
    providerMessageId: '',
    deliveryStatus: 'FAILED',
    error: `অজানা SMS প্রোভাইডার: ${provider}`,
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  app.get('/api/sms/status', (_req, res) => {
    const providers = getProvidersStatus();
    const defaultProvider = process.env.SMS_PROVIDER || 'sandbox';
    res.json({
      defaultProvider,
      providers,
      serverTime: new Date().toISOString(),
    });
  });

  app.post('/api/sms/balance', async (req, res) => {
    const { providerId = 'sandbox', customBalanceUrl, customAuthHeader } = (req.body || {}) as {
      providerId?: string;
      customBalanceUrl?: string;
      customAuthHeader?: string;
    };
    const providers = getProvidersStatus();
    const meta = providers.find((p) => p.id === providerId) || {
      id: providerId,
      name: providerId,
      configured: false,
    };

    try {
      if (providerId === 'sandbox') {
        res.json({
          success: true,
          provider: 'sandbox',
          providerName: meta.name,
          configured: true,
          balanceText: '৳ 5,000.00 (Sandbox Test Balance)',
          note: 'টেস্ট মোডে কোনো প্রকৃত টাকা কাটে না।',
          checkedAt: new Date().toISOString(),
        });
        return;
      }

      if (providerId === 'bulksmsbd' && process.env.BULKSMSBD_API_KEY) {
        const resp = await fetch(
          `https://bulksmsbd.net/api/getBalanceApi?api_key=${encodeURIComponent(process.env.BULKSMSBD_API_KEY)}`
        );
        const data = (await resp.json().catch(() => ({}))) as { balance?: string | number; error_message?: string };
        res.json({
          success: resp.ok && data.balance !== undefined,
          provider: 'bulksmsbd',
          providerName: meta.name,
          configured: true,
          balanceText: data.balance !== undefined ? `৳ ${data.balance}` : 'ব্যালেন্স পাওয়া যায়নি',
          note: data.error_message || 'BulkSMSBD Live Balance',
          checkedAt: new Date().toISOString(),
        });
        return;
      }

      if (providerId === 'custom_webhook' && customBalanceUrl) {
        const headers: Record<string, string> = {};
        if (process.env.CUSTOM_SMS_API_KEY) {
          headers[customAuthHeader || 'Authorization'] = `Bearer ${process.env.CUSTOM_SMS_API_KEY}`;
        }
        const resp = await fetch(customBalanceUrl, { headers });
        const data = (await resp.json().catch(() => ({}))) as { balance?: string | number };
        res.json({
          success: resp.ok,
          provider: 'custom_webhook',
          providerName: meta.name,
          configured: meta.configured,
          balanceText: data.balance !== undefined ? String(data.balance) : `HTTP ${resp.status}`,
          note: 'Custom Gateway Balance Response',
          checkedAt: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: false,
        provider: providerId,
        providerName: meta.name,
        configured: meta.configured,
        balanceText: meta.configured ? 'Live Balance Check অনুপলব্ধ' : 'সার্ভার .env Key সেট নেই',
        note: meta.configured
          ? 'প্রোভাইডার প্যানেল থেকে ব্যালেন্স যাচাই করুন।'
          : 'লাইভ SMS এর জন্য সার্ভারে API Key কনফিগার করুন বা Sandbox ব্যবহার করুন।',
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      res.json({
        success: false,
        provider: providerId,
        providerName: meta.name,
        configured: meta.configured,
        balanceText: 'ব্যালেন্স চেক ব্যর্থ',
        note: err instanceof Error ? err.message : 'Network error',
        checkedAt: new Date().toISOString(),
      });
    }
  });

  app.post('/api/sms/send', async (req, res) => {
    try {
      const {
        provider = 'sandbox',
        phone = '',
        message = '',
        senderId = 'MYSHOP',
        customApiUrl,
        customAuthHeader,
      } = (req.body || {}) as {
        provider?: string;
        phone?: string;
        message?: string;
        senderId?: string;
        customApiUrl?: string;
        customAuthHeader?: string;
      };

      if (!phone || !message) {
        res.status(400).json({
          success: false,
          deliveryStatus: 'FAILED',
          error: 'মোবাইল নম্বর এবং মেসেজ আবশ্যক।',
        });
        return;
      }

      const result = await dispatchProviderSms({
        provider,
        phone,
        message,
        senderId,
        customApiUrl,
        customAuthHeader,
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({
        success: false,
        deliveryStatus: 'FAILED',
        error: err instanceof Error ? err.message : 'SMS send failed',
      });
    }
  });

  app.post('/api/sms/dlr', async (req, res) => {
    const { provider = 'sandbox', providerMessageId = '' } = (req.body || {}) as {
      provider?: string;
      providerMessageId?: string;
    };
    if (provider === 'sandbox' || providerMessageId.startsWith('SBX-')) {
      res.json({
        success: true,
        deliveryStatus: 'DELIVERED',
        checkedAt: new Date().toISOString(),
      });
      return;
    }
    res.json({
      success: true,
      deliveryStatus: 'SENT',
      checkedAt: new Date().toISOString(),
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: { server: httpServer },
        hmr: !isHmrDisabled,
        ws: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });

    if (isHmrDisabled) {
      app.get('/@vite/client', async (_req, res, next) => {
        try {
          const result = await vite.transformRequest('/@vite/client');
          if (!result) {
            next();
            return;
          }
          const patched = result.code.replace(
            'const createWebSocketModuleRunnerTransport = (options) => {',
            'const createWebSocketModuleRunnerTransport = () => ({ async connect() {}, disconnect() {}, send() {} }); const _unusedWsTransport = (options) => {'
          );
          res
            .status(200)
            .set('Content-Type', 'application/javascript; charset=utf-8')
            .send(patched);
        } catch {
          next();
        }
      });
    }

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Inventory & Billing Pro Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
