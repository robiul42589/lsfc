import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  Edit3, 
  Upload, 
  FileCheck, 
  FileText, 
  Calendar, 
  BadgeCheck, 
  Trash2, 
  ExternalLink, 
  Save, 
  X, 
  Printer, 
  Download, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  FileSignature,
  QrCode
} from 'lucide-react';
import { OrganizationProfile, DocumentItem, Language } from '../types';
import { t } from '../utils/i18n';

interface OrganizationProfileViewProps {
  organization: OrganizationProfile;
  onUpdateOrganization: (updated: OrganizationProfile) => void;
  language: Language;
}

export const OrganizationProfileView: React.FC<OrganizationProfileViewProps> = ({
  organization,
  onUpdateOrganization,
  language,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OrganizationProfile>(organization);
  
  // Document upload state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('ট্রেড লাইসেন্স (Trade License)');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docFileData, setDocFileData] = useState<string>('');
  const [docFileSize, setDocFileSize] = useState<string>('');
  const [docMimeType, setDocMimeType] = useState<string>('');

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOrganization(formData);
    setIsEditing(false);
  };

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setDocMimeType(file.type);
      const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
      setDocFileSize(sizeKb);

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      type: docType,
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: docFile ? docFile.name : `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileData: docFileData || undefined,
      fileSize: docFileSize || '150 KB',
      mimeType: docMimeType || (docFile?.type.includes('image') ? 'image/png' : 'application/pdf'),
    };

    const updatedDocs = [newDoc, ...organization.documents];
    const updatedOrg = { ...organization, documents: updatedDocs };
    onUpdateOrganization(updatedOrg);
    setFormData(updatedOrg);

    // Reset doc form
    setDocTitle('');
    setDocFile(null);
    setDocFileData('');
    setDocFileSize('');
    setDocMimeType('');
    setIsUploadingDoc(false);
  };

  const handleDeleteDocument = (docId: string) => {
    if (!window.confirm('আপনি কি এই ডকুমেন্টটি মুছে ফেলতে নিশ্চিত?')) return;
    const updatedDocs = organization.documents.filter((d) => d.id !== docId);
    const updatedOrg = { ...organization, documents: updatedDocs };
    onUpdateOrganization(updatedOrg);
    setFormData(updatedOrg);
    if (viewingDoc?.id === docId) {
      setViewingDoc(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, logoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadDoc = (doc: DocumentItem) => {
    if (doc.fileData) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName || `${doc.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      // For generated certificate, trigger print
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-emerald-600/20 overflow-hidden border-2 border-emerald-400 shrink-0">
              {organization.logoUrl ? (
                <img
                  src={organization.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>{organization.centerType}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                {organization.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {organization.address}
                </span>
                <span>•</span>
                <span>রেজিস্ট্রেশন নং: <strong className="text-slate-700 dark:text-slate-300">{organization.registrationNumber}</strong></span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData(organization);
              setIsEditing(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start md:self-center"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t('editOrgInfo', language)}</span>
          </button>
        </div>

        {/* Institution Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">প্রতিষ্ঠানের ধরন:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {organization.centerType}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">উপজেলা ও জেলা:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {organization.upazila}, {organization.district} ({organization.division})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">প্রতিষ্ঠাকাল:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {organization.establishedYear} খ্রিষ্টাব্দ
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">পরিচালক / উদ্যোক্তা:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{organization.inChargeName} ({organization.inChargeDesignation})</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">হটলাইন / মোবাইল:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{organization.phone}</span>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">অফিসিয়াল ইমেইল:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>{organization.email}</span>
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            প্রতিষ্ঠান পরিচিতি ও উদ্দেশ্য
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {organization.about}
          </p>
        </div>
      </div>

      {/* Uploaded Documents & Citizen Charter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploaded Documents Management */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>প্রতিষ্ঠানের অফিসিয়াল ডকুমেন্টস ও লাইসেন্স</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                চুক্তিপত্র, ট্রেড লাইসেন্স ও অনুমোদনপত্র (পিডিএফ ও ছবি সহ)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadingDoc(true)}
              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ডকুমেন্ট যুক্ত করুন</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {organization.documents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                কোনো ডকুমেন্ট আপলোড করা নেই। "ডকুমেন্ট যুক্ত করুন" বাটনে ক্লিক করে ফাইল আপলোড করুন।
              </div>
            ) : (
              organization.documents.map((doc) => {
                const isImage = doc.mimeType?.includes('image') || doc.fileName?.match(/\.(jpeg|jpg|png|webp|gif)$/i);
                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
                    onClick={() => setViewingDoc(doc)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isImage 
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-200 dark:border-blue-800' 
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">{doc.type}</span>
                          <span>•</span>
                          <span>আপলোড: {doc.uploadDate}</span>
                          {doc.fileSize && (
                            <>
                              <span>•</span>
                              <span>{doc.fileSize}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setViewingDoc(doc)}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
                        title="ডকুমেন্ট দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>দেখুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Citizen Charter (সিটিজেন চার্টার) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('citizenCharter', language)}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              ভূমি সেবা কেন্দ্র ও ডিজিটাল সেন্টার হতে প্রদত্ত নিয়মিত সেবা তালিকা
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {organization.citizenCharter.map((item, index) => (
              <div
                key={index}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200"
              >
                <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {index + 1}
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL DOCUMENT PREVIEW & VIEWER MODAL (ডকুমেন্ট ভিউয়ার) */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden flex flex-col max-h-[92vh] print-card">
            {/* Modal Controls Header (Hidden in Print) */}
            <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {viewingDoc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ধরন: {viewingDoc.type} • ফাইল: {viewingDoc.fileName || 'ডকুমেন্ট ফাইল'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                  title="ডকুমেন্ট প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">প্রিন্ট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadDoc(viewingDoc)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  title="ফাইল ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ডাউনলোড</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50 dark:bg-slate-950/40">
              {viewingDoc.fileData ? (
                // If actual uploaded fileData is present (image or base64 PDF)
                viewingDoc.fileData.startsWith('data:image') || viewingDoc.mimeType?.includes('image') ? (
                  <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <img
                      src={viewingDoc.fileData}
                      alt={viewingDoc.title}
                      className="max-w-full max-h-[70vh] object-contain mx-auto rounded-xl shadow-md border"
                    />
                    <p className="text-xs text-slate-500 mt-3 font-semibold">
                      {viewingDoc.fileName} • সম্পূর্ণ প্রিভিউ
                    </p>
                  </div>
                ) : viewingDoc.fileData.startsWith('data:application/pdf') || viewingDoc.mimeType?.includes('pdf') ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800">
                    <iframe
                      src={viewingDoc.fileData}
                      className="w-full h-[650px] rounded-xl border border-slate-200 dark:border-slate-700"
                      title={viewingDoc.title}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border">
                    <FileText className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {viewingDoc.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ফাইলটি সিস্টেমে সংরক্ষিত আছে ({viewingDoc.fileName})
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(viewingDoc)}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                    >
                      ডকুমেন্ট ওপেন / ডাউনলোড করুন
                    </button>
                  </div>
                )
              ) : (
                // Official Government Certificate / License Presentation
                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 border-slate-300 dark:border-slate-700 p-8 sm:p-12 text-slate-900 dark:text-slate-100 relative overflow-hidden">
                  {/* Decorative Borders */}
                  <div className="absolute inset-2 border-2 border-emerald-600/30 rounded-xl pointer-events-none" />
                  
                  {/* Certificate Top Header */}
                  <div className="text-center pb-6 border-b-2 border-emerald-700 relative">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-2 shadow-md">
                      ভূমি
                    </div>
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
                      গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                    </h4>
                    <h2 className="text-xl sm:text-2xl font-black mt-1">
                      উপজেলা প্রশাসন ও ডিজিটাল সেন্টার, নন্দীগ্রাম, বগুড়া
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      স্মারক নং: উউজে/নন্দী/ডিজিটাল-সেবা/{viewingDoc.id.replace('doc-', '২০২৫/')}
                    </p>
                    <div className="inline-block mt-4 px-5 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-full text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider shadow-2xs">
                      {viewingDoc.title}
                    </div>
                  </div>

                  {/* Document Body Content */}
                  <div className="py-6 space-y-4 text-xs leading-relaxed">
                    <div className="flex justify-between items-center text-[11px] text-slate-500 border-b pb-2">
                      <span><strong>ডকুমেন্ট আইডি:</strong> {viewingDoc.id}</span>
                      <span><strong>ইস্যুর তারিখ:</strong> {viewingDoc.uploadDate}</span>
                      <span><strong>লাইসেন্স ধরন:</strong> {viewingDoc.type}</span>
                    </div>

                    <p className="text-justify indent-6">
                      এতদ্বারা প্রত্যায়ন ও অনুমোদন করা যাইতেছে যে, <strong>"{organization.name}"</strong>, উপজেলা: {organization.upazila}, জেলা: {organization.district}, রেজি নং: <strong>{organization.registrationNumber}</strong>, সরকারি সকল বিধিবিধান ও ডিজিটাল বাংলাদেশ/স্মার্ট বাংলাদেশ ফ্রেমওয়ার্ক অনুযায়ী উপজেলা ডিজিটাল সেন্টার এবং ভূমি সেবা কেন্দ্র হিসেবে বৈধভাবে অনুমোদিত ও নিবন্ধিত।
                    </p>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">
                        অনুমোদিত সেবাসমূহ ও শর্তাবলী:
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                        <li>অনলাইন ই-নামজারি (খারিজ) আবেদন ও নিষ্পত্তির ট্র্যাকিং সুবিধা প্রদান।</li>
                        <li>ভূমি উন্নয়ন কর (ই-দাখিলা) চেক ও নাগরিক সহযোগিতায় ফি পরিশোধ।</li>
                        <li>সিএস, এসএ, আরএস ও বিএস খতিয়ান বা পর্চা অনলাইনে উত্তোলনে সহযোগিতা।</li>
                        <li>সরকারি নির্ধারিত মূল্যে দ্রুত ফটো, ফটোকপি, কম্পিউটার টাইপিং ও অনলাইন সেবা।</li>
                      </ul>
                    </div>

                    <p>
                      দায়িত্বপ্রাপ্ত উদ্যোক্তা ও পরিচালক: <strong>{organization.inChargeName}</strong> ({organization.inChargeDesignation})। প্রতিষ্ঠানটির লাইসেন্স ও সনদপত্র ২০২৫-২০২৬ অর্থবছরের জন্য সম্পূর্ণ বৈধ ও হালনাগাদ রয়েছে।
                    </p>
                  </div>

                  {/* Certificate Footer with Signatures & QR Code */}
                  <div className="pt-8 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-center items-end">
                    <div>
                      <div className="w-28 mx-auto border-t border-slate-400 pt-1 font-bold text-[11px]">
                        হিসাব ও অডিট সিল
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">যাচাইকৃত নথি</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300">
                        <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200" />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">
                        VERIFIED: {organization.registrationNumber}
                      </span>
                    </div>

                    <div>
                      <div className="w-32 mx-auto border-t border-slate-400 pt-1 font-bold text-[11px]">
                        উপজেলা নির্বাহী কর্মকর্তা
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">নন্দীগ্রাম, বগুড়া</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Organization Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t('editOrgInfo', language)}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিষ্ঠানের পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    রেজিস্ট্রেশন নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিষ্ঠাকাল (সন)
                  </label>
                  <input
                    type="text"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    উপজেলা
                  </label>
                  <input
                    type="text"
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    জেলা
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দায়িত্বপ্রাপ্ত কর্মকর্তা / উদ্যোক্তার নাম
                  </label>
                  <input
                    type="text"
                    value={formData.inChargeName}
                    onChange={(e) => setFormData({ ...formData, inChargeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    লোগো ইমেজ ফাইল নির্বাচন করুন
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিষ্ঠান পরিচিতি
                  </label>
                  <textarea
                    rows={3}
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('saveOrgInfo', language)}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>নতুন ডকুমেন্ট আপলোড</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadingDoc(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডকুমেন্টের নাম / শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="যেমন: পৌরসভা ট্রেড লাইসেন্স ২০২৬"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডকুমেন্টের ধরন
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                >
                  <option value="ট্রেড লাইসেন্স (Trade License)">ট্রেড লাইসেন্স (Trade License)</option>
                  <option value="চুক্তিপত্র (Deed / Agreement)">চুক্তিপত্র (Deed / Agreement)</option>
                  <option value="সরকারি অনুমোদন (Govt Approval)">সরকারি অনুমোদন (Govt Approval)</option>
                  <option value="সিটিজেন চার্টার (Citizen Charter)">সিটিজেন চার্টার (Citizen Charter)</option>
                  <option value="অন্যান্য প্রত্যয়ন (Certificate)">অন্যান্য প্রত্যয়ন (Certificate)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ফাইল সিলেক্ট করুন (PDF অথবা ইমেজ JPG/PNG) *
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleDocFileSelect}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {docFile && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>সিলেক্টেড: {docFile.name} ({docFileSize})</span>
                  </p>
                )}
              </div>

              {/* Live Preview of selected file if image */}
              {docFileData && docMimeType.includes('image') && (
                <div className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">ছবি প্রিভিউ:</span>
                  <img src={docFileData} alt="Preview" className="h-28 object-contain mx-auto rounded-lg" />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsUploadingDoc(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>সংযুক্ত ও সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
