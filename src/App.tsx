/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppStateData, 
  UserSession, 
  Language, 
  DailyAccount, 
  Employee, 
  AttendanceRecord, 
  LeaveRecord, 
  SalaryRecord, 
  NotificationItem, 
  OrganizationProfile 
} from './types';
import { 
  loadAppData, 
  saveAppData, 
  loadUserSession, 
  saveUserSession, 
  clearUserSession, 
  syncWithCloudServer 
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { ShortcutModal } from './components/ShortcutModal';
import { AIChatModal } from './components/AIChatModal';
import { LaunchAndEditGuideModal } from './components/LaunchAndEditGuideModal';
import { DashboardView } from './components/DashboardView';
import { OrganizationProfileView } from './components/OrganizationProfileView';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { DigitalAttendanceView } from './components/DigitalAttendanceView';
import { DailyAccountsView } from './components/DailyAccountsView';
import { SalaryManagementView } from './components/SalaryManagementView';
import { ReportsView } from './components/ReportsView';
import { DataBackupView } from './components/DataBackupView';
import { Bot, HelpCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppStateData>(loadAppData);
  const [session, setSession] = useState<UserSession>(loadUserSession);
  const [language, setLanguage] = useState<Language>('bn');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isLaunchGuideOpen, setIsLaunchGuideOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Quick Action Modal flags
  const [openAddAccountInitially, setOpenAddAccountInitially] = useState(false);
  const [openDisburseSalaryInitially, setOpenDisburseSalaryInitially] = useState(false);

  // Save changes to localStorage whenever data changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Save session whenever it changes
  useEffect(() => {
    saveUserSession(session);
  }, [session]);

  // Apply dark mode class to root html element and body
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handlers for AppState
  const handleUpdateOrganization = (updated: OrganizationProfile) => {
    setData((prev) => ({ ...prev, organization: updated }));
  };

  const handleAddEmployee = (emp: Employee) => {
    setData((prev) => ({
      ...prev,
      employees: [emp, ...prev.employees],
    }));
  };

  const handleUpdateEmployee = (emp: Employee) => {
    setData((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => (e.id === emp.id ? emp : e)),
    }));
  };

  const handleDismissEmployee = (id: string, reason: string, note: string) => {
    setData((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: 'dismissed',
            dismissalDate: new Date().toISOString().split('T')[0],
            dismissalReason: reason,
            dismissalNote: note,
          };
        }
        return e;
      }),
    }));
  };

  const handleReactivateEmployee = (id: string) => {
    setData((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: 'active',
            dismissalDate: undefined,
            dismissalReason: undefined,
            dismissalNote: undefined,
          };
        }
        return e;
      }),
    }));
  };

  const handleMarkAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...rec,
      id: `att-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      attendance: [newRecord, ...prev.attendance],
    }));
  };

  const handleAddLeave = (leave: Omit<LeaveRecord, 'id' | 'appliedDate'>) => {
    const newLeave: LeaveRecord = {
      ...leave,
      id: `lev-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setData((prev) => ({
      ...prev,
      leaves: [newLeave, ...prev.leaves],
    }));
  };

  const handleUpdateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected') => {
    setData((prev) => ({
      ...prev,
      leaves: prev.leaves.map((l) => (l.id === leaveId ? { ...l, status } : l)),
    }));
  };

  const handleAddAccount = (acc: DailyAccount) => {
    setData((prev) => ({
      ...prev,
      dailyAccounts: [acc, ...prev.dailyAccounts.filter((a) => a.date !== acc.date)],
    }));
  };

  const handleUpdateAccount = (acc: DailyAccount) => {
    setData((prev) => ({
      ...prev,
      dailyAccounts: prev.dailyAccounts.map((a) => (a.id === acc.id ? acc : a)),
    }));
  };

  const handleDeleteAccount = (id: string) => {
    setData((prev) => ({
      ...prev,
      dailyAccounts: prev.dailyAccounts.filter((a) => a.id !== id),
    }));
  };

  const handleDisburseSalary = (record: SalaryRecord) => {
    setData((prev) => ({
      ...prev,
      salaryRecords: [record, ...prev.salaryRecords],
    }));
  };

  const handleDeleteSalaryRecord = (id: string) => {
    setData((prev) => ({
      ...prev,
      salaryRecords: prev.salaryRecords.filter((s) => s.id !== id),
    }));
  };

  const handleAddNotification = (notif: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
    };
    setData((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  const handleDeleteNotification = (id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  const handleRestoreData = (restored: AppStateData) => {
    setData(restored);
  };

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    const result = await syncWithCloudServer(data);
    setIsSyncing(false);
    if (result.success) {
      alert('ক্লাউড সিঙ্ক সফলভাবে সম্পন্ন হয়েছে!');
    } else {
      alert('ক্লাউড সিঙ্ক ত্রুটি: ' + result.message);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setSession({
      isLoggedIn: false,
      userId: '',
      userName: '',
      role: 'operator',
    });
  };

  // Keyboard Shortcuts Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // If modal is active or typing in input/textarea, ignore alt key actions if not intended
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setCurrentTab('dashboard');
        } else if (e.key === '2') {
          e.preventDefault();
          setCurrentTab('org-profile');
        } else if (e.key === '3') {
          e.preventDefault();
          setCurrentTab('employees');
        } else if (e.key === '4') {
          e.preventDefault();
          setCurrentTab('attendance');
        } else if (e.key === '5') {
          e.preventDefault();
          setCurrentTab('daily-accounts');
        } else if (e.key === '6') {
          e.preventDefault();
          setCurrentTab('salary');
        } else if (e.key === '7') {
          e.preventDefault();
          setCurrentTab('reports');
        } else if (e.key === '8') {
          e.preventDefault();
          setCurrentTab('cloud-sync');
        } else if (e.key === '9') {
          e.preventDefault();
          setIsAIChatOpen(true);
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setCurrentTab('daily-accounts');
          setOpenAddAccountInitially(true);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setCurrentTab('attendance');
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setCurrentTab('employees');
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setCurrentTab('salary');
          setOpenDisburseSalaryInitially(true);
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          setDarkMode((prev) => !prev);
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          window.print();
        } else if (e.key === '?' || e.key === '/') {
          e.preventDefault();
          setIsShortcutsOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsAIChatOpen(false);
        setIsMobileSidebarOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Login Screen Modal if not logged in */}
      <LoginModal
        isOpen={!session.isLoggedIn}
        onLoginSuccess={(newSession) => setSession(newSession)}
        language={language}
        organization={data.organization}
      />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'ai-assistant') {
              setIsAIChatOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          language={language}
          organization={data.organization}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <Header
            organization={data.organization}
            session={session}
            language={language}
            onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenOrgProfile={() => setCurrentTab('org-profile')}
            onOpenAIAssistant={() => setIsAIChatOpen(true)}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onSyncCloud={handleSyncCloud}
            isSyncing={isSyncing}
            onOpenLaunchGuide={() => setIsLaunchGuideOpen(true)}
          />

          {/* Main Body per Tab */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                data={data}
                language={language}
                onNavigate={(tab) => setCurrentTab(tab)}
                onOpenAddAccount={() => {
                  setCurrentTab('daily-accounts');
                  setOpenAddAccountInitially(true);
                }}
                onOpenMarkAttendance={() => {
                  setCurrentTab('attendance');
                }}
                onOpenAddEmployee={() => {
                  setCurrentTab('employees');
                }}
                onOpenDisburseSalary={() => {
                  setCurrentTab('salary');
                  setOpenDisburseSalaryInitially(true);
                }}
                onAddNotification={handleAddNotification}
                onDeleteNotification={handleDeleteNotification}
              />
            )}

            {currentTab === 'org-profile' && (
              <OrganizationProfileView
                organization={data.organization}
                onUpdateOrganization={handleUpdateOrganization}
                language={language}
              />
            )}

            {currentTab === 'employees' && (
              <EmployeeManagementView
                employees={data.employees}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDismissEmployee={handleDismissEmployee}
                onReactivateEmployee={handleReactivateEmployee}
                language={language}
              />
            )}

            {currentTab === 'attendance' && (
              <DigitalAttendanceView
                employees={data.employees}
                attendance={data.attendance}
                leaves={data.leaves}
                onMarkAttendance={handleMarkAttendance}
                onAddLeave={handleAddLeave}
                onUpdateLeaveStatus={handleUpdateLeaveStatus}
                language={language}
              />
            )}

            {currentTab === 'daily-accounts' && (
              <DailyAccountsView
                dailyAccounts={data.dailyAccounts}
                onAddAccount={handleAddAccount}
                onUpdateAccount={handleUpdateAccount}
                onDeleteAccount={handleDeleteAccount}
                language={language}
                isAddModalOpenInitially={openAddAccountInitially}
                onCloseAddModalInitially={() => setOpenAddAccountInitially(false)}
              />
            )}

            {currentTab === 'salary' && (
              <SalaryManagementView
                employees={data.employees}
                salaryRecords={data.salaryRecords}
                organization={data.organization}
                onDisburseSalary={handleDisburseSalary}
                onDeleteSalaryRecord={handleDeleteSalaryRecord}
                language={language}
                isDisburseModalOpenInitially={openDisburseSalaryInitially}
                onCloseDisburseModalInitially={() => setOpenDisburseSalaryInitially(false)}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView data={data} language={language} />
            )}

            {currentTab === 'cloud-sync' && (
              <DataBackupView
                data={data}
                onRestoreData={handleRestoreData}
                language={language}
              />
            )}
          </main>
        </div>
      </div>

      {/* Floating AI Helpdesk trigger button at bottom right */}
      <button
        type="button"
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-600/35 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs no-print border border-emerald-300/40"
        title="ভূমি সেবা ও ডিজিটাল সেন্টার এআই সহকারী (Alt + 9)"
      >
        <Bot className="w-5 h-5 text-white" />
        <span className="hidden sm:inline">এআই সহকারী</span>
      </button>

      {/* Keyboard Shortcuts Cheat-sheet Modal */}
      <ShortcutModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        language={language}
      />

      {/* AI Helpdesk Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        language={language}
      />

      {/* Launch & Edit Guide Modal */}
      <LaunchAndEditGuideModal
        isOpen={isLaunchGuideOpen}
        onClose={() => setIsLaunchGuideOpen(false)}
        language={language}
      />
    </div>
  );
}
