import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  HelpCircle,
  FileQuestion,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: 'আসসালামু আলাইকুম! আমি ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম, বগুড়া এর এআই ভার্চুয়াল সহকারী। \n\nভূমি সেবা (ই-নামজারি খারিজ, খতিয়ান, ই-দাখিলা) বা এই অর্গানাইজার সফটওয়্যার ব্যবহারে যেকোনো সহায়তার জন্য আমাকে জিজ্ঞাসা করতে পারেন।',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'ই-নামজারি (খারিজ) আবেদনের নিয়ম ও প্রয়োজনীয় কাগজপত্র কি?',
    'অনলাইনে খতিয়ান বা পর্চা তোলার সঠিক পদ্ধতি কি?',
    'ভূমি উন্নয়ন কর (ই-দাখিলা) কিভাবে চেক ও পরিশোধ করা যায়?',
    'অর্গানাইজারে আজকের হিসাব ও পে-স্লিপ কিভাবে তৈরি ও প্রিন্ট করব?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি');
      }

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorBotMsg: Message = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        text: 'দুঃখিত, এআই সেবায় সামান্য বিভ্রাট হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন। এছাড়া নন্দীগ্রাম ডিজিটাল সেন্টারের উদ্যোক্তা মোঃ রবিউল ইসলামের সাথে সরাসরি যোগাযোগ করতে পারেন।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'model',
        text: 'চ্যাট ইতিহাস মুছে ফেলা হয়েছে। আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl h-[620px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">
                  {language === 'bn' ? 'ভূমি ও ডিজিটাল সেবা এআই সহকারী' : 'Land & Digital Services AI Helpdesk'}
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white/20 rounded-md uppercase tracking-wider">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="চ্যাট হিস্ট্রি রিসেট"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((m) => {
            const isBot = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    isBot
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-600 text-white font-medium rounded-tr-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div
                    className={`text-[9px] mt-1.5 flex items-center justify-end ${
                      isBot ? 'text-slate-400' : 'text-emerald-100'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 text-slate-500 rounded-2xl px-4 py-3 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>এআই সহকারী উত্তর প্রস্তুত করছে...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>সচরাচর জিজ্ঞাসিত প্রশ্ন:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন বা সমস্যা লিখুন (যেমন: নামজারি বাতিল বা আপত্তি কিভাবে করে?)..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
