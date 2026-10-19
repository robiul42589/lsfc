import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language, UserSession, OrganizationProfile } from '../types';
import { t } from '../utils/i18n';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (session: UserSession) => void;
  language: Language;
  organization: OrganizationProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  language,
  organization,
}) => {
  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('nandigram2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Validate credentials
      if (
        (userId.trim().toLowerCase() === 'admin' && password === 'nandigram2026') ||
        (userId.trim().toLowerCase() === 'operator' && password === 'udc123') ||
        (userId.trim().length >= 3 && password.length >= 4)
      ) {
        const session: UserSession = {
          isLoggedIn: true,
          userId: userId.trim(),
          userName: userId.toLowerCase().includes('admin')
            ? 'মোঃ রবিউল ইসলাম (এডমিন)'
            : 'অপারেটর (ডিজিটাল সেন্টার)',
          role: userId.toLowerCase().includes('admin') ? 'admin' : 'operator',
        };
        setIsLoading(false);
        onLoginSuccess(session);
      } else {
        setIsLoading(false);
        setErrorMsg(t('invalidCredentials', language));
      }
    }, 400);
  };

  const handleAutoFill = (role: 'admin' | 'operator') => {
    if (role === 'admin') {
      setUserId('admin');
      setPassword('nandigram2026');
    } else {
      setUserId('operator');
      setPassword('udc123');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        {/* Modal Top Header with Logo */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 shadow-lg flex items-center justify-center">
            {organization.logoUrl ? (
              <img 
                src={organization.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ShieldCheck className="w-9 h-9 text-white" />
            )}
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">
            {organization.name}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {language === 'bn' ? 'অর্গানাইজার ও ম্যানেজমেন্ট সিস্টেমে স্বাগতম' : 'Organizer & Management System'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t('loginPrompt', language)}
            </h3>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('username', language)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="যেমন: admin বা আপনার ইউজার আইডি"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('password', language)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span>{t('rememberMe', language)}</span>
            </label>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline text-[11px]">
              {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">যাচাই করা হচ্ছে...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('login', language)}</span>
              </>
            )}
          </button>

          {/* Quick Auto-fill Demo credentials */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              {t('quickDemoLogin', language)}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleAutoFill('admin')}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                এডমিন (admin)
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill('operator')}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                অপারেটর (operator)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
