import React from 'react';
import { AlertCircle, Clock, KeyRound, DollarSign, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { ScamSignal } from '../types';
import { Language } from '../i18n/translations';

interface SignalCardProps {
  signal: ScamSignal;
  language: Language;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, language }) => {
  const isHi = language === 'hi';

  const getIcon = () => {
    switch (signal.type) {
      case 'urgency':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'credential':
        return <KeyRound className="w-5 h-5 text-red-400" />;
      case 'financial':
        return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'url':
        return <Globe className="w-5 h-5 text-orange-400" />;
      case 'impersonation':
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'context':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSeverityBadge = () => {
    if (signal.severity === 'high') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
          {isHi ? 'गंभीर' : 'High Risk'}
        </span>
      );
    }
    if (signal.severity === 'medium') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
          {isHi ? 'सावधानी' : 'Caution'}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
        {isHi ? 'सामान्य' : 'Safe Factor'}
      </span>
    );
  };

  return (
    <div className="bg-shield-card/90 border border-shield-cardBorder rounded-2xl p-3.5 hover:border-slate-600 transition flex items-start space-x-3">
      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-100 truncate">
            {isHi ? signal.titleHi || signal.title : signal.title}
          </h4>
          {getSeverityBadge()}
        </div>

        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {isHi ? signal.descriptionHi || signal.description : signal.description}
        </p>

        {signal.matchedText && (
          <div className="mt-2 text-[11px] font-mono bg-slate-900/80 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/20 inline-block break-all">
            "{signal.matchedText}"
          </div>
        )}
      </div>
    </div>
  );
};
