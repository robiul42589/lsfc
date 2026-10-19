import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  Clock, 
  Bell, 
  PlusCircle, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Trash2,
  Building
} from 'lucide-react';
import { 
  AppStateData, 
  Language, 
  NotificationItem, 
  DailyAccount 
} from '../types';
import { t, formatNumber } from '../utils/i18n';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  data: AppStateData;
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenAddAccount: () => void;
  onOpenMarkAttendance: () => void;
  onOpenAddEmployee: () => void;
  onOpenDisburseSalary: () => void;
  onAddNotification: (notif: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => void;
  onDeleteNotification: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  language,
  onNavigate,
  onOpenAddAccount,
  onOpenMarkAttendance,
  onOpenAddEmployee,
  onOpenDisburseSalary,
  onAddNotification,
  onDeleteNotification,
}) => {
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeType, setNoticeType] = useState<'urgent' | 'info' | 'warning'>('urgent');

  // Today's date string YYYY-MM-DD
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Find today's daily account
  const todayAccount: DailyAccount | undefined = data.dailyAccounts.find(
    (acc) => acc.date === todayDateStr
  );

  const todayIncome = todayAccount ? todayAccount.income.total : 0;
  const todayExpense = todayAccount ? todayAccount.expense.total : 0;
  const todayBalance = todayAccount ? todayAccount.remainingBalance : 0;

  // Total active employees
  const activeEmployees = data.employees.filter((e) => e.status === 'active');
  
  // Today's attendance stats
  const todayAttendanceRecords = data.attendance.filter(
    (a) => a.date === todayDateStr
  );
  const presentCount = todayAttendanceRecords.filter(
    (a) => a.status === 'present' || a.status === 'late'
  ).length;
  const leaveCount = todayAttendanceRecords.filter(
    (a) => a.status === 'leave'
  ).length;

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    onAddNotification({
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      type: noticeType,
    });

    setNoticeTitle('');
    setNoticeMessage('');
    setShowAddNoticeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Building className="w-3.5 h-3.5" />
              <span>{data.organization.upazila}, {data.organization.district}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {data.organization.name}
            </h2>
            <p className="text-sm text-emerald-100/90 mt-2 leading-relaxed">
              আজকের কার্যক্রমের সংক্ষিপ্ত সামারি, দৈনন্দিন হিসাবের হিসাব-নিকাশ এবং জরুরি বিজ্ঞপ্তি পর্যবেক্ষণ করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAddAccount}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addTodayAccount', language)}</span>
            </button>
            <button
              type="button"
              onClick={onOpenMarkAttendance}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>{t('markAttendance', language)}</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle pattern */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Income */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('todayIncome', language)}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
              <span className="text-lg text-emerald-600">৳</span>
              <span>{formatNumber(todayIncome, language)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {todayAccount ? `${todayAccount.date} তারিখে এন্ট্রিকৃত` : 'আজকের এন্ট্রি অপেক্ষমান'}
            </p>
          </div>
        </div>

        {/* Today's Expense */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('todayExpense', language)}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
              <span className="text-lg text-rose-600">৳</span>
              <span>{formatNumber(todayExpense, language)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              কাগজ, হার্ডওয়্যার, ডিপিএস ইত্যাদি
            </p>
          </div>
        </div>

        {/* Today's Net Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('todayBalance', language)}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-black flex items-baseline gap-1 ${
              todayBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}>
              <span className="text-lg">৳</span>
              <span>{formatNumber(todayBalance, language)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              অবশিষ্ট নগদ স্থিতি (আয় - ব্যয়)
            </p>
          </div>
        </div>

        {/* Employee Presence */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              হাজিরা ও উপস্থিতি
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {formatNumber(presentCount, language)} <span className="text-xs text-slate-500 font-normal">/ {formatNumber(activeEmployees.length, language)} জন</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {formatNumber(leaveCount, language)} জন আজ ছুটিতে
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              বিস্তারিত <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Notification Panel (জরুরি নোটিফিকেশন প্যানেল) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/40">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {t('emergencyNoticePanel', language)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                অফিস আদেশ, ভূমি মন্ত্রণালয়ের নতুন সার্কুলার ও জরুরি বিজ্ঞপ্তি
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddNoticeModal(true)}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800/80 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addNotice', language)}</span>
          </button>
        </div>

        {/* Notices list */}
        <div className="mt-4 space-y-3">
          {data.notifications.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              কোনো জরুরি বিজ্ঞপ্তি নেই
            </div>
          ) : (
            data.notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  notif.type === 'urgent'
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40'
                    : notif.type === 'warning'
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
                    : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  {notif.type === 'urgent' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  ) : notif.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {notif.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteNotification(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
                  title="বিজ্ঞপ্তি মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Action Hub & Recent Accounts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Shortcuts Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{t('quickActions', language)}</span>
          </h3>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenAddAccount}
              className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  ৳
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {t('addTodayAccount', language)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    খারিজ, ফটোকপি, ছবি ও খরচের এন্ট্রি
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </button>

            <button
              type="button"
              onClick={onOpenMarkAttendance}
              className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {t('markAttendance', language)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    কর্মচারীদের ইন ও আউট টাইম রেকর্ড
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </button>

            <button
              type="button"
              onClick={onOpenAddEmployee}
              className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {t('addNewEmployee', language)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ছবি, স্বাক্ষর, পরিবার ও যোগ্যতাসহ কর্মী নিয়োগ
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </button>

            <button
              type="button"
              onClick={onOpenDisburseSalary}
              className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                  প
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {t('disburseSalary', language)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    বেতন হিসাব ও স্বয়ংক্রিয় পে-স্লিপ প্রিন্ট
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </button>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{t('recentTransactions', language)}</span>
            </h3>

            <button
              type="button"
              onClick={() => onNavigate('daily-accounts')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              সম্পূর্ণ শিট দেখুন <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3 text-right">মোট আয়</th>
                  <th className="py-2.5 px-3 text-right">মোট ব্যয়</th>
                  <th className="py-2.5 px-3 text-right">অবশিষ্ট ফলাফল</th>
                  <th className="py-2.5 px-3">মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.dailyAccounts.slice(0, 5).map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {acc.date}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                      ৳{formatNumber(acc.income.total, language)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600 whitespace-nowrap">
                      ৳{formatNumber(acc.expense.total, language)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md ${
                        acc.remainingBalance >= 0 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        ৳{formatNumber(acc.remainingBalance, language)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px] max-w-[180px] truncate">
                      {acc.income.remarks || acc.expense.remarks || 'স্বাভাবিক কার্যক্রম'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Notification Modal */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t('addNotice', language)}
            </h3>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিজ্ঞপ্তির শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="যেমন: জরুরি সার্ভার রক্ষণাবেক্ষণ ও ভূমি কর আদায় ক্যাম্প"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিজ্ঞপ্তির ধরন
                </label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  <option value="urgent">জরুরি বিজ্ঞপ্তি (Urgent / Red)</option>
                  <option value="warning">সতর্কতামূলক (Warning / Amber)</option>
                  <option value="info">সাধারণ তথ্য (Info / Green)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  required
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="বিজ্ঞপ্তির পূর্ণাঙ্গ বার্তা লিখুন..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/30"
                >
                  বিজ্ঞপ্তি প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
