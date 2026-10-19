import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ArrowUpDown, 
  Save, 
  X, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { DailyAccount, Language } from '../types';
import { t, formatNumber, getMonthName } from '../utils/i18n';

interface DailyAccountsViewProps {
  dailyAccounts: DailyAccount[];
  onAddAccount: (acc: DailyAccount) => void;
  onUpdateAccount: (acc: DailyAccount) => void;
  onDeleteAccount: (id: string) => void;
  language: Language;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

export const DailyAccountsView: React.FC<DailyAccountsViewProps> = ({
  dailyAccounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  language,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially,
}) => {
  const currentDate = new Date();
  const [filterYear, setFilterYear] = useState<number>(currentDate.getFullYear());
  const [filterMonth, setFilterMonth] = useState<number>(currentDate.getMonth() + 1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  // Form Fields
  const [formYear, setFormYear] = useState<number>(currentDate.getFullYear());
  const [formMonth, setFormMonth] = useState<number>(currentDate.getMonth() + 1);
  const [formDate, setFormDate] = useState<string>(currentDate.toISOString().split('T')[0]);

  // Income Fields
  const [khariz, setKhariz] = useState<number>(0);
  const [chobi, setChobi] = useState<number>(0);
  const [photocopy, setPhotocopy] = useState<number>(0);
  const [internet, setInternet] = useState<number>(0);
  const [othersIncome, setOthersIncome] = useState<number>(0);
  const [incomeRemarks, setIncomeRemarks] = useState<string>('');

  // Expense Fields
  const [kagoj, setKagoj] = useState<number>(0);
  const [hardware, setHardware] = useState<number>(0);
  const [dps, setDps] = useState<number>(0);
  const [dailyDeposit, setDailyDeposit] = useState<number>(0);
  const [advanceSalary, setAdvanceSalary] = useState<number>(0);
  const [othersExpense, setOthersExpense] = useState<number>(0);
  const [expenseRemarks, setExpenseRemarks] = useState<string>('');

  // Sub Tab inside Form
  const [formTab, setFormTab] = useState<'income' | 'expense'>('income');

  // Automated Real-time Calculations
  const calculatedTotalIncome = useMemo(() => {
    return (
      Number(khariz || 0) +
      Number(chobi || 0) +
      Number(photocopy || 0) +
      Number(internet || 0) +
      Number(othersIncome || 0)
    );
  }, [khariz, chobi, photocopy, internet, othersIncome]);

  const calculatedTotalExpense = useMemo(() => {
    return (
      Number(kagoj || 0) +
      Number(hardware || 0) +
      Number(dps || 0) +
      Number(dailyDeposit || 0) +
      Number(advanceSalary || 0) +
      Number(othersExpense || 0)
    );
  }, [kagoj, hardware, dps, dailyDeposit, advanceSalary, othersExpense]);

  const calculatedRemainingBalance = useMemo(() => {
    return calculatedTotalIncome - calculatedTotalExpense;
  }, [calculatedTotalIncome, calculatedTotalExpense]);

  // Filter accounts according to chosen Year and Month
  const filteredAccounts = useMemo(() => {
    const list = dailyAccounts.filter((acc) => {
      return acc.year === filterYear && acc.month === filterMonth;
    });

    return list.sort((a, b) => {
      return sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });
  }, [dailyAccounts, filterYear, filterMonth, sortOrder]);

  // Calculate Sheet Totals
  const sheetTotalIncome = filteredAccounts.reduce((sum, a) => sum + a.income.total, 0);
  const sheetTotalExpense = filteredAccounts.reduce((sum, a) => sum + a.expense.total, 0);
  const sheetNetBalance = sheetTotalIncome - sheetTotalExpense;

  // Breakdown totals for the sheet
  const sheetKhariz = filteredAccounts.reduce((sum, a) => sum + a.income.khariz, 0);
  const sheetChobi = filteredAccounts.reduce((sum, a) => sum + a.income.chobi, 0);
  const sheetPhotocopy = filteredAccounts.reduce((sum, a) => sum + a.income.photocopy, 0);
  const sheetInternet = filteredAccounts.reduce((sum, a) => sum + a.income.internet, 0);
  const sheetOthersIncome = filteredAccounts.reduce((sum, a) => sum + a.income.others, 0);

  const sheetKagoj = filteredAccounts.reduce((sum, a) => sum + a.expense.kagoj, 0);
  const sheetHardware = filteredAccounts.reduce((sum, a) => sum + a.expense.hardware, 0);
  const sheetDps = filteredAccounts.reduce((sum, a) => sum + a.expense.dps, 0);
  const sheetDailyDeposit = filteredAccounts.reduce((sum, a) => sum + a.expense.dailyDeposit, 0);
  const sheetAdvanceSalary = filteredAccounts.reduce((sum, a) => sum + a.expense.advanceSalary, 0);
  const sheetOthersExpense = filteredAccounts.reduce((sum, a) => sum + a.expense.others, 0);

  const handleOpenAddModal = () => {
    const now = new Date();
    setEditingAccountId(null);
    setFormYear(now.getFullYear());
    setFormMonth(now.getMonth() + 1);
    setFormDate(now.toISOString().split('T')[0]);

    setKhariz(0);
    setChobi(0);
    setPhotocopy(0);
    setInternet(0);
    setOthersIncome(0);
    setIncomeRemarks('');

    setKagoj(0);
    setHardware(0);
    setDps(0);
    setDailyDeposit(0);
    setAdvanceSalary(0);
    setOthersExpense(0);
    setExpenseRemarks('');

    setFormTab('income');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: DailyAccount) => {
    setEditingAccountId(acc.id);
    setFormYear(acc.year);
    setFormMonth(acc.month);
    setFormDate(acc.date);

    setKhariz(acc.income.khariz);
    setChobi(acc.income.chobi);
    setPhotocopy(acc.income.photocopy);
    setInternet(acc.income.internet);
    setOthersIncome(acc.income.others);
    setIncomeRemarks(acc.income.remarks || '');

    setKagoj(acc.expense.kagoj);
    setHardware(acc.expense.hardware);
    setDps(acc.expense.dps);
    setDailyDeposit(acc.expense.dailyDeposit);
    setAdvanceSalary(acc.expense.advanceSalary);
    setOthersExpense(acc.expense.others);
    setExpenseRemarks(acc.expense.remarks || '');

    setFormTab('income');
    setIsModalOpen(true);
  };

  const handleDateChange = (val: string) => {
    setFormDate(val);
    if (val) {
      const parts = val.split('-');
      if (parts.length === 3) {
        setFormYear(parseInt(parts[0], 10));
        setFormMonth(parseInt(parts[1], 10));
      }
    }
  };

  const handleSaveDailyAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const accountData: DailyAccount = {
      id: editingAccountId || `acc-${Date.now()}`,
      year: formYear,
      month: formMonth,
      date: formDate,
      income: {
        khariz: Number(khariz || 0),
        chobi: Number(chobi || 0),
        photocopy: Number(photocopy || 0),
        internet: Number(internet || 0),
        others: Number(othersIncome || 0),
        total: calculatedTotalIncome,
        remarks: incomeRemarks,
      },
      expense: {
        kagoj: Number(kagoj || 0),
        hardware: Number(hardware || 0),
        dps: Number(dps || 0),
        dailyDeposit: Number(dailyDeposit || 0),
        advanceSalary: Number(advanceSalary || 0),
        others: Number(othersExpense || 0),
        total: calculatedTotalExpense,
        remarks: expenseRemarks,
      },
      remainingBalance: calculatedRemainingBalance,
      createdAt: new Date().toISOString(),
      updatedAt: editingAccountId ? new Date().toISOString() : undefined,
    };

    if (editingAccountId) {
      onUpdateAccount(accountData);
    } else {
      onAddAccount(accountData);
    }

    setIsModalOpen(false);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Search Controls */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>দৈনন্দিন হিসাব-নিকাশ ও ক্যাশ লেজার</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('navDailyAccounts', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              খারিজ, ছবি, ফটোকপি ও ইন্টারনেটের আয়ের সাথে কাগজ, হার্ডওয়্যার ও খরচের মাসিক স্বয়ংক্রিয় শীট
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addTodayAccount', language)}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{t('print', language)}</span>
            </button>
          </div>
        </div>

        {/* Filter / Search Section ("হিসাবের শীট দেখুন") */}
        <div className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>{t('viewAccountSheet', language)}:</span>
            </span>

            {/* Select Year */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value={2025}>২০২৫ সাল</option>
              <option value={2026}>২০২৬ সাল</option>
              <option value={2027}>২০২৭ সাল</option>
            </select>

            {/* Select Month */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m, language)}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'নতুন তারিখ আগে' : 'পুরাতন তারিখ আগে'}</span>
            </button>
          </div>

          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            {getMonthName(filterMonth, language)} {formatNumber(filterYear, language)} মাসের শিট ({filteredAccounts.length} দিনের এন্ট্রি)
          </div>
        </div>
      </div>

      {/* Sheet Summary 3-Column Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('totalIncome', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ৳{formatNumber(sheetTotalIncome, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            খারিজ, ছবি, ফটোকপি ও ইন্টারনেট সেবা
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('totalExpense', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            ৳{formatNumber(sheetTotalExpense, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            কাগজ, হার্ডওয়্যার, ডিপিএস ও জমা
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('remainingBalance', language)}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${
            sheetNetBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'
          }`}>
            ৳{formatNumber(sheetNetBalance, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            সার্বিক উদ্বৃত্ত নগদ স্থিতি (আয় - ব্যয়)
          </p>
        </div>
      </div>

      {/* Main Monthly Ledger Sheet Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden print-card">
        {/* Printable Letterhead info for print mode */}
        <div className="hidden print-only mb-6 text-center border-b pb-4">
          <h2 className="text-xl font-bold">ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম, বগুড়া</h2>
          <h3 className="text-sm font-semibold mt-1">
            মাসিক ক্যাশ ও হিসাব-নিকাশ বিবরণী: {getMonthName(filterMonth, 'bn')} {formatNumber(filterYear, 'bn')}
          </h3>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>মাসিক আয়-ব্যয়ের পূর্ণাঙ্গ বিবরণী শীট ({getMonthName(filterMonth, language)} {formatNumber(filterYear, language)})</span>
          </h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              {/* Main header row */}
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold uppercase text-[10px]">
                <th className="py-2.5 px-2 border border-slate-200 dark:border-slate-700" rowSpan={2}>তারিখ</th>
                <th className="py-2.5 px-2 border border-slate-200 dark:border-slate-700 text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" colSpan={6}>
                  আয় খাতসমূহ (Income)
                </th>
                <th className="py-2.5 px-2 border border-slate-200 dark:border-slate-700 text-center bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300" colSpan={7}>
                  ব্যয় খাতসমূহ (Expense)
                </th>
                <th className="py-2.5 px-2 border border-slate-200 dark:border-slate-700 text-right bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300" rowSpan={2}>
                  অবশিষ্ট ফলাফল
                </th>
                <th className="py-2.5 px-2 border border-slate-200 dark:border-slate-700 text-center no-print" rowSpan={2}>
                  {t('actions', language)}
                </th>
              </tr>
              {/* Sub header row */}
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                {/* Income Columns */}
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">খারিজ</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">ছবি</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">ফটোকপি</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">ইন্টারনেট</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">অন্যান্য</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-black bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700">মোট আয়</th>

                {/* Expense Columns */}
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">কাগজ</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">হার্ডওয়্যার</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">ডিপিএস</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">দৈনিক জমা</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">অগ্রীম বেতন</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right">অন্যান্য</th>
                <th className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-black bg-rose-50/80 dark:bg-rose-950/60 text-rose-700">মোট ব্যয়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={16} className="py-8 text-center text-slate-400">
                    এই মাসের কোনো হিসাব এন্ট্রি করা হয়নি। 'আজকের হিসাব যুক্ত করুন' বাটন চেপে যুক্ত করুন।
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    {/* Date */}
                    <td className="py-2 px-2 border border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap">
                      {acc.date}
                    </td>

                    {/* Income */}
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.income.khariz, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.income.chobi, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.income.photocopy, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.income.internet, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.income.others, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-bold text-emerald-600 bg-emerald-50/30 font-mono">
                      {formatNumber(acc.income.total, language)}
                    </td>

                    {/* Expense */}
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.kagoj, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.hardware, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.dps, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.dailyDeposit, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.advanceSalary, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                      {formatNumber(acc.expense.others, language)}
                    </td>
                    <td className="py-2 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-bold text-rose-600 bg-rose-50/30 font-mono">
                      {formatNumber(acc.expense.total, language)}
                    </td>

                    {/* Net Remaining Balance */}
                    <td className="py-2 px-2 border border-slate-200 dark:border-slate-700 text-right font-black font-mono">
                      <span className={`px-1.5 py-0.5 rounded ${
                        acc.remainingBalance >= 0 ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950' : 'text-rose-700 bg-rose-50'
                      }`}>
                        ৳{formatNumber(acc.remainingBalance, language)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-2 border border-slate-200 dark:border-slate-700 text-center whitespace-nowrap no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(acc)}
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                          title={t('editAccount', language)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('আপনি কি এই হিসাবের রেকর্ডটি মুছে ফেলতে চান?')) {
                              onDeleteAccount(acc.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer with Monthly Totals */}
            {filteredAccounts.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-100">
                  <td className="py-2.5 px-2 border border-slate-200 dark:border-slate-700">
                    মাসিক সর্বমোট:
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetKhariz, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetChobi, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetPhotocopy, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetInternet, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetOthersIncome, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right text-emerald-600 bg-emerald-100/50 dark:bg-emerald-950 font-mono">
                    ৳{formatNumber(sheetTotalIncome, language)}
                  </td>

                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetKagoj, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetHardware, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetDps, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetDailyDeposit, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetAdvanceSalary, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right font-mono">
                    {formatNumber(sheetOthersExpense, language)}
                  </td>
                  <td className="py-2.5 px-1.5 border border-slate-200 dark:border-slate-700 text-right text-rose-600 bg-rose-100/50 dark:bg-rose-950 font-mono">
                    ৳{formatNumber(sheetTotalExpense, language)}
                  </td>

                  <td className="py-2.5 px-2 border border-slate-200 dark:border-slate-700 text-right text-blue-700 bg-blue-100/50 dark:bg-blue-950 font-mono">
                    ৳{formatNumber(sheetNetBalance, language)}
                  </td>
                  <td className="border border-slate-200 dark:border-slate-700 no-print" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add / Edit Daily Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-emerald-200" />
                <h3 className="text-base font-bold">
                  {editingAccountId ? t('editAccount', language) : t('addTodayAccount', language)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseAddModalInitially) onCloseAddModalInitially();
                }}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDailyAccount} className="p-6 space-y-5 text-xs">
              {/* Year, Month, Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('selectDate', language)} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('selectMonth', language)}
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {getMonthName(m, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('selectYear', language)}
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Income vs Expense Tabs inside Modal */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormTab('income')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    formTab === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>আয় ট্যাব (Income)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('expense')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    formTab === 'expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>ব্যয় ট্যাব (Expense)</span>
                </button>
              </div>

              {/* Tab 1: Income Fields */}
              {formTab === 'income' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('kharizIncome', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={khariz}
                        onChange={(e) => setKhariz(Number(e.target.value))}
                        placeholder="খারিজ বাবদ আয়"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('chobiIncome', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={chobi}
                        onChange={(e) => setChobi(Number(e.target.value))}
                        placeholder="ছবি বাবদ আয়"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('photocopyIncome', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={photocopy}
                        onChange={(e) => setPhotocopy(Number(e.target.value))}
                        placeholder="ফটোকপি বাবদ আয়"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('internetIncome', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={internet}
                        onChange={(e) => setInternet(Number(e.target.value))}
                        placeholder="ইন্টারনেট ও ফরম পূরণ আয়"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('othersIncome', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={othersIncome}
                        onChange={(e) => setOthersIncome(Number(e.target.value))}
                        placeholder="অন্যান্য বিবিধ আয়"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      আয় সংক্রান্ত বিবরণ / মন্তব্য
                    </label>
                    <input
                      type="text"
                      value={incomeRemarks}
                      onChange={(e) => setIncomeRemarks(e.target.value)}
                      placeholder="যেমন: ৩টি নতুন নামজারি আবেদন"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Expense Fields */}
              {formTab === 'expense' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('kagojExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={kagoj}
                        onChange={(e) => setKagoj(Number(e.target.value))}
                        placeholder="কাগজ ও রিম ক্রয় বাবদ"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('hardwareExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={hardware}
                        onChange={(e) => setHardware(Number(e.target.value))}
                        placeholder="হার্ডওয়্যার ও টোনার রিফিল"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('dpsExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={dps}
                        onChange={(e) => setDps(Number(e.target.value))}
                        placeholder="ডিপিএস কিস্তি জমা"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('dailyDepositExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={dailyDeposit}
                        onChange={(e) => setDailyDeposit(Number(e.target.value))}
                        placeholder="প্রতিদিনের অফিস জমা"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('advanceSalaryExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={advanceSalary}
                        onChange={(e) => setAdvanceSalary(Number(e.target.value))}
                        placeholder="অগ্রীম বেতন প্রদান"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('othersExpense', language)} (টাকা)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={othersExpense}
                        onChange={(e) => setOthersExpense(Number(e.target.value))}
                        placeholder="অন্যান্য বিবিধ খরচ"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ব্যয় সংক্রান্ত বিবরণ / মন্তব্য
                    </label>
                    <input
                      type="text"
                      value={expenseRemarks}
                      onChange={(e) => setExpenseRemarks(e.target.value)}
                      placeholder="যেমন: ১ রিম কাগজ ক্রয় ও প্রিন্টার সার্ভিস"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Automated Calculated Results: মোট আয়, মোট ব্যয়, অবশিষ্ট ফলাফল */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-700">
                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                    {t('totalIncome', language)} (স্বয়ংক্রিয়)
                  </span>
                  <div className="text-lg font-black text-emerald-400 mt-1">
                    ৳{formatNumber(calculatedTotalIncome, language)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                    {t('totalExpense', language)} (স্বয়ংক্রিয়)
                  </span>
                  <div className="text-lg font-black text-rose-400 mt-1">
                    ৳{formatNumber(calculatedTotalExpense, language)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    {t('remainingBalance', language)}
                  </span>
                  <div className="text-lg font-black text-blue-300 mt-1">
                    ৳{formatNumber(calculatedRemainingBalance, language)}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseAddModalInitially) onCloseAddModalInitially();
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAccountId ? 'হিসাব আপডেট সম্পন্ন করুন' : 'হিসাব সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
