import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Clock, 
  Calculator, 
  CreditCard, 
  BarChart3, 
  CloudCheck, 
  Bot, 
  X,
  BadgeCheck
} from 'lucide-react';
import { Language, OrganizationProfile } from '../types';
import { t } from '../utils/i18n';

export type NavTab = 
  | 'dashboard'
  | 'org-profile'
  | 'employees'
  | 'attendance'
  | 'daily-accounts'
  | 'salary'
  | 'reports'
  | 'cloud-sync'
  | 'ai-assistant';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  organization: OrganizationProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  organization,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; hotkey: string }[] = [
    {
      id: 'dashboard',
      label: t('navDashboard', language),
      icon: LayoutDashboard,
      hotkey: 'Alt + 1',
    },
    {
      id: 'org-profile',
      label: t('navOrgProfile', language),
      icon: Building2,
      hotkey: 'Alt + 2',
    },
    {
      id: 'employees',
      label: t('navEmployees', language),
      icon: Users,
      hotkey: 'Alt + 3',
    },
    {
      id: 'attendance',
      label: t('navAttendance', language),
      icon: Clock,
      hotkey: 'Alt + 4',
    },
    {
      id: 'daily-accounts',
      label: t('navDailyAccounts', language),
      icon: Calculator,
      hotkey: 'Alt + 5',
    },
    {
      id: 'salary',
      label: t('navSalary', language),
      icon: CreditCard,
      hotkey: 'Alt + 6',
    },
    {
      id: 'reports',
      label: t('navReports', language),
      icon: BarChart3,
      hotkey: 'Alt + 7',
    },
    {
      id: 'cloud-sync',
      label: t('navCloudSync', language),
      icon: CloudCheck,
      hotkey: 'Alt + 8',
    },
    {
      id: 'ai-assistant',
      label: t('navAIAssistant', language),
      icon: Bot,
      badge: 'Gemini',
      hotkey: 'Alt + 9',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-20 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } no-print`}
      >
        {/* Top: Brand info */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/30">
                ভূমি
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {language === 'bn' ? 'ভূমি সেবা কেন্দ্র' : 'Land Services Center'}
                </h2>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {organization.upazila}, {organization.district}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu List */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === 'bn' ? 'প্রধান মেন্যু' : 'MAIN MENU'}
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <span className={`text-[10px] hidden group-hover:inline-block ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      {item.hotkey}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Institutional Seal / Info Badge */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-start gap-2.5">
            <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                ডিজিটাল সেন্টার রেজিস্টার্ড
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                উপজেলা প্রশাসন ও এটুআই সম্বলিত
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
