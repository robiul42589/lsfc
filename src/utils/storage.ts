import { AppStateData, UserSession } from '../types';
import { initialAppData } from '../data/initialData';

const STORAGE_KEY = 'bhumi_seba_organizer_data_v1';
const SESSION_KEY = 'bhumi_seba_organizer_session_v1';

export function loadAppData(): AppStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppData(initialAppData);
      return initialAppData;
    }
    const parsed = JSON.parse(raw);
    return {
      ...initialAppData,
      ...parsed,
      organization: { ...initialAppData.organization, ...(parsed.organization || {}) },
      employees: parsed.employees || initialAppData.employees,
      attendance: parsed.attendance || initialAppData.attendance,
      leaves: parsed.leaves || initialAppData.leaves,
      dailyAccounts: parsed.dailyAccounts || initialAppData.dailyAccounts,
      salaryRecords: parsed.salaryRecords || initialAppData.salaryRecords,
      notifications: parsed.notifications || initialAppData.notifications,
    };
  } catch (e) {
    console.error('Error loading app data from localStorage:', e);
    return initialAppData;
  }
}

export function saveAppData(data: AppStateData): void {
  try {
    const dataWithBackup = {
      ...data,
      lastBackupDate: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithBackup));
  } catch (e) {
    console.error('Error saving app data to localStorage:', e);
  }
}

export function loadUserSession(): UserSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading user session:', e);
  }
  return {
    isLoggedIn: true, // Default logged in for pleasant direct access or can be configured
    userId: 'admin',
    userName: 'মোঃ রবিউল ইসলাম (এডমিন)',
    role: 'admin',
  };
}

export function saveUserSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving user session:', e);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Error clearing user session:', e);
  }
}

// Download local data as JSON backup
export function exportDataAsJSON(data: AppStateData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `bhumi_seba_nandigram_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Sync with Backend Server Cloud Storage
export async function syncWithCloudServer(data: AppStateData): Promise<{ success: boolean; message: string; lastSyncedAt?: string }> {
  try {
    const res = await fetch('/api/sync/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      throw new Error(`Sync failed with status: ${res.status}`);
    }
    const result = await res.json();
    return {
      success: true,
      message: 'ক্লাউড সিঙ্ক সফলভাবে সম্পন্ন হয়েছে!',
      lastSyncedAt: result.lastSyncedAt,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'ক্লাউড সিঙ্ক ব্যর্থ হয়েছে।',
    };
  }
}

// Restore from Backend Server Cloud Storage
export async function restoreFromCloudServer(): Promise<{ success: boolean; data?: AppStateData; message: string }> {
  try {
    const res = await fetch('/api/sync/restore');
    if (!res.ok) {
      throw new Error('কোনো ক্লাউড ব্যাকআপ পাওয়া যায়নি');
    }
    const result = await res.json();
    if (result.success && result.data) {
      saveAppData(result.data);
      return { success: true, data: result.data, message: 'ক্লাউড ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!' };
    }
    return { success: false, message: 'ক্লাউড ব্যাকআপ পাওয়া যায়নি' };
  } catch (err: any) {
    return { success: false, message: err.message || 'রিস্টোর ব্যর্থ হয়েছে' };
  }
}
