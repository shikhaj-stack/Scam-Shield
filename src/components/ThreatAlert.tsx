import React from 'react';
import { ShieldAlert, X, Users, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface ThreatAlertProps {
  result: AnalysisResult;
  onViewAnalysis: () => void;
  onAskFamily: () => void;
  onDismiss: () => void;
  language: Language;
}

export const ThreatAlert: React.FC<ThreatAlertProps> = ({
  result,
  onViewAnalysis,
  onAskFamily,
  onDismiss,
  language
}) => {
  const isHi = language === 'hi';
  const isHighRisk = result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL';

  if (!isHighRisk) return null;

  return (
    <div className="fixed inset-x-3 sm:inset-x-auto sm:right-6 top-16 sm:top-20 z-50 sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-shield-navy border-2 border-red-500/80 rounded-3xl p-5 shadow-2xl glow-critical relative backdrop-blur-xl">
        <button
          onClick={onDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Alert Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
              🛡️ ScamShield Alert
            </span>
            <h3 className="text-sm font-extrabold text-white">
              {isHi ? 'उच्च जोखिम संदेश पहचाना गया' : 'HIGH-RISK MESSAGE DETECTED'}
            </h3>
          </div>
        </div>

        {/* Category Tag */}
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{isHi ? 'संभावित प्रकार:' : 'Threat Pattern:'}</span>
          <span className="font-bold text-red-300">{result.category}</span>
        </div>

        {/* Why it was flagged */}
        <div className="space-y-1.5 mb-3.5">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            {isHi ? 'यह चेतावनी क्यों दी गई:' : 'Why it was flagged:'}
          </span>
          <div className="space-y-1 text-xs">
            {result.signals.slice(0, 3).map((sig, idx) => (
              <div key={idx} className="flex items-center gap-2 text-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="truncate">{isHi ? sig.titleHi : sig.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recommended Actions */}
        <div className="p-3 bg-red-950/40 rounded-2xl border border-red-500/20 mb-4 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-red-300 font-semibold">
            <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>{isHi ? 'लिंक पर क्लिक न करें' : "Don't click suspicious links"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-300 font-semibold">
            <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>{isHi ? 'ओटीपी या पिन साझा न करें' : "Don't share OTP or UPI PIN"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{isHi ? 'केवल आधिकारिक बैंक ऐप से जांचें' : 'Verify through official bank app'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewAnalysis}
            className="flex-1 py-2.5 px-3 rounded-xl bg-shield-cyan hover:bg-shield-teal text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
          >
            <span>{isHi ? 'पूरी रिपोर्ट देखें' : 'View Analysis'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onAskFamily}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-shield-cyan" />
            <span>{isHi ? 'परिवार से पूछें' : 'Ask Family'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
