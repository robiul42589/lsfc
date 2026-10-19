import React, { useState } from 'react';
import { 
  CloudCheck, 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileJson,
  Server,
  HardDrive
} from 'lucide-react';
import { AppStateData, Language } from '../types';
import { t, formatNumber } from '../utils/i18n';
import { exportDataAsJSON, syncWithCloudServer, restoreFromCloudServer } from '../utils/storage';
import { initialAppData } from '../data/initialData';

interface DataBackupViewProps {
  data: AppStateData;
  onRestoreData: (restored: AppStateData) => void;
  language: Language;
}

export const DataBackupView: React.FC<DataBackupViewProps> = ({
  data,
  onRestoreData,
  language,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoringCloud, setIsRestoringCloud] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportJSON = () => {
    try {
      exportDataAsJSON(data);
      setStatusMessage({
        type: 'success',
        text: 'লোকাল ব্যাকআপ ফাইল (JSON) সফলভাবে ডাউনলোড হয়েছে!',
      });
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: 'ব্যাকআপ ডাউনলোডে সমস্যা হয়েছে: ' + e.message,
      });
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.organization || !parsed.employees) {
          throw new Error('অবৈধ ব্যাকআপ ফাইল স্ট্রাকচার');
        }
        onRestoreData(parsed);
        setStatusMessage({
          type: 'success',
          text: 'ব্যাকআপ ফাইল হতে সমস্ত তথ্য সফলভাবে রিস্টোর হয়েছে!',
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: 'ব্যাকআপ রিস্টোর ব্যর্থ হয়েছে: ' + err.message,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    const result = await syncWithCloudServer(data);
    setIsSyncing(false);
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: 'ক্লাউড সার্ভারের সাথে সফলভাবে সিঙ্ক সম্পন্ন হয়েছে! (সময়: ' + new Date().toLocaleTimeString() + ')',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleCloudRestore = async () => {
    if (!window.confirm('আপনি কি ক্লাউড সার্ভার হতে সর্বশেষ ব্যাকআপ ডেটা নামিয়ে আনতে চান? বর্তমান আন-সিঙ্ক ডেটা প্রতিস্থাপিত হতে পারে।')) return;

    setIsRestoringCloud(true);
    setStatusMessage(null);
    const result = await restoreFromCloudServer();
    setIsRestoringCloud(false);
    if (result.success && result.data) {
      onRestoreData(result.data);
      setStatusMessage({
        type: 'success',
        text: 'ক্লাউড সার্ভার হতে ডেটা সফলভাবে রিস্টোর করা হয়েছে!',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি নন্দীগ্রাম ডিজিটাল সেন্টারের অফিসিয়াল প্রাথমিক ডেমো ডেটায় রিসেট করতে চান?')) {
      onRestoreData(initialAppData);
      setStatusMessage({
        type: 'success',
        text: 'প্রাথমিক স্ট্যান্ডার্ড ডেটাবেজে সফলভাবে রিসেট সম্পন্ন হয়েছে।',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>ডেটা সেন্টার ও নিরাপত্তা</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('backupTitle', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ভূমি সেবা কেন্দ্র ও ডিজিটাল সেন্টারের সকল তথ্য ক্লাউড এবং লোকাল ফাইলে সুরক্ষিত রাখুন
            </p>
          </div>

          <button
            type="button"
            onClick={handleCloudSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            <CloudCheck className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'ক্লাউডে সিঙ্ক হচ্ছে...' : t('syncNow', language)}</span>
          </button>
        </div>

        {/* Status Alert if any */}
        {statusMessage && (
          <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Database Inventory Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">মোট কর্মী</span>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">
              {formatNumber(data.employees.length, language)} জন
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">হিসাব রেকর্ড</span>
            <div className="text-lg font-black text-emerald-600 mt-1">
              {formatNumber(data.dailyAccounts.length, language)} টি
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">হাজিরা লগ</span>
            <div className="text-lg font-black text-blue-600 mt-1">
              {formatNumber(data.attendance.length, language)} টি
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">ছুটি রেকর্ড</span>
            <div className="text-lg font-black text-teal-600 mt-1">
              {formatNumber(data.leaves.length, language)} টি
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">বেতন স্লিপ</span>
            <div className="text-lg font-black text-amber-600 mt-1">
              {formatNumber(data.salaryRecords.length, language)} টি
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">বিজ্ঞপ্তি</span>
            <div className="text-lg font-black text-rose-600 mt-1">
              {formatNumber(data.notifications.length, language)} টি
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Local Backup Export */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t('exportBackup', language)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              আপনার কম্পিউটার বা মোবাইলে একটি সম্পূর্ণ এনক্রিপ্টেড JSON ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ফাইল ডাউনলোড করুন</span>
          </button>
        </div>

        {/* Card 2: Local Backup Restore */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t('restoreBackup', language)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              পূর্বে ডাউনলোড করা কোনো JSON ব্যাকআপ ফাইল নির্বাচন করে সমস্ত তথ্য অ্যাপে ফিরিয়ে আনুন।
            </p>
          </div>

          <label className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>ফাইল নির্বাচন ও রিস্টোর</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        {/* Card 3: Cloud Server Restore & Re-seed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-3">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              ক্লাউড সার্ভার রিস্টোর
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ক্লাউড স্টোরেজে সংরক্ষিত সর্বশেষ ডেটাবেজ স্ন্যাপশট সরাসরি লোড করুন অথবা স্ট্যান্ডার্ড নন্দীগ্রাম ডেটায় রিসেট করুন।
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCloudRestore}
              disabled={isRestoringCloud}
              className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRestoringCloud ? 'animate-spin' : ''}`} />
              <span>ক্লাউড হতে ফিরিয়ে আনুন</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-xl transition-colors"
            >
              স্ট্যান্ডার্ড নন্দীগ্রাম ডেমো ডেটায় রিসেট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
