import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  CreditCard, 
  Coins, 
  Download,
  Building2,
  FileCheck
} from 'lucide-react';
import { AppStateData, Language } from '../types';
import { t, formatNumber, getMonthName } from '../utils/i18n';

interface ReportsViewProps {
  data: AppStateData;
  language: Language;
}

type ReportPeriod = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export const ReportsView: React.FC<ReportsViewProps> = ({ data, language }) => {
  const currentDate = new Date();
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(4); // Q4 Oct-Dec
  const [selectedHalf, setSelectedHalf] = useState<number>(2); // H2 Jul-Dec

  // Filter daily accounts by chosen period
  const filteredAccounts = useMemo(() => {
    return data.dailyAccounts.filter((acc) => {
      if (acc.year !== selectedYear) return false;

      if (period === 'monthly') {
        return acc.month === selectedMonth;
      }
      if (period === 'quarterly') {
        if (selectedQuarter === 1) return acc.month >= 1 && acc.month <= 3;
        if (selectedQuarter === 2) return acc.month >= 4 && acc.month <= 6;
        if (selectedQuarter === 3) return acc.month >= 7 && acc.month <= 9;
        return acc.month >= 10 && acc.month <= 12;
      }
      if (period === 'half-yearly') {
        if (selectedHalf === 1) return acc.month >= 1 && acc.month <= 6;
        return acc.month >= 7 && acc.month <= 12;
      }
      if (period === 'yearly') {
        return true;
      }
      return true;
    });
  }, [data.dailyAccounts, period, selectedYear, selectedMonth, selectedQuarter, selectedHalf]);

  // Aggregate financials
  const totalIncome = filteredAccounts.reduce((sum, a) => sum + a.income.total, 0);
  const totalExpense = filteredAccounts.reduce((sum, a) => sum + a.expense.total, 0);
  const netBalance = totalIncome - totalExpense;

  // Breakdown of Income
  const kharizTotal = filteredAccounts.reduce((sum, a) => sum + a.income.khariz, 0);
  const chobiTotal = filteredAccounts.reduce((sum, a) => sum + a.income.chobi, 0);
  const photocopyTotal = filteredAccounts.reduce((sum, a) => sum + a.income.photocopy, 0);
  const internetTotal = filteredAccounts.reduce((sum, a) => sum + a.income.internet, 0);
  const othersIncomeTotal = filteredAccounts.reduce((sum, a) => sum + a.income.others, 0);

  // Breakdown of Expenses
  const kagojTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.kagoj, 0);
  const hardwareTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.hardware, 0);
  const dpsTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.dps, 0);
  const dailyDepositTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.dailyDeposit, 0);
  const advanceSalaryTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.advanceSalary, 0);
  const othersExpenseTotal = filteredAccounts.reduce((sum, a) => sum + a.expense.others, 0);

  // Period label
  const periodLabel = useMemo(() => {
    if (period === 'monthly') {
      return `${getMonthName(selectedMonth, language)} ${formatNumber(selectedYear, language)} (মাসিক প্রতিবেদন)`;
    }
    if (period === 'quarterly') {
      const qNames = ['১ম কোয়ার্টার (জানু - মার্চ)', '২য় কোয়ার্টার (এপ্রিল - জুন)', '৩য় কোয়ার্টার (জুলাই - সেপ্টে)', '৪র্থ কোয়ার্টার (অক্টো - ডিসে)'];
      return `${qNames[selectedQuarter - 1]} ${formatNumber(selectedYear, language)} (ত্রৈমাসিক)`;
    }
    if (period === 'half-yearly') {
      return `${selectedHalf === 1 ? '১ম অর্ধবার্ষিক (জানুয়ারি - জুন)' : '২য় অর্ধবার্ষিক (জুলাই - ডিসেম্বর)'} ${formatNumber(selectedYear, language)}`;
    }
    return `${formatNumber(selectedYear, language)} অর্থবছর / পূর্ণ বার্ষিক প্রতিবেদন`;
  }, [period, selectedYear, selectedMonth, selectedQuarter, selectedHalf, language]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card & Controls */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>রিপোর্টস ও অ্যানালিটিক্স</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('reportsTitle', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              মাসিক, ত্রৈমাসিক, অর্ধবার্ষিক ও বাৎসরিক আয়-ব্যয় এবং সার্বিক অপারেশনাল রিপোর্ট
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 self-start lg:self-center"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printReport', language)}</span>
          </button>
        </div>

        {/* Period Selector Tabs */}
        <div className="mt-6 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('monthlyReport', language)}
            </button>
            <button
              type="button"
              onClick={() => setPeriod('quarterly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'quarterly'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('quarterlyReport', language)}
            </button>
            <button
              type="button"
              onClick={() => setPeriod('half-yearly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'half-yearly'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('halfYearlyReport', language)}
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('yearlyReport', language)}
            </button>
          </div>

          {/* Conditional Dropdowns based on Period */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value={2025}>২০২৫</option>
              <option value={2026}>২০২৬</option>
              <option value={2027}>২০২৭</option>
            </select>

            {period === 'monthly' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {getMonthName(m, language)}
                  </option>
                ))}
              </select>
            )}

            {period === 'quarterly' && (
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value={1}>১ম ত্রৈমাসিক (জানু - মার্চ)</option>
                <option value={2}>২য় ত্রৈমাসিক (এপ্রিল - জুন)</option>
                <option value={3}>৩য় ত্রৈমাসিক (জুলাই - সেপ্টে)</option>
                <option value={4}>৪র্থ ত্রৈমাসিক (অক্টো - ডিসে)</option>
              </select>
            )}

            {period === 'half-yearly' && (
              <select
                value={selectedHalf}
                onChange={(e) => setSelectedHalf(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value={1}>১ম অর্ধবার্ষিক (জানু - জুন)</option>
                <option value={2}>২য় অর্ধবার্ষিক (জুলাই - ডিসে)</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main Printable Report View */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 print-card">
        {/* Printable Official Header */}
        <div className="text-center border-b pb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl mb-2 shadow-md">
            ভূমি
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {data.organization.name}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {data.organization.address} • ফোন: {data.organization.phone} • রেজি: {data.organization.registrationNumber}
          </p>
          <div className="inline-block mt-3 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded-full text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            {periodLabel}
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500">{t('totalIncome', language)}</span>
            <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              ৳{formatNumber(totalIncome, language)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              মোট সংগৃহীত সেবা ফি
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500">{t('totalExpense', language)}</span>
            <div className="text-2xl font-black text-rose-600 mt-2 font-mono">
              ৳{formatNumber(totalExpense, language)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              পরিচালন ও অফিসিয়াল খরচ
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500">নীট মুনাফা / অবশিষ্ট স্থিতি</span>
            <div className={`text-2xl font-black mt-2 font-mono ${
              netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'
            }`}>
              ৳{formatNumber(netBalance, language)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              সার্বিক উদ্বৃত্ত নগদ তহবিল
            </p>
          </div>
        </div>

        {/* Detailed Category Breakdown: Income vs Expense Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Income Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 font-bold text-emerald-800 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span>আয়ের বিস্তারিত খাতসমূহ</span>
              <span className="font-mono">মোট: ৳{formatNumber(totalIncome, language)}</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2">
              <div className="py-2 px-3 flex justify-between">
                <span>১. খারিজ (ই-নামজারি) সেবা ফি</span>
                <span className="font-bold font-mono">৳{formatNumber(kharizTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>২. ছবি তোলা ও প্রিন্ট</span>
                <span className="font-bold font-mono">৳{formatNumber(chobiTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৩. ফটোকপি সেবা</span>
                <span className="font-bold font-mono">৳{formatNumber(photocopyTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৪. ইন্টারনেট ব্রাউজিং ও অনলাইন ফর্ম পূরণ</span>
                <span className="font-bold font-mono">৳{formatNumber(internetTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৫. অন্যান্য বিবিধ সরকারি ও বেসরকারি সেবা</span>
                <span className="font-bold font-mono">৳{formatNumber(othersIncomeTotal, language)}</span>
              </div>
            </div>
          </div>

          {/* Expense Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-rose-50 dark:bg-rose-950/60 p-3 font-bold text-rose-800 dark:text-rose-300 border-b border-rose-200 dark:border-rose-800 flex items-center justify-between">
              <span>ব্যয়ের বিস্তারিত খাতসমূহ</span>
              <span className="font-mono">মোট: ৳{formatNumber(totalExpense, language)}</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2">
              <div className="py-2 px-3 flex justify-between">
                <span>১. কাগজ ও স্টেশনারি মালামাল</span>
                <span className="font-bold font-mono">৳{formatNumber(kagojTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>২. হার্ডওয়্যার, প্রিন্টার টোনার ও মেরামত</span>
                <span className="font-bold font-mono">৳{formatNumber(hardwareTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৩. ডিপিএস ও সঞ্চয় জমা</span>
                <span className="font-bold font-mono">৳{formatNumber(dpsTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৪. প্রতিদিনের রিজার্ভ ও নগদ অফিস জমা</span>
                <span className="font-bold font-mono">৳{formatNumber(dailyDepositTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৫. অগ্রীম বেতন প্রদান</span>
                <span className="font-bold font-mono">৳{formatNumber(advanceSalaryTotal, language)}</span>
              </div>
              <div className="py-2 px-3 flex justify-between">
                <span>৬. অন্যান্য বিবিধ অফিস ও আপ্যায়ন ব্যয়</span>
                <span className="font-bold font-mono">৳{formatNumber(othersExpenseTotal, language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Signatures */}
        <div className="pt-16 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="w-32 mx-auto border-t border-slate-400 pt-1 font-bold">
              হিসাবরক্ষক
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">যাচাইকৃত</p>
          </div>
          <div>
            <div className="w-32 mx-auto border-t border-slate-400 pt-1 font-bold">
              সফটওয়্যার অডিট সিল
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">সিস্টেম জেনারেটেড</p>
          </div>
          <div>
            <div className="w-32 mx-auto border-t border-slate-400 pt-1 font-bold">
              উদ্যোক্তা ও পরিচালক
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{data.organization.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
