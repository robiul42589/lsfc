import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', desc: 'ড্যাশবোর্ড ওপেন করুন (Open Dashboard)' },
    { key: 'Alt + 2', desc: 'প্রতিষ্ঠান প্রোফাইল (Organization Profile)' },
    { key: 'Alt + 3', desc: 'কর্মচারী ব্যবস্থাপনা (Employee Directory)' },
    { key: 'Alt + 4', desc: 'ডিজিটাল হাজিরা (Digital Attendance)' },
    { key: 'Alt + 5', desc: 'প্রতিদিনের হিসাব-নিকাশ (Daily Accounts)' },
    { key: 'Alt + 6', desc: 'বেতন ব্যবস্থাপনা ও পে-স্লিপ (Salary / Payroll)' },
    { key: 'Alt + 7', desc: 'রিপোর্টস ও অ্যানালিটিক্স (Analytics & Reports)' },
    { key: 'Alt + 8', desc: 'ক্লাউড ব্যাকআপ ও সিঙ্ক (Cloud Backup & Sync)' },
    { key: 'Alt + 9', desc: 'এআই সহকারী ওপেন করুন (Open AI Assistant)' },
    { key: 'Alt + A', desc: 'নতুন হিসাব যোগ করুন (Add New Daily Account)' },
    { key: 'Alt + H', desc: 'হাজিরা প্রদান করুন (Mark Daily Attendance)' },
    { key: 'Alt + E', desc: 'নতুন কর্মচারী যুক্ত করুন (Add Employee)' },
    { key: 'Alt + S', desc: 'বেতন প্রদান ফর্ম খুলুন (Disburse Salary)' },
    { key: 'Alt + P', desc: 'পেজ বা শীট প্রিন্ট করুন (Print Current Sheet)' },
    { key: 'Alt + D', desc: 'ডার্ক মোড টগল করুন (Toggle Dark / Light Mode)' },
    { key: 'Alt + L', desc: 'ভাষা পরিবর্তন (Toggle Bengali / English)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t('shortcuts', language)}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'কীবোর্ড শর্টকাট দিয়ে দ্রুত কাজ করুন' : 'Speed up your workflow'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
              >
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                  {sc.desc}
                </span>
                <kbd className="px-2 py-1 text-[10px] font-mono font-bold bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs whitespace-nowrap">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Command className="w-4 h-4 shrink-0" />
            <span>
              {language === 'bn'
                ? 'টিপস: যেকোনো মেনু দ্রুত ব্রাউজ করতে কী-বোর্ডের Alt এর সাথে সংশ্লিষ্ট বাটন চাপুন।'
                : 'Tip: Hold Alt and press the corresponding key to quickly trigger views and actions.'}
            </span>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded-xl shadow-2xs"
          >
            {language === 'bn' ? 'ঠিক আছে' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
