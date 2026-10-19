import React, { useState } from 'react';
import { 
  Rocket, 
  Edit3, 
  Copy, 
  Check, 
  Smartphone, 
  Laptop, 
  Globe, 
  Code2, 
  Download, 
  Database, 
  Sparkles, 
  X,
  ExternalLink,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { Language } from '../types';

interface LaunchAndEditGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const LaunchAndEditGuideModal: React.FC<LaunchAndEditGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'launch' | 'edit' | 'install'>('launch');

  if (!isOpen) return null;

  const liveUrl = window.location.origin || 'https://ais-pre-qdy4zv7tgpbv227pmfti4k-980161330811.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                অ্যাপ লঞ্চ ও পরবর্তীতে এডিট করার সম্পূর্ণ গাইডলাইন
              </h3>
              <p className="text-xs text-emerald-100">
                ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('launch')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'launch'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>১. অ্যাপ লঞ্চ ও ব্যবহার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'install'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>২. মোবাইল/পিসিতে ইনস্টল</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>৩. ভবিষ্যতে এডিট করার সুবিধা</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          {/* TAB 1: LAUNCH & USAGE */}
          {activeTab === 'launch' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                      আপনার অ্যাপটি ইতিমধ্যে লাইভ এবং চালু আছে!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                      গুগল ক্লাউড রান (Google Cloud Run)-এ অ্যাপটি সার্বক্ষণিক হোস্টেড অবস্থায় রয়েছে। যেকোনো কম্পিউটার, ল্যাপটপ, ট্যাবলেট বা মোবাইল থেকে আপনি ও আপনার ডিজিটাল সেন্টারের টিম সরাসরি এই লিংকে প্রবেশ করতে পারবেন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Live URL Box */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                  আপনার অ্যাপের অফিসিয়াল শেয়ারেবল লাইভ লিংক:
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    readOnly
                    value={liveUrl}
                    className="flex-1 bg-transparent px-2 font-mono text-[11px] text-slate-800 dark:text-slate-200 select-all focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Login Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-100">
                  লগইন তথ্য (Credentials):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-emerald-600">এডমিনিস্ট্রেটর একাউন্ট:</p>
                    <p className="mt-1">ইউজার আইডি: <code className="font-bold font-mono">admin</code></p>
                    <p>পাসওয়ার্ড: <code className="font-bold font-mono">nandigram2026</code></p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-blue-600">অপারেটর একাউন্ট:</p>
                    <p className="mt-1">ইউজার আইডি: <code className="font-bold font-mono">operator</code></p>
                    <p>পাসওয়ার্ড: <code className="font-bold font-mono">udc123</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALL AS PWA ON PHONE / PC */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-teal-900 dark:text-teal-100">
                    মোবাইল ও কম্পিউটারে সরাসরি অ্যাপের মতো ব্যবহার (PWA)
                  </h4>
                  <p className="text-xs text-teal-800 dark:text-teal-300 mt-1">
                    প্লে-স্টোরে আপলোড করার ঝামেলা ছাড়াই এই ওয়েবসাইটটি আপনি সরাসরি আপনার অ্যান্ড্রয়েড ফোন, আইফোন বা উইন্ডোজ কম্পিউটারে অ্যাপ আইকন হিসেবে ইনস্টল করে চালাতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android / Chrome */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>অ্যান্ড্রয়েড ফোন (Chrome Browser):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li>মোবাইলের Google Chrome দিয়ে লাইভ লিংকটি ওপেন করুন।</li>
                    <li>উপরের ডানপাশে ৩টি ডট (<strong>⋮</strong>) আইকনে চাপুন।</li>
                    <li><strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> চাপুন।</li>
                    <li>কয়েক সেকেন্ডে আপনার মোবাইলের হোম স্ক্রিনে <em>"ভূমি সেবা"</em> নামে অ্যাপ আইকন তৈরি হয়ে যাবে।</li>
                  </ol>
                </div>

                {/* iPhone / Safari */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>আইফোন / আইপ্যাড (Safari Browser):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li>Safari ব্রাউজারে লিংকটি ওপেন করুন।</li>
                    <li>নিচে মাঝখানের <strong>Share</strong> (তীর চিহ্ন) বাটনে চাপুন।</li>
                    <li>নিচে স্ক্রল করে <strong>"Add to Home Screen"</strong> অপশন চাপুন।</li>
                    <li>আইফোনের স্ক্রিনে অ্যাপ আইকন তৈরি হয়ে যাবে।</li>
                  </ol>
                </div>

                {/* Windows / Mac Desktop */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <Laptop className="w-4 h-4 text-teal-600" />
                    <span>কম্পিউটার ও ল্যাপটপে ইনস্টল (Chrome / Edge):</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    ব্রাউজারের অ্যাড্রেস বারের ডানপাশে একটি ছোট <strong>"Install"</strong> আইকন দেখতে পাবেন। সেখানে ক্লিক করলে অ্যাপটি সম্পূর্ণ আলাদা উইন্ডোতে ফুলস্ক্রিন সফটওয়্যার হিসেবে ইনস্টল হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO EDIT IN THE FUTURE */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-100">
                    ভবিষ্যতে অ্যাপ এডিট বা পরিবর্তন করার ৩টি সহজ উপায়
                  </h4>
                  <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
                    আপনার সুবিধা অনুযায়ী কোডিং ছাড়া সফটওয়্যারের ভেতর থেকে, এআই চ্যাটের মাধ্যমে অথবা কোড ডাউনলোড করে পরিবর্তন করতে পারবেন।
                  </p>
                </div>
              </div>

              {/* Option 1: UI In-App Dynamic Editing */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <Database className="w-4 h-4" />
                  <span>উপায় ১: সফটওয়্যারের ভেতর থেকেই সরাসরি এডিট (No Code Needed)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  কোনো কোডিং জ্ঞান ছাড়াই আপনি প্রতিদিনের কার্যক্রমের সবকিছু সফটওয়্যার থেকেই পরিবর্তন করতে পারবেন:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                  <li><strong>প্রতিষ্ঠান প্রোফাইল:</strong> নাম, মোবাইল নম্বর, ইমেইল, ঠিকানা, লোগো এবং অফিসিয়াল ডকুমেন্ট ফাইল যুক্ত ও এডিট।</li>
                  <li><strong>কর্মচারী তথ্য:</strong> নতুন কর্মী নিয়োগ, বর্তমান কর্মীর বেতন ও পদবী আপডেট, বরখাস্ত বা পুনর্বহাল।</li>
                  <li><strong>হিসাব-নিকাশ ও পে-স্লিপ:</strong> যেকোনো ভুল হিসাব সংশোধন বা ডিলিট।</li>
                  <li><strong>ব্যাকআপ ও সিঙ্ক:</strong> ডেটা সেন্টারে গিয়ে এক ক্লিকে সম্পূর্ণ ডেটাবেজ JSON ফাইলে ডাউনলোড করে কম্পিউটারে সংরক্ষণ বা রিস্টোর।</li>
                </ul>
              </div>

              {/* Option 2: AI Prompting via Chat */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>উপায় ২: গুগল এআই স্টুডিও বিল্ড চ্যাটের মাধ্যমে এডিট</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  ভবিষ্যতে অ্যাপের কোনো ডিজাইন, নতুন ফিচার বা বাটন পরিবর্তন করতে চাইলে আপনি এই চ্যাটবক্সেই বাংলায় লিখে নির্দেশ দিতে পারেন। যেমন:
                </p>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <p>• <em>"আয় ট্যাবে 'মৌজা ম্যাপ' নামে নতুন একটি আয়ের ঘর যোগ করে দাও।"</em></p>
                  <p>• <em>"পে-স্লিপে উপজেলা নির্বাহী কর্মকর্তা (UNO)-এর অনুমোদনের সিল যোগ করো।"</em></p>
                </div>
                <p className="text-slate-500 text-[11px]">
                  এআই আপনার দেওয়া বর্ণনা অনুযায়ী কোড নিজে থেকেই আপডেট, টেস্ট ও ডিপ্লয় করে দেবে।
                </p>
              </div>

              {/* Option 3: Source Code Download & VS Code */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400">
                  <Terminal className="w-4 h-4" />
                  <span>উপায় ৩: সোর্স কোড ডাউনলোড করে অফলাইনে এডিটিং (VS Code)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  গুগল এআই স্টুডিও স্ক্রিনের ওপরের ডানপাশে <strong>"Export to GitHub"</strong> বা <strong>"Download"</strong> অপশন রয়েছে। এটি দিয়ে আপনি সম্পূর্ণ প্রজেক্টের জিপ ফাইল নামিয়ে নিতে পারেন। এরপর আপনার কম্পিউটারে নিম্নোক্ত কমান্ড দিয়ে চালাতে পারবেন:
                </p>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] space-y-1">
                  <p>npm install</p>
                  <p>npm run dev</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            জরুরি প্রয়োজনে এআই সেবা সহকারী (Alt + 9) ব্যবহার করতে পারেন
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
