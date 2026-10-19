import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  CalendarDays, 
  UserCheck, 
  AlertCircle, 
  PlusCircle, 
  UserX, 
  FileCheck, 
  Filter,
  Check,
  X,
  Clock4,
  Coffee
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveRecord, Language } from '../types';
import { t, formatNumber, getMonthName } from '../utils/i18n';

interface DigitalAttendanceViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onAddLeave: (leave: Omit<LeaveRecord, 'id' | 'appliedDate'>) => void;
  onUpdateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected') => void;
  language: Language;
}

export const DigitalAttendanceView: React.FC<DigitalAttendanceViewProps> = ({
  employees,
  attendance,
  leaves,
  onMarkAttendance,
  onAddLeave,
  onUpdateLeaveStatus,
  language,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'leaves'>('attendance');

  // Modals
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Mark Attendance Form state
  const [attEmployeeId, setAttEmployeeId] = useState(employees[0]?.id || '');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attInTime, setAttInTime] = useState('09:00 AM');
  const [attOutTime, setAttOutTime] = useState('05:00 PM');
  const [attStatus, setAttStatus] = useState<'present' | 'late' | 'half_day' | 'absent' | 'leave'>('present');
  const [attRemarks, setAttRemarks] = useState('');

  // Leave Form state
  const [leaveEmployeeId, setLeaveEmployeeId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'casual' | 'medical' | 'maternity' | 'earned' | 'other'>('casual');
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');

  // Calculate monthly stats per employee
  const activeEmployees = employees.filter((e) => e.status === 'active');

  const employeeStats = activeEmployees.map((emp) => {
    // filter attendance records for this employee in selected month & year
    const empAtt = attendance.filter((a) => {
      const parts = a.date.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return a.employeeId === emp.id && y === selectedYear && m === selectedMonth;
    });

    const presentDays = empAtt.filter((a) => a.status === 'present').length;
    const lateDays = empAtt.filter((a) => a.status === 'late').length;
    const halfDays = empAtt.filter((a) => a.status === 'half_day').length;

    // leaves for this employee in this month
    const empLeaves = leaves.filter((l) => {
      const startParts = l.startDate.split('-');
      const y = parseInt(startParts[0], 10);
      const m = parseInt(startParts[1], 10);
      return l.employeeId === emp.id && y === selectedYear && m === selectedMonth && l.status === 'approved';
    });

    const totalLeaveDays = empLeaves.reduce((acc, curr) => acc + curr.totalDays, 0);

    return {
      employee: emp,
      presentDays,
      lateDays,
      halfDays,
      leaveDays: totalLeaveDays,
      totalWorkingDays: presentDays + lateDays + totalLeaveDays,
    };
  });

  // Calculate overall summary metrics
  const totalPresentCount = employeeStats.reduce((sum, s) => sum + s.presentDays, 0);
  const totalLateCount = employeeStats.reduce((sum, s) => sum + s.lateDays, 0);
  const totalLeaveDaysCount = employeeStats.reduce((sum, s) => sum + s.leaveDays, 0);

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === attEmployeeId);
    if (!emp) return;

    onMarkAttendance({
      employeeId: emp.id,
      employeeName: emp.name,
      date: attDate,
      inTime: attInTime,
      outTime: attOutTime,
      status: attStatus,
      remarks: attRemarks.trim() || undefined,
    });

    setIsMarkModalOpen(false);
    setAttRemarks('');
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === leaveEmployeeId);
    if (!emp) return;

    // Calculate days between start and end
    const d1 = new Date(leaveStartDate);
    const d2 = new Date(leaveEndDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    onAddLeave({
      employeeId: emp.id,
      employeeName: emp.name,
      leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      totalDays,
      reason: leaveReason.trim() || 'ব্যক্তিগত ছুটি',
      status: 'approved', // auto approved by director / or pending
    });

    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>ডিজিটাল টাইম ও অ্যাটেনডেন্স সিস্টেম</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('monthlyAttendanceStats', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              কর্মচারীদের ইন-আউট টাইম ট্র্যাকিং, মাসিক উপস্থিতি ও ছুটির পরিসংখ্যান রিপোর্ট
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month & Year Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-2 py-1.5 text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {getMonthName(m, language)}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-2 py-1.5 text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value={2025}>২০২৫</option>
                <option value={2026}>২০২৬</option>
                <option value={2027}>২০২৭</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsMarkModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <Clock4 className="w-4 h-4" />
              <span>{t('markAttendance', language)}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-4 py-2.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              <span>{t('applyLeave', language)}</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              মোট উপস্থিতি (মাসিক)
            </span>
            <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-2">
              {formatNumber(totalPresentCount, language)} <span className="text-xs font-normal">দিন-হাজিরা</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              {getMonthName(selectedMonth, language)} মাসের রেকর্ড
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
              অনুমোদিত ছুটি
            </span>
            <div className="text-2xl font-black text-teal-900 dark:text-teal-100 mt-2">
              {formatNumber(totalLeaveDaysCount, language)} <span className="text-xs font-normal">দিন</span>
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">
              নৈমিত্তিক ও চিকিৎসা বাবদ ছুটি
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              দেরিতে আগমন (Late)
            </span>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-2">
              {formatNumber(totalLateCount, language)} <span className="text-xs font-normal">বার</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
              নির্ধারিত সময়ের পর আগমন
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
              সক্রিয় কর্মী
            </span>
            <div className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-2">
              {formatNumber(activeEmployees.length, language)} <span className="text-xs font-normal">জন</span>
            </div>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">
              ডিজিটাল সেন্টার নন্দীগ্রাম
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Staff Attendance Statistics vs Leave Records */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 justify-between items-center flex-wrap gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('attendance')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'attendance'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              কর্মচারীভিত্তিক উপস্থিতি পরিসংখ্যান
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('leaves')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'leaves'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ছুটির আবেদন ও রেকর্ড তালিকা ({leaves.length})
            </button>
          </div>
        </div>

        {activeSubTab === 'attendance' ? (
          /* Staff Monthly Attendance Breakdown Table */
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">কর্মচারীর নাম ও পদবী</th>
                  <th className="py-3 px-3 text-center">উপস্থিত দিন</th>
                  <th className="py-3 px-3 text-center">ছুটি কাটালো</th>
                  <th className="py-3 px-3 text-center">দেরিতে আগমন</th>
                  <th className="py-3 px-3 text-center">উপস্থিতি অনুপাত</th>
                  <th className="py-3 px-3 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employeeStats.map((st) => {
                  const totalDays = st.presentDays + st.leaveDays;
                  const presenceRate = totalDays > 0 ? Math.round((st.presentDays / totalDays) * 100) : 100;
                  return (
                    <tr key={st.employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-400">
                            {st.employee.photoUrl ? (
                              <img src={st.employee.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              st.employee.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100">
                              {st.employee.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {st.employee.designation} • {st.employee.employeeCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">
                        {formatNumber(st.presentDays, language)} দিন
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-teal-600">
                        {formatNumber(st.leaveDays, language)} দিন
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-600">
                        {formatNumber(st.lateDays, language)} বার
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${presenceRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                            {presenceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          নিয়মিত
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Leaves Management Table */
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">কর্মচারীর নাম</th>
                  <th className="py-3 px-3">ছুটির ধরন</th>
                  <th className="py-3 px-3">মেয়াদ (শুরু ও শেষ)</th>
                  <th className="py-3 px-3 text-center">মোট দিন</th>
                  <th className="py-3 px-3">ছুটির কারণ</th>
                  <th className="py-3 px-3 text-center">অবস্থা</th>
                  <th className="py-3 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                      {lv.employeeName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {lv.leaveType === 'casual'
                          ? 'নৈমিত্তিক (Casual)'
                          : lv.leaveType === 'medical'
                          ? 'চিকিৎসা (Medical)'
                          : lv.leaveType === 'maternity'
                          ? 'মাতৃত্বকালীন'
                          : 'অর্জিত ছুটি'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {lv.startDate} হতে {lv.endDate}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {formatNumber(lv.totalDays, language)} দিন
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                      {lv.reason}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lv.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : lv.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {lv.status === 'approved' ? 'অনুমোদিত' : lv.status === 'pending' ? 'অপেক্ষমান' : 'বাতিল'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {lv.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onUpdateLeaveStatus(lv.id, 'approved')}
                            className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                            title="অনুমোদন করুন"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateLeaveStatus(lv.id, 'rejected')}
                            className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                            title="বাতিল করুন"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal (হাজিরা প্রদান করুন) */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>{t('markAttendance', language)}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMarkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAttendance} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কর্মচারী নির্বাচন করুন *
                </label>
                <select
                  required
                  value={attEmployeeId}
                  onChange={(e) => setAttEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold"
                >
                  {activeEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  তারিখ *
                </label>
                <input
                  type="date"
                  required
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইন টাইম (প্রবেশ)
                  </label>
                  <input
                    type="text"
                    value={attInTime}
                    onChange={(e) => setAttInTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আউট টাইম (প্রস্থান)
                  </label>
                  <input
                    type="text"
                    value={attOutTime}
                    onChange={(e) => setAttOutTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  হাজিরার অবস্থা *
                </label>
                <select
                  value={attStatus}
                  onChange={(e) => setAttStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                >
                  <option value="present">উপস্থিত (Present)</option>
                  <option value="late">দেরিতে আগমন (Late)</option>
                  <option value="half_day">অর্ধদিবস (Half Day)</option>
                  <option value="absent">অনুপস্থিত (Absent)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মন্তব্য (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={attRemarks}
                  onChange={(e) => setAttRemarks(e.target.value)}
                  placeholder="যেমন: অন-টাইম বা জরুরি সেবা ডিউটি"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMarkModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>হাজিরা রেকর্ড সম্পন্ন করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Application Modal (ছুটির তথ্য যুক্ত করুন) */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-teal-600" />
                <span>{t('applyLeave', language)}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কর্মচারীর নাম *
                </label>
                <select
                  required
                  value={leaveEmployeeId}
                  onChange={(e) => setLeaveEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold"
                >
                  {activeEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছুটির ধরন *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                >
                  <option value="casual">{t('casualLeave', language)}</option>
                  <option value="medical">{t('medicalLeave', language)}</option>
                  <option value="maternity">{t('maternityLeave', language)}</option>
                  <option value="earned">{t('earnedLeave', language)}</option>
                  <option value="other">অন্যান্য জরুরি ছুটি</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শুরুর তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শেষ তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছুটির কারণ *
                </label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="ছুটি নেওয়ার সুনির্দিষ্ট কারণ লিখুন..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ছুটি মঞ্জুর ও সংরক্ষণ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
