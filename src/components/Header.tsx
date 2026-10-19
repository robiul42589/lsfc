import React from 'react';
import { 
  Building2, 
  Moon, 
  Sun, 
  Languages, 
  LogOut, 
  Keyboard, 
  Menu, 
  ShieldCheck, 
  HelpCircle,
  CloudCheck,
  Rocket
} from 'lucide-react';
import { Language, OrganizationProfile, UserSession } from '../types';
import { t } from '../utils/i18n';

interface HeaderProps {
  organization: OrganizationProfile;
  session: UserSession;
  language: Language;
  onToggleLanguage: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenShortcuts: () => void;
  onOpenOrgProfile: () => void;
  onOpenAIAssistant: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
  onSyncCloud: () => void;
  isSyncing: boolean;
  onOpenLaunchGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  organization,
  session,
  language,
  onToggleLanguage,
  darkMode,
  onToggleDarkMode,
  onOpenShortcuts,
  onOpenOrgProfile,
  onOpenAIAssistant,
  onLogout,
  onToggleMobileSidebar,
  onSyncCloud,
  isSyncing,
  onOpenLaunchGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 no-print">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left Side: Mobile toggle & Org Name badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={onOpenOrgProfile}
            className="cursor-pointer flex items-center gap-3 hover:opacity-90 transition-opacity"
            title="প্রতিষ্ঠান প্রোফাইল দেখুন"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 font-bold overflow-hidden border border-emerald-400/30">
              {organization.logoUrl ? (
                <img 
                  src={organization.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-1">
                {organization.name}
              </h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {organization.upazila}, {organization.district} • {organization.registrationNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Right Corner: Shortcuts, Language, Dark Mode, AI Help, Cloud Sync & User Profile / Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cloud Sync Quick Button */}
          <button
            type="button"
            onClick={onSyncCloud}
            disabled={isSyncing}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isSyncing 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300 animate-pulse' 
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
            }`}
            title="ক্লাউডে ডেটা সিঙ্ক করুন"
          >
            <CloudCheck className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'ক্লাউড সিঙ্ক'}</span>
          </button>

          {/* AI Helpdesk Shortcut */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-xs"
            title="ভূমি সেবা ও ডিজিটাল সেন্টার এআই সহকারী"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">এআই সহকারী</span>
          </button>

          {/* Launch & Edit Guide Button */}
          <button
            type="button"
            onClick={onOpenLaunchGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-xs"
            title="অ্যাপ লঞ্চ ও এডিটিং গাইডলাইন"
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">গাইড</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            title={`${t('shortcuts', language)} (Alt + ?)`}
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Multi-language Toggle */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="ভাষা পরিবর্তন (Language Toggle)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={darkMode ? t('lightMode', language) : t('darkMode', language)}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile Pill & Logout Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div 
              onClick={onOpenOrgProfile}
              className="cursor-pointer hidden xl:flex flex-col text-right"
            >
              
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                {session.role === 'admin' ? 'এডমিনিস্ট্রেটর' : 'অপারেটর'}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors"
              title={t('logout', language)}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout', language)}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
