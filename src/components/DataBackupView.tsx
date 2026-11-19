import React, { useState } from 'react';
import { Customer, Invoice, Payment, Product, ShopConfig, Txn } from '../types';
import { StorageService } from '../services/storage';
import { CloudSyncState } from '../services/firestoreSync';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Check,
  Cloud,
  CloudOff,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { getTodayLocalDateStr } from '../utils/numberWords';

interface DataBackupViewProps {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  payments: Payment[];
  txns: Txn[];
  shop: ShopConfig;
  onDataReload: () => void;
  cloudSync?: CloudSyncState;
  onConnectCloud?: () => Promise<boolean>;
  onDisconnectCloud?: () => Promise<void>;
  onPullFromCloud?: () => Promise<boolean>;
  onPushToCloud?: () => Promise<boolean>;
}

export const DataBackupView: React.FC<DataBackupViewProps> = ({
  products,
  customers,
  invoices,
  payments,
  txns,
  shop,
  onDataReload,
  cloudSync,
  onConnectCloud,
  onDisconnectCloud,
  onPullFromCloud,
  onPushToCloud,
}) => {
  const [msg, setMsg] = useState('');

  // JSON export
  const handleExportJSON = () => {
    const jsonStr = StorageService.exportAllAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `InventoryBilling_Backup_${getTodayLocalDateStr()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMsg('JSON ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে!');
    setTimeout(() => setMsg(''), 4000);
  };

  // TSV Exports matching original Billing.cs
  const handleExportTSV = (fileKey: string) => {
    let content = '';
    let fileName = '';

    if (fileKey === 'products') {
      fileName = 'products.tsv';
      content = products
        .map((p) =>
          [
            p.id,
            p.code,
            p.category,
            p.name,
            p.isTile ? '1' : '0',
            p.w,
            p.h,
            p.scm,
            p.sftPack,
            p.qtyPack,
            p.rate,
            p.price,
          ].join('\t')
        )
        .join('\n');
    } else if (fileKey === 'customers') {
      fileName = 'customers.tsv';
      content = customers
        .map((c) => [c.id, c.name, c.address, c.phone, c.deal, c.openDue].join('\t'))
        .join('\n');
    } else if (fileKey === 'invoices') {
      fileName = 'invoices.tsv';
      content = invoices
        .map((v) => {
          const itemsStr = v.items
            .map(
              (m) =>
                `${m.productId}~${m.name}~${m.dim}~${m.box}~${m.piece}~${m.sft}~${m.unit}~${m.total}~${
                  m.isTile ? '1' : '0'
                }`
            )
            .join('|');
          return [
            v.no,
            v.date,
            v.custId,
            v.custName,
            v.address,
            v.phone,
            v.deal,
            v.labor,
            v.discount,
            v.prevDue,
            v.cash,
            v.comment,
            itemsStr,
            v.bank,
            v.bkash,
          ].join('\t');
        })
        .join('\n');
    } else if (fileKey === 'payments') {
      fileName = 'payments.tsv';
      content = payments
        .map((p) => [p.id, p.date, p.custId, p.custName, p.amount, p.remark, p.method].join('\t'))
        .join('\n');
    } else if (fileKey === 'txns') {
      fileName = 'txns.tsv';
      content = txns
        .map((t) => [t.id, t.date, t.isIncome ? '1' : '0', t.head, t.amount].join('\t'))
        .join('\n');
    } else if (fileKey === 'shop') {
      fileName = 'shop.txt';
      content = [
        shop.name,
        shop.address,
        shop.phones,
        shop.web,
        shop.note.replace(/\n/g, '\\n'),
        shop.preparedBy,
        shop.startInvoiceNo,
        shop.footerText,
      ].join('\n');
    }

    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON import (restores to local storage)
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const success = StorageService.restoreAllFromJSON(reader.result as string);
          if (success) {
            onDataReload();
            setMsg('ডাটা রিস্টোর সম্পন্ন হয়েছে!');
            setTimeout(() => setMsg(''), 4000);
          } else {
            setMsg('❌ ভুল ফাইল ফরম্যাট। সঠিক JSON ফাইল প্রদান করুন।');
            setTimeout(() => setMsg(''), 4000);
          }
        } catch {
          setMsg('❌ ফাইল পড়তে সমস্যা হয়েছে।');
          setTimeout(() => setMsg(''), 4000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToFresh = () => {
    StorageService.resetToDefaults();
    onDataReload();
    setMsg('সিস্টেমটি সম্পূর্ণ ফ্রেশ ডাটায় রিসেট করা হয়েছে!');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 text-xs">
      <div className="bg-white border border-slate-300 rounded-lg p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-800">
              ডাটা ব্যাকআপ, রিস্টোর ও TSV এক্সপোর্ট (Data Management)
            </h3>
          </div>
          {msg && (
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {msg}
            </span>
          )}
        </div>

        {/* Info card */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 mb-1">
            লোকাল ডাটা স্টোরেজ ও ফাইল ব্যাকআপ সংক্রান্ত তথ্য:
          </p>
          <p>
            আসল C# / VB.NET অ্যাপে ডাটা সংরক্ষিত থাকে <code className="font-mono text-emerald-800 font-bold">D:\TilesBillingData</code> অথবা <code className="font-mono text-emerald-800 font-bold">C:\TilesBillingData</code> ফোল্ডারে TSV আকারে। এই ওয়েব সংস্করণে সব ডাটা ব্রাউজারের লোকাল স্টোরেজে নিরাপদে সংরক্ষিত থাকে।
          </p>
          <p className="mt-1">
            যেকোনো সময় ১-ক্লিকে সম্পূর্ণ ব্যাকআপ নিতে পারেন অথবা আসল অ্যাপের মতো পৃথক <code className="font-mono text-slate-700 font-bold">.tsv</code> ফাইল হিসেবে এক্সপোর্ট করতে পারবেন।
          </p>
        </div>

        {/* Firebase Real-time Multi-Browser Sync */}
        {cloudSync && (
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {cloudSync.status === 'synced' ? (
                  <Cloud className="w-5 h-5 text-emerald-700" />
                ) : (
                  <CloudOff className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Firebase রিয়েল-টাইম ক্লাউড সিঙ্ক (Multi-Browser Sync)
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    প্রতিটি ব্রাউজারে একই Google অ্যাকাউন্ট দিয়ে কানেক্ট করলে সব পরিবর্তন সাথে সাথে আপডেট হবে।
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                  cloudSync.status === 'synced'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : cloudSync.status === 'syncing' || cloudSync.status === 'connecting'
                    ? 'bg-sky-100 text-sky-800 border-sky-300'
                    : cloudSync.status === 'error'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {cloudSync.status === 'synced'
                  ? `সিঙ্ক চালু (${cloudSync.lastSyncedAt || 'সর্বশেষ আপডেটেড'})`
                  : cloudSync.status === 'syncing' || cloudSync.status === 'connecting'
                  ? 'সিঙ্ক হচ্ছে...'
                  : cloudSync.status === 'error'
                  ? 'সিঙ্ক ত্রুটি'
                  : 'সংযুক্ত নয়'}
              </span>
            </div>

            {cloudSync.userEmail && (
              <div className="text-[11px] text-slate-700 space-y-0.5">
                <p>
                  সংযুক্ত Google অ্যাকাউন্ট:{' '}
                  <span className="font-bold font-mono text-emerald-900">{cloudSync.userEmail}</span>
                </p>
                <p className="text-[10px] text-slate-500">
                  সব ডিভাইসে একই ডাটা পেতে প্রতিটি ডিভাইসে এই একই Google অ্যাকাউন্ট দিয়ে কানেক্ট করুন • পণ্য: {products.length} • গ্রাহক: {customers.length} • মেমো: {invoices.length}
                </p>
              </div>
            )}

            {cloudSync.errorMessage && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cloudSync.errorMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {!cloudSync.userUid ? (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await onConnectCloud?.();
                    if (ok) {
                      onDataReload();
                      setMsg('Firebase ক্লাউড সিঙ্ক সফলভাবে সংযুক্ত হয়েছে!');
                      setTimeout(() => setMsg(''), 4000);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  Google অ্যাকাউন্ট দিয়ে ক্লাউড সিঙ্ক চালু করুন
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await onPullFromCloud?.();
                      if (ok) {
                        onDataReload();
                        setMsg('ক্লাউড থেকে সর্বশেষ ডাটা ডাউনলোড সম্পন্ন হয়েছে!');
                        setTimeout(() => setMsg(''), 4000);
                      }
                    }}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    ক্লাউড থেকে আপডেট নিন (Pull)
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await onPushToCloud?.();
                      if (ok) {
                        setMsg('লোকাল ডাটা ক্লাউডে আপলোড সম্পন্ন হয়েছে!');
                        setTimeout(() => setMsg(''), 4000);
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    ক্লাউডে আপলোড করুন (Push)
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await onDisconnectCloud?.();
                      setMsg('Google ক্লাউড সিঙ্ক বিচ্ছিন্ন করা হয়েছে।');
                      setTimeout(() => setMsg(''), 4000);
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded font-bold cursor-pointer transition flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    ডিসকানেক্ট
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Section 1: Full JSON Backup & Restore */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <h4 className="font-bold text-slate-800 text-sm">১. সম্পূর্ণ ডাটা ব্যাকআপ ও রিস্টোর (Full Backup)</h4>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              ব্যাকআপ ডাউনলোড (Download Backup JSON)
            </button>

            <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              ব্যাকআপ ফাইল থেকে রিস্টোর (Restore from JSON)
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Section 2: Original TSV Files Export */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <h4 className="font-bold text-slate-800 text-sm">
            ২. অরিজিনাল সফটওয়্যার ফরম্যাটে TSV ফাইল এক্সপোর্ট (Original Format TSV)
          </h4>
          <p className="text-[11px] text-slate-500">
            এই ফাইলগুলো Windows Desktop সফটওয়্যারের Data ফোল্ডারে কপি করে সরাসরি ব্যবহার করা যায়।
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleExportTSV('products')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>products.tsv</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleExportTSV('customers')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>customers.tsv</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleExportTSV('invoices')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>invoices.tsv</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleExportTSV('payments')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>payments.tsv</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleExportTSV('txns')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>txns.tsv</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleExportTSV('shop')}
              className="p-2 bg-white border border-slate-300 hover:border-emerald-600 rounded font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
            >
              <span>shop.txt</span>
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Section 3: Fresh Reset */}
        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-amber-950 text-xs">ফ্রেশ ডাটা রিসেট (Reset Fresh Data)</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              সিস্টেমকে শুরু থেকে একদম নতুন অবস্থায় ফিরিয়ে আনতে চাইলে রিসেট চাপুন।
            </p>
          </div>
          <button
            onClick={handleResetToFresh}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded font-semibold transition cursor-pointer flex items-center gap-1 text-xs shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            রিসেট করুন
          </button>
        </div>
      </div>
    </div>
  );
};
