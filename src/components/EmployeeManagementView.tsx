import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserX, 
  Phone, 
  Mail, 
  IdCard, 
  Calendar, 
  GraduationCap, 
  Award, 
  Heart, 
  Image as ImageIcon, 
  FileSignature, 
  CheckCircle2, 
  X, 
  AlertOctagon,
  Eye,
  Plus,
  Briefcase
} from 'lucide-react';
import { Employee, EducationInfo, TrainingInfo, Language } from '../types';
import { t, formatNumber } from '../utils/i18n';

interface EmployeeManagementViewProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDismissEmployee: (id: string, reason: string, note: string) => void;
  onReactivateEmployee: (id: string) => void;
  language: Language;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDismissEmployee,
  onReactivateEmployee,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'dismissed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [dismissingEmployee, setDismissingEmployee] = useState<Employee | null>(null);

  // Dismissal form state
  const [dismissReason, setDismissReason] = useState('');
  const [dismissNote, setDismissNote] = useState('');

  // New Employee Form State
  const initialFormState: Omit<Employee, 'id'> = {
    employeeCode: `EMP-00${employees.length + 1}`,
    name: '',
    designation: 'সহকারী কম্পিউটার অপারেটর',
    phone: '',
    email: '',
    nid: '',
    dateOfBirth: '1998-01-01',
    bloodGroup: 'B+',
    joiningDate: new Date().toISOString().split('T')[0],
    baseSalary: 15000,
    status: 'active',
    photoUrl: '',
    signatureUrl: '',
    fatherName: '',
    motherName: '',
    emergencyContact: '',
    maritalStatus: 'unmarried',
    spouseName: '',
    childrenCount: 0,
    childrenDetails: '',
    educationList: [
      { id: 'edu-new-1', degree: 'এইচ.এস.সি', institute: 'নন্দীগ্রাম মনসুর হোসেন ডিগ্রি কলেজ', passingYear: '2016', result: 'GPA 4.50' }
    ],
    trainingList: [
      { id: 'trn-new-1', title: 'বেসিক কম্পিউটার ও অফিস অ্যাপ্লিকেশন', institute: 'যুব উন্নয়ন অধিদপ্তর', duration: '৩ মাস', completionYear: '2018' }
    ],
  };

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(initialFormState);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesTab = emp.status === activeTab;
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery) ||
      emp.nid.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      ...initialFormState,
      employeeCode: `EMP-00${employees.length + 1}`,
    });
    setEditingEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData(emp);
    setIsAddModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, signatureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEducationRow = () => {
    const newEdu: EducationInfo = {
      id: `edu-${Date.now()}`,
      degree: '',
      institute: '',
      passingYear: '',
      result: '',
    };
    setFormData((prev) => ({
      ...prev,
      educationList: [...prev.educationList, newEdu],
    }));
  };

  const handleAddTrainingRow = () => {
    const newTrn: TrainingInfo = {
      id: `trn-${Date.now()}`,
      title: '',
      institute: '',
      duration: '',
      completionYear: '',
    };
    setFormData((prev) => ({
      ...prev,
      trainingList: [...prev.trainingList, newTrn],
    }));
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('কর্মচারীর নাম ও মোবাইল নম্বর পূরণ করা আবশ্যক!');
      return;
    }

    if (editingEmployee) {
      onUpdateEmployee({
        ...editingEmployee,
        ...formData,
      });
    } else {
      const newEmp: Employee = {
        ...formData,
        id: `emp-${Date.now()}`,
        status: 'active',
      };
      onAddEmployee(newEmp);
    }

    setIsAddModalOpen(false);
    setEditingEmployee(null);
  };

  const handleConfirmDismissal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dismissingEmployee) return;

    onDismissEmployee(
      dismissingEmployee.id,
      dismissReason || 'প্রশাসনিক সিদ্ধান্ত ও নিয়মভঙ্গ',
      dismissNote || 'নথিপত্র নিরীক্ষা সম্পন্ন।'
    );

    setDismissingEmployee(null);
    setDismissReason('');
    setDismissNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>মানবসম্পদ ও প্রশাসন</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {t('employeeDirectory', language)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ভূমি সেবা কেন্দ্র ও ডিজিটাল সেন্টারের সকল কর্মকর্তা-কর্মচারীর বিস্তারিত তথ্য ও নিয়োগ ডাটাবেজ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addNewEmployee', language)}</span>
            </button>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Active vs Dismissed Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('activeEmployees', language)}</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] rounded-full">
                {employees.filter((e) => e.status === 'active').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dismissed')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'dismissed'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>{t('dismissedEmployees', language)}</span>
              <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] rounded-full">
                {employees.filter((e) => e.status === 'dismissed').length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, পদবী বা মোবাইল দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            কোনো কর্মচারীর তথ্য খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center font-bold text-slate-400">
                      {emp.photoUrl ? (
                        <img
                          src={emp.photoUrl}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {emp.employeeCode}
                      </span>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
                        {emp.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {emp.designation}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      emp.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {emp.status === 'active' ? 'সক্রিয়' : 'বরখাস্ত'}
                  </span>
                </div>

                {/* Details snippet */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">NID: {emp.nid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>যোগদান: {emp.joiningDate}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span>মূল বেতন: ৳{formatNumber(emp.baseSalary, language)}</span>
                  </div>

                  {emp.status === 'dismissed' && emp.dismissalReason && (
                    <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-700 dark:text-rose-300">
                      <strong>বরখাস্তের কারণ:</strong> {emp.dismissalReason}
                      {emp.dismissalDate && <div className="text-[10px] mt-0.5">তারিখ: {emp.dismissalDate}</div>}
                    </div>
                  )}
                </div>
              </div>

                {/* Bottom Actions */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setViewingEmployee(emp)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>প্রোফাইল</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(emp)}
                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={t('editEmployee', language)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {emp.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => setDismissingEmployee(emp)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title={t('dismissEmployee', language)}
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReactivateEmployee(emp.id)}
                      className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      পুনর্বহাল
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Comprehensive Recruitment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingEmployee ? 'কর্মচারীর তথ্য আপডেট' : 'নতুন কর্মচারী নিয়োগ ও তথ্য নিবন্ধন'}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    বেসিক তথ্য, পরিবার, শিক্ষা, প্রশিক্ষণ ও ডকুমেন্ট এন্ট্রি
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto text-xs">
              {/* Photo & Signature Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>{t('photoUpload', language)}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 text-emerald-600" />
                    <span>{t('signatureUpload', language)}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.signatureUrl ? (
                        <img src={formData.signatureUrl} alt="Sign" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">স্বাক্ষর</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                </div>
              </div>

              {/* 1. Basic Information */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-emerald-600" />
                  <span>১. বেসিক তথ্য (Basic Information)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      কর্মচারীর নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      পদবী *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="যেমন: সহকারী কম্পিউটার অপারেটর"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="০১৭১১-XXXXXX"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      জাতীয় পরিচয়পত্র (NID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nid}
                      onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                      placeholder="১০/১৩/১৭ ডিজিটের এনআইডি"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      রক্তের গ্রুপ
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      যোগদানের তারিখ
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মূল বেতন (টাকা) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      placeholder="টাকার পরিমাণ"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      জন্ম তারিখ
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Parent & Emergency Contact */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>২. পিতা-মাতার তথ্য ও জরুরি যোগাযোগ</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      পিতার নাম
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      placeholder="পিতার নাম লিখুন"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মাতার নাম
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      placeholder="মাতার নাম লিখুন"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      জরুরি অভিভাবকের মোবাইল
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="জরুরি ফোন নম্বর"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Spouse & Children */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>৩. স্বামী/স্ত্রী ও সন্তানের তথ্য</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      বৈবাহিক অবস্থা
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                    >
                      <option value="unmarried">অবিবাহিত</option>
                      <option value="married">বিবাহিত</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>

                  {formData.maritalStatus === 'married' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          স্বামী / স্ত্রীর নাম
                        </label>
                        <input
                          type="text"
                          value={formData.spouseName || ''}
                          onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                          placeholder="নাম লিখুন"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          সন্তানের সংখ্যা
                        </label>
                        <input
                          type="number"
                          value={formData.childrenCount || 0}
                          onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          সন্তানদের নাম ও বয়স
                        </label>
                        <input
                          type="text"
                          value={formData.childrenDetails || ''}
                          onChange={(e) => setFormData({ ...formData, childrenDetails: e.target.value })}
                          placeholder="যেমন: পুত্র-রায়ান (৮ বছর)"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 4. Educational Qualifications */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>৪. শিক্ষাগত যোগ্যতার তথ্য</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEducationRow}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন ডিগ্রি যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {formData.educationList.map((edu, idx) => (
                    <div key={edu.id || idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...formData.educationList];
                          updated[idx].degree = e.target.value;
                          setFormData({ ...formData, educationList: updated });
                        }}
                        placeholder="ডিগ্রি (যেমন: এস.এস.সি)"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={edu.institute}
                        onChange={(e) => {
                          const updated = [...formData.educationList];
                          updated[idx].institute = e.target.value;
                          setFormData({ ...formData, educationList: updated });
                        }}
                        placeholder="প্রতিষ্ঠান বা বোর্ড"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={edu.passingYear}
                        onChange={(e) => {
                          const updated = [...formData.educationList];
                          updated[idx].passingYear = e.target.value;
                          setFormData({ ...formData, educationList: updated });
                        }}
                        placeholder="পাসের সন"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={edu.result}
                          onChange={(e) => {
                            const updated = [...formData.educationList];
                            updated[idx].result = e.target.value;
                            setFormData({ ...formData, educationList: updated });
                          }}
                          placeholder="ফলাফল (জিপিএ)"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                        {formData.educationList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.educationList.filter((_, i) => i !== idx);
                              setFormData({ ...formData, educationList: updated });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Training Details */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>৫. প্রশিক্ষণের সকল তথ্য</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddTrainingRow}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন প্রশিক্ষণ যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {formData.trainingList.map((trn, idx) => (
                    <div key={trn.id || idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <input
                        type="text"
                        value={trn.title}
                        onChange={(e) => {
                          const updated = [...formData.trainingList];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, trainingList: updated });
                        }}
                        placeholder="প্রশিক্ষণের বিষয়"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={trn.institute}
                        onChange={(e) => {
                          const updated = [...formData.trainingList];
                          updated[idx].institute = e.target.value;
                          setFormData({ ...formData, trainingList: updated });
                        }}
                        placeholder="প্রশিক্ষণ প্রতিষ্ঠান"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={trn.duration}
                        onChange={(e) => {
                          const updated = [...formData.trainingList];
                          updated[idx].duration = e.target.value;
                          setFormData({ ...formData, trainingList: updated });
                        }}
                        placeholder="মেয়াদ (যেমন: ৩ মাস)"
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={trn.completionYear}
                          onChange={(e) => {
                            const updated = [...formData.trainingList];
                            updated[idx].completionYear = e.target.value;
                            setFormData({ ...formData, trainingList: updated });
                          }}
                          placeholder="সমাপ্তির সন"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                        {formData.trainingList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.trainingList.filter((_, i) => i !== idx);
                              setFormData({ ...formData, trainingList: updated });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingEmployee ? 'তথ্য আপডেট করুন' : 'নিয়োগ নিশ্চিত ও সংরক্ষণ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dismissal Modal */}
      {dismissingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="w-6 h-6" />
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  কর্মচারী বরখাস্ত / অব্যাহতি
                </h3>
                <p className="text-[11px] text-slate-500">
                  {dismissingEmployee.name} ({dismissingEmployee.designation})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmDismissal} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বরখাস্তের কারণ *
                </label>
                <input
                  type="text"
                  required
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="যেমন: শৃঙ্খলা ভঙ্গ / নিয়ম না মেনে অনুপস্থিতি"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কর্তৃপক্ষের সিদ্ধান্ত ও নোট
                </label>
                <textarea
                  rows={3}
                  value={dismissNote}
                  onChange={(e) => setDismissNote(e.target.value)}
                  placeholder="অফিস আদেশ বা রেজুলেশন নোট..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDismissingEmployee(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/30"
                >
                  বরখাস্ত নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detailed Profile Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-400">
                  {viewingEmployee.photoUrl ? (
                    <img src={viewingEmployee.photoUrl} alt="Employee" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                    {viewingEmployee.employeeCode}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                    {viewingEmployee.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {viewingEmployee.designation} • মূল বেতন: ৳{formatNumber(viewingEmployee.baseSalary, language)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEmployee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">ব্যক্তিগত ও যোগাযোগ</span>
                <p><strong>মোবাইল:</strong> {viewingEmployee.phone}</p>
                <p><strong>ইমেইল:</strong> {viewingEmployee.email || 'তথ্য নেই'}</p>
                <p><strong>এনআইডি (NID):</strong> {viewingEmployee.nid}</p>
                <p><strong>রক্তের গ্রুপ:</strong> {viewingEmployee.bloodGroup}</p>
                <p><strong>জন্মতারিখ:</strong> {viewingEmployee.dateOfBirth}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">পরিবারের বিবরণ</span>
                <p><strong>পিতার নাম:</strong> {viewingEmployee.fatherName || 'তথ্য নেই'}</p>
                <p><strong>মাতার নাম:</strong> {viewingEmployee.motherName || 'তথ্য নেই'}</p>
                <p><strong>বৈবাহিক অবস্থা:</strong> {viewingEmployee.maritalStatus === 'married' ? 'বিবাহিত' : 'অবিবাহিত'}</p>
                {viewingEmployee.spouseName && <p><strong>স্ত্রী/স্বামী:</strong> {viewingEmployee.spouseName}</p>}
                {viewingEmployee.childrenDetails && <p><strong>সন্তান:</strong> {viewingEmployee.childrenDetails}</p>}
              </div>
            </div>

            {/* Education & Training in Modal */}
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  শিক্ষাগত যোগ্যতা
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingEmployee.educationList.map((edu, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{edu.degree}</div>
                      <div className="text-[11px] text-slate-500">{edu.institute} ({edu.passingYear}) • {edu.result}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  প্রশিক্ষণ বিবরণ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingEmployee.trainingList.map((trn, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{trn.title}</div>
                      <div className="text-[11px] text-slate-500">{trn.institute} • মেয়াদ: {trn.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
