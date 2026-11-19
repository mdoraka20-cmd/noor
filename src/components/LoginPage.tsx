import React, { useState } from 'react';
import { AppUser, ShopConfig } from '../types';
import { StorageService } from '../services/storage';
import { CloudSyncState } from '../services/firestoreSync';
import {
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  Building2,
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  X,
} from 'lucide-react';

interface LoginPageProps {
  shop: ShopConfig;
  users?: AppUser[];
  cloudSync?: CloudSyncState;
  onConnectCloud?: () => Promise<boolean> | void;
  onSyncNow?: () => Promise<boolean> | void;
  onDisconnectCloud?: () => Promise<void> | void;
  onDismissCloudError?: () => void;
  onLoginSuccess: (user: AppUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  shop,
  users: propUsers,
  cloudSync,
  onConnectCloud,
  onSyncNow,
  onDisconnectCloud,
  onDismissCloudError,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cloudNotice, setCloudNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isCloudBusy =
    cloudSync?.status === 'connecting' || cloudSync?.status === 'syncing';
  const isCloudConnected = Boolean(cloudSync?.userUid);
  const latestUsers =
    propUsers && propUsers.length > 0 ? propUsers : StorageService.getUsers();

  const handleCloudAction = async () => {
    setCloudNotice('');
    if (!isCloudConnected) {
      await onConnectCloud?.();
      return;
    }
    const ok = await onSyncNow?.();
    if (ok) {
      setCloudNotice('Firebase থেকে সর্বশেষ ইউজার ও দোকানের তথ্য আপডেট হয়েছে!');
      setTimeout(() => setCloudNotice(''), 4000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const trimmedUser = username.trim().toLowerCase();
    const usersSnapshot =
      propUsers && propUsers.length > 0 ? propUsers : StorageService.getUsers();
    const foundUser = usersSnapshot.find(
      (u) => u.username.toLowerCase() === trimmedUser && u.password === password
    );

    setTimeout(() => {
      setIsLoading(false);
      if (!foundUser) {
        setErrorMsg('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।');
        return;
      }

      StorageService.setCurrentUser(foundUser);
      StorageService.setAuthSession(true);
      setSuccessMsg(`স্বাগতম, ${foundUser.name}! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...`);
      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 400);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-xs select-none">
      {/* Top Clean Shop Title Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-100 font-bold truncate">{shop.name}</span>
        </div>

        {cloudSync && (
          <button
            type="button"
            onClick={() => void handleCloudAction()}
            disabled={isCloudBusy}
            title={
              isCloudConnected
                ? `ক্লাউড সিঙ্ক চালু (${cloudSync.userEmail || 'Google'}) — ক্লিক করে এখনই আপডেট নিন`
                : 'Firebase থেকে সব ডাটা ও ইউজার সিঙ্ক করতে Google দিয়ে কানেক্ট করুন'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-semibold transition cursor-pointer shrink-0 ${
              cloudSync.status === 'synced'
                ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300 hover:bg-emerald-900/70'
                : cloudSync.status === 'error'
                ? 'bg-rose-950/80 border-rose-600/70 text-rose-300 hover:bg-rose-900/70'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
            }`}
          >
            {isCloudBusy ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : cloudSync.status === 'synced' ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : cloudSync.status === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>
              {isCloudBusy
                ? 'ক্লাউড সিঙ্ক হচ্ছে...'
                : isCloudConnected
                ? `সিঙ্ক চালু (${cloudSync.userEmail || 'Google'})`
                : 'Google দিয়ে ক্লাউড সিঙ্ক চালু করুন'}
            </span>
          </button>
        )}
      </div>

      {cloudSync?.errorMessage && (
        <div className="bg-rose-950/90 border-b border-rose-800 px-4 py-2 text-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{cloudSync.errorMessage}</span>
          </div>
          {onDismissCloudError && (
            <button
              type="button"
              onClick={onDismissCloudError}
              className="p-0.5 text-rose-300 hover:text-white cursor-pointer shrink-0"
              aria-label="ত্রুটি বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Center Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
          {/* Header Banner */}
          <div className="bg-linear-to-b from-slate-800 to-slate-900 p-5 sm:p-6 text-center border-b border-slate-800">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl mb-3 shadow-inner">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              লগিন প্যানেল (User Login)
            </h1>
            <p className="mt-1.5 text-xs text-emerald-400 font-semibold">
              {shop.name}
            </p>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Firebase Sync Control Inside Login Card */}
            {cloudSync && (
              <div
                className={`p-3 rounded-xl border space-y-2 ${
                  cloudSync.status === 'synced'
                    ? 'bg-emerald-950/40 border-emerald-700/60'
                    : cloudSync.status === 'error'
                    ? 'bg-rose-950/40 border-rose-700/60'
                    : 'bg-slate-950/80 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isCloudBusy ? (
                      <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
                    ) : isCloudConnected ? (
                      <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <CloudOff className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 text-[11px] truncate">
                        {isCloudConnected
                          ? `Firebase সিঙ্ক: ${cloudSync.userEmail}`
                          : 'Firebase ক্লাউড সিঙ্ক (সংযুক্ত নয়)'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isCloudConnected
                          ? `সর্বশেষ সিঙ্ক: ${cloudSync.lastSyncedAt || 'এখন'} • ${latestUsers.length} ইউজার`
                          : 'সব ডিভাইসে একই ডাটা পেতে প্রতিটি ডিভাইসে একই Google অ্যাকাউন্ট দিয়ে কানেক্ট করুন'}
                      </div>
                    </div>
                  </div>
                </div>

                {cloudNotice && (
                  <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{cloudNotice}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {!isCloudConnected ? (
                    <button
                      type="button"
                      disabled={isCloudBusy}
                      onClick={() => void handleCloudAction()}
                      className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>
                        {isCloudBusy
                          ? 'Google সংযোগ হচ্ছে...'
                          : 'Google দিয়ে Firebase সিঙ্ক চালু করুন'}
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isCloudBusy}
                        onClick={() => void handleCloudAction()}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCloudBusy ? 'animate-spin' : ''}`} />
                        <span>এখনই আপডেট নিন</span>
                      </button>
                      {onDisconnectCloud && (
                        <button
                          type="button"
                          disabled={isCloudBusy}
                          onClick={() => void onDisconnectCloud()}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>ডিসকানেক্ট</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-700/80 rounded-xl text-rose-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-medium text-xs">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-medium text-xs">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">
                  ইউজারনেম (Username):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="আপনার ইউজারনেম দিন (যেমন: admin)"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">
                  পাসওয়ার্ড (Password):
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-11 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium font-mono text-sm focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 p-0.5 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition flex items-center justify-center gap-2 mt-2 text-sm min-h-[46px]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>লগিন করে প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800 text-center text-slate-500 text-[11px]">
            প্রতিবার ব্রাউজার বন্ধ করে পুনরায় ওপেন করলে নিরাপত্তার জন্য নতুন করে লগিন করতে হবে।
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-2.5 px-4 bg-slate-900 border-t border-slate-800 text-slate-500 text-center text-[11px] leading-relaxed">
        {shop.name} &bull; {shop.address} &bull; হেল্পলাইন: {shop.phones}
      </div>
    </div>
  );
};
