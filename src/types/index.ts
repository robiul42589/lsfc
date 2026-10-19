export type Language = 'bn' | 'en';

export interface UserSession {
  isLoggedIn: boolean;
  userId: string;
  userName: string;
  role: 'admin' | 'operator';
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  fileData?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
}

export interface OrganizationProfile {
  name: string;
  shortName: string;
  centerType: string;
  upazila: string;
  district: string;
  division: string;
  address: string;
  establishedYear: string;
  registrationNumber: string;
  phone: string;
  email: string;
  website: string;
  inChargeName: string;
  inChargeDesignation: string;
  inChargePhone: string;
  logoUrl: string;
  documents: DocumentItem[];
  about: string;
  citizenCharter: string[];
}

export interface EducationInfo {
  id: string;
  degree: string;
  institute: string;
  passingYear: string;
  result: string;
}

export interface TrainingInfo {
  id: string;
  title: string;
  institute: string;
  duration: string;
  completionYear: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  nid: string;
  dateOfBirth: string;
  bloodGroup: string;
  joiningDate: string;
  baseSalary: number;
  status: 'active' | 'dismissed';
  photoUrl: string;
  signatureUrl: string;
  // Parent information
  fatherName: string;
  motherName: string;
  emergencyContact: string;
  // Family information
  maritalStatus: 'unmarried' | 'married' | 'divorced' | 'other';
  spouseName?: string;
  childrenCount?: number;
  childrenDetails?: string;
  // Qualifications
  educationList: EducationInfo[];
  trainingList: TrainingInfo[];
  // Dismissal info if applicable
  dismissalDate?: string;
  dismissalReason?: string;
  dismissalNote?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  inTime: string;
  outTime: string;
  status: 'present' | 'late' | 'half_day' | 'absent' | 'leave';
  remarks?: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'casual' | 'medical' | 'maternity' | 'earned' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
}

export interface DailyIncome {
  khariz: number;      // খারিজ
  chobi: number;       // ছবি
  photocopy: number;   // ফটোকপি
  internet: number;    // ইন্টারনেট
  others: number;      // অন্যান্য বাবদ আয়
  total: number;       // মোট আয়
  remarks?: string;
}

export interface DailyExpense {
  kagoj: number;         // কাগজ
  hardware: number;      // হার্ডওয়্যার
  dps: number;           // ডিপিএস
  dailyDeposit: number;  // প্রতিদিনের জমা
  advanceSalary: number; // অগ্রীম স্যালারী
  others: number;        // অন্যান্য বাবদ ব্যয়
  total: number;         // মোট ব্যয়
  remarks?: string;
}

export interface DailyAccount {
  id: string;
  year: number;
  month: number; // 1-12
  date: string;  // YYYY-MM-DD
  income: DailyIncome;
  expense: DailyExpense;
  remainingBalance: number; // অবশিষ্ট ফলাফল = মোট আয় - মোট ব্যয়
  createdAt: string;
  updatedAt?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDesignation: string;
  year: number;
  month: number; // 1-12
  earnings: {
    basic: number;            // মূল বেতন
    medical: number;          // চিকিৎসা ভাতা
    tiffin: number;           // টিফিন ভাতা
    transport: number;        // যাতায়াত ভাতা
    specialAllowance: number; // বিশেষ সুবিধা
    totalEarnings: number;    // মোট আয়
  };
  deductions: {
    advance: number;          // অগ্রীম
    revenueTax: number;       // রাজস্ব
    welfareFund: number;      // কল্যান
    deposit: number;          // জমা
    totalDeductions: number;  // মোট কর্তন
  };
  netPayable: number;         // নীট প্রাপ্য = মোট আয় - মোট কর্তন
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank' | 'bKash' | 'Nagad';
  paymentStatus: 'Paid' | 'Pending';
  remarks?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'warning' | 'success';
  date: string;
  isRead: boolean;
}

export interface AppStateData {
  organization: OrganizationProfile;
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRecord[];
  dailyAccounts: DailyAccount[];
  salaryRecords: SalaryRecord[];
  notifications: NotificationItem[];
  lastBackupDate?: string;
  version: number;
}
