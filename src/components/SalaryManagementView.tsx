import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  PlusCircle, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  FileText, 
  Download, 
  X, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Building2,
  DollarSign
} from 'lucide-react';
import { Employee, SalaryRecord, OrganizationProfile, Language } from '../types';
import { t, formatNumber, getMonthName } from '../utils/i18n';

interface SalaryManagementViewProps {
  employees: Employee[];
  salaryRecords: SalaryRecord[];
  organization: OrganizationProfile;
  onDisburseSalary: (record: SalaryRecord) => void;
  onDeleteSalaryRecord: (id: string) => void;
  language: Language;
  isDisburseModalOpenInitially?: boolean;
  onCloseDisburseModalInitially?: () => void;
}

export const SalaryManagementView: React.FC<SalaryManagementViewProps> = ({
  employees,
  salaryRecords,
  organization,
  onDisburseSalary,
  onDeleteSalaryRecord,
  language,
  isDisburseModalOpenInitially = false,
  onCloseDisburseModalInitially,
}) => {
  const currentDate = new Date();
  const [isModalOpen, setIsModalOpen] = useState(isDisburseModalOpenInitially);
  const [activePaySlip, setActivePaySlip] = useState<SalaryRecord | null>(null);

  // Form states
  const activeEmployees = employees.filter((e) => e.status === 'active');
  const [selectedEmpId, setSelectedEmpId] = useState(activeEmployees[0]?.id || '');
  const [formYear, setFormYear] = useState<number>(currentDate.getFullYear());
  const [formMonth, setFormMonth] = useState<number>(currentDate.getMonth() + 1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'bKash' | 'Nagad'>('Cash');
  const [remarks, setRemarks] = useState('');

  // Form Tab: Earnings vs Deductions
  const [formSubTab, setFormSubTab] = useState<'earnings' | 'deductions'>('earnings');

  // Earnings Fields
  const [basic, setBasic] = useState<number>(activeEmployees[0]?.baseSalary || 15000);
  const [medical, setMedical] = useState<number>(1500);
  const [tiffin, setTiffin] = useState<number>(1000);
  const [transport, setTransport] = useState<number>(1000);
  const [specialAllowance, setSpecialAllowance] = useState<number>(500);

  // Deductions Fields
  const [advance, setAdvance] = useState<number>(0);
  const [revenueTax, setRevenueTax] = useState<number>(0);
  const [welfareFund, setWelfareFund] = useState<number>(200);
  const [deposit, setDeposit] = useState<number>(500);

  // When selected employee changes, update basic salary
  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setBasic(emp.baseSalary || 15000);
    }
  };

  // Automated Real-time Calculations
  const calculatedTotalEarnings = useMemo(() => {
    return (
      Number(basic || 0) +
      Number(medical || 0) +
      Number(tiffin || 0) +
      Number(transport || 0) +
      Number(specialAllowance || 0)
    );
  }, [basic, medical, tiffin, transport, specialAllowance]);

  const calculatedTotalDeductions = useMemo(() => {
    return (
      Number(advance || 0) +
      Number(revenueTax || 0) +
      Number(welfareFund || 0) +
      Number(deposit || 0)
    );
  }, [advance, revenueTax, welfareFund, deposit]);

  const calculatedNetPayable = useMemo(() => {
    return calculatedTotalEarnings - calculatedTotalDeductions;
  }, [calculatedTotalEarnings, calculatedTotalDeductions]);

  const handleSubmitSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    const newSalary: SalaryRecord = {
      id: `sal-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeDesignation: emp.designation,
      year: formYear,
      month: formMonth,
      earnings: {
        basic: Number(basic || 0),
        medical: Number(medical || 0),
        tiffin: Number(tiffin || 0),
        transport: Number(transport || 0),
        specialAllowance: Number(specialAllowance || 0),
        totalEarnings: calculatedTotalEarnings,
      },
      deductions: {
        advance: Number(advance || 0),
        revenueTax: Number(revenueTax || 0),
        welfareFund: Number(welfareFund || 0),
        deposit: Number(deposit || 0),
        totalDeductions: calculatedTotalDeductions,
      },
      netPayable: calculatedNetPayable,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      paymentStatus: 'Paid',
      remarks: remarks.trim() || undefined,
    };

    onDisburseSalary(newSalary);
    setIsModalOpen(false);
    if (onCloseDisburseModalInitially) onCloseDisburseModalInitially();

    // Automatically open the generated Pay-Slip immediately!
    setActivePaySlip(newSalary);
  };

  const handlePrintPaySlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4" />
              <span>বেতন ও পেরোল ম্যানেজমেন্ট</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('salarySheet', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              কর্মচারীদের মূল বেতন, ভাতা, কর্তন ও নীট প্রদেয় হিসাব এবং স্বয়ংক্রিয় পে-স্লিপ প্রিন্ট
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('disburseSalary', language)}</span>
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              সর্বশেষ প্রদেয় নীট বেতন
            </span>
            <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-2">
              ৳{formatNumber(salaryRecords.reduce((sum, s) => sum + s.netPayable, 0), language)}
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              মোট {salaryRecords.length} টি বেতন স্লিপ ইস্যু করা হয়েছে
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
              মোট কল্যাণ ও ডিপিএস জমা
            </span>
            <div className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-2">
              ৳{formatNumber(salaryRecords.reduce((sum, s) => sum + s.deductions.deposit + s.deductions.welfareFund, 0), language)}
            </div>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">
              সংরক্ষিত প্রাতিষ্ঠানিক তহবিল
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
              সক্রিয় কর্মকর্তা-কর্মচারী
            </span>
            <div className="text-2xl font-black text-teal-900 dark:text-teal-100 mt-2">
              {formatNumber(activeEmployees.length, language)} <span className="text-xs font-normal">জন</span>
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">
              ভূমি সেবা কেন্দ্র ও ডিজিটাল সেন্টার, নন্দীগ্রাম
            </p>
          </div>
        </div>
      </div>

      {/* Salary Records Ledger */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 no-print">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-200 dark:border-slate-800">
          প্রদত্ত বেতন ও পে-স্লিপ তালিকা
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-3">কর্মচারীর নাম ও পদবী</th>
                <th className="py-3 px-3">মাস ও বছর</th>
                <th className="py-3 px-3 text-right">মূল বেতন</th>
                <th className="py-3 px-3 text-right">মোট আয় (Gross)</th>
                <th className="py-3 px-3 text-right">মোট কর্তন</th>
                <th className="py-3 px-3 text-right">নীট প্রাপ্য</th>
                <th className="py-3 px-3">পদ্ধতি</th>
                <th className="py-3 px-3 text-center">পে-স্লিপ</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {salaryRecords.map((sal) => (
                <tr key={sal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-100">
                      {sal.employeeName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {sal.employeeDesignation}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {getMonthName(sal.month, language)} {formatNumber(sal.year, language)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium">
                    ৳{formatNumber(sal.earnings.basic, language)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                    ৳{formatNumber(sal.earnings.totalEarnings, language)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-600 font-bold">
                    ৳{formatNumber(sal.deductions.totalDeductions, language)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-blue-700 dark:text-blue-400 font-black">
                    ৳{formatNumber(sal.netPayable, language)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sal.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => setActivePaySlip(sal)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>পে-স্লিপ দেখুন</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('আপনি কি এই বেতনের রেকর্ডটি মুছে ফেলতে চান?')) {
                          onDeleteSalaryRecord(sal.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Salary Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto no-print">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-emerald-200" />
                <h3 className="text-base font-bold">
                  {t('disburseSalary', language)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseDisburseModalInitially) onCloseDisburseModalInitially();
                }}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSalary} className="p-6 space-y-5 text-xs">
              {/* Select Employee, Month, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কর্মচারীর নাম *
                  </label>
                  <select
                    required
                    value={selectedEmpId}
                    onChange={(e) => handleSelectEmployee(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
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
                    মাস নির্বাচন *
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
                    বছর *
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>
              </div>

              {/* Earnings vs Deductions Sub-Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormSubTab('earnings')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    formSubTab === 'earnings'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{t('earningsTab', language)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormSubTab('deductions')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    formSubTab === 'deductions'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>{t('deductionsTab', language)}</span>
                </button>
              </div>

              {/* Earnings Tab Fields */}
              {formSubTab === 'earnings' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('basicPay', language)} (টাকা) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={basic}
                      onChange={(e) => setBasic(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('medicalAllowance', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={medical}
                      onChange={(e) => setMedical(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('tiffinAllowance', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tiffin}
                      onChange={(e) => setTiffin(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('transportAllowance', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={transport}
                      onChange={(e) => setTransport(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('specialAllowance', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={specialAllowance}
                      onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Deductions Tab Fields */}
              {formSubTab === 'deductions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('advanceDeduction', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={advance}
                      onChange={(e) => setAdvance(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('revenueTax', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={revenueTax}
                      onChange={(e) => setRevenueTax(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('welfareFund', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={welfareFund}
                      onChange={(e) => setWelfareFund(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('depositFund', language)} (টাকা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পরিশোধের মাধ্যম *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold"
                  >
                    <option value="Cash">নগদ প্রদান (Cash)</option>
                    <option value="Bank">ব্যাংক ট্রান্সফার (Bank)</option>
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মন্তব্য (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="যেমন: নিয়মিত মাসিক বেতন"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Automated Total Summary Boxes */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-700">
                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                    {t('totalEarnings', language)} (মোট আয়)
                  </span>
                  <div className="text-lg font-black text-emerald-400 mt-1">
                    ৳{formatNumber(calculatedTotalEarnings, language)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                    {t('totalDeductions', language)} (মোট কর্তন)
                  </span>
                  <div className="text-lg font-black text-rose-400 mt-1">
                    ৳{formatNumber(calculatedTotalDeductions, language)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    {t('netPayable', language)} (নীট প্রাপ্য)
                  </span>
                  <div className="text-lg font-black text-blue-300 mt-1">
                    ৳{formatNumber(calculatedNetPayable, language)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseDisburseModalInitially) onCloseDisburseModalInitially();
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>বেতন প্রদান ও পে-স্লিপ তৈরি করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official System-Generated Pay Slip Modal (স্বয়ংক্রিয় পে-স্লিপ ও প্রিন্ট) */}
      {activePaySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden print-card">
            {/* Top Modal Controls (Hidden in print) */}
            <div className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                স্বয়ংক্রিয় অফিসিয়াল পে-স্লিপ প্রিভিউ
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPaySlip}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>পে-স্লিপ প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaySlip(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Official Pay Slip Template */}
            <div className="p-8 sm:p-10 space-y-6 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
              {/* Header with Organization Seal */}
              <div className="text-center border-b-2 border-emerald-600 pb-5">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-2">
                  ভূমি
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {organization.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {organization.address} • ফোন: {organization.phone}
                </p>
                <div className="inline-block mt-3 px-4 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded-full text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  মাসিক বেতন বিবরণী ও পে-স্লিপ (PAY SLIP)
                </div>
              </div>

              {/* Employee & Pay Period Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <p><strong>কর্মচারীর নাম:</strong> {activePaySlip.employeeName}</p>
                  <p><strong>পদবী:</strong> {activePaySlip.employeeDesignation}</p>
                  <p><strong>পরিশোধের মাধ্যম:</strong> {activePaySlip.paymentMethod}</p>
                </div>
                <div className="space-y-1 text-right sm:text-left">
                  <p><strong>বেতনের মাস:</strong> {getMonthName(activePaySlip.month, 'bn')} {formatNumber(activePaySlip.year, 'bn')}</p>
                  <p><strong>ইস্যুর তারিখ:</strong> {activePaySlip.paymentDate}</p>
                  <p><strong>স্ট্যাটাস:</strong> <span className="text-emerald-600 font-bold">পরিশোধিত (Paid)</span></p>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Earnings */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 font-bold text-emerald-800 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800">
                    আয়ের খাতসমূহ (Earnings)
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">মূল বেতন (Basic Pay)</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.earnings.basic, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">চিকিৎসা ভাতা</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.earnings.medical, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">টিফিন ভাতা</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.earnings.tiffin, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">যাতায়াত ভাতা</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.earnings.transport, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">বিশেষ সুবিধা</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.earnings.specialAllowance, 'bn')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-emerald-600">
                      <span>মোট আয় (Gross)</span>
                      <span className="font-mono">৳{formatNumber(activePaySlip.earnings.totalEarnings, 'bn')}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="bg-rose-50 dark:bg-rose-950/60 p-2.5 font-bold text-rose-800 dark:text-rose-300 border-b border-rose-200 dark:border-rose-800">
                    কর্তনের খাতসমূহ (Deductions)
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">অগ্রীম স্যালারী কর্তন</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.deductions.advance, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">রাজস্ব কর</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.deductions.revenueTax, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">কল্যান তহবিল</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.deductions.welfareFund, 'bn')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ডিপিএস / জমা</span>
                      <span className="font-bold font-mono">৳{formatNumber(activePaySlip.deductions.deposit, 'bn')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-rose-600">
                      <span>মোট কর্তন</span>
                      <span className="font-mono">৳{formatNumber(activePaySlip.deductions.totalDeductions, 'bn')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payable Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between font-black text-sm">
                <span>সর্বমোট নীট প্রাপ্য (Net Payable):</span>
                <span className="text-emerald-400 text-lg font-mono">
                  ৳{formatNumber(activePaySlip.netPayable, 'bn')}
                </span>
              </div>

              {/* Signature Blocks */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="w-36 mx-auto border-t border-slate-400 pt-1 font-bold">
                    কর্মচারীর স্বাক্ষর
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">টাকা বুঝিয়া পাইলাম</p>
                </div>
                <div>
                  <div className="w-36 mx-auto border-t border-slate-400 pt-1 font-bold">
                    পরিচালক / উদ্যোক্তা
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{organization.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
