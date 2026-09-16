import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../types';
import { Language, translations } from '../i18n/translations';

interface RiskBadgeProps {
  level: RiskLevel;
  language: Language;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, language, size = 'md' }) => {
  const t = translations[language];

  let config = {
    text: t.riskLow,
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    textCol: 'text-emerald-400',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
  };

  if (level === 'CRITICAL') {
    config = {
      text: t.riskCritical,
      bg: 'bg-red-500/20',
      border: 'border-red-500/60',
      textCol: 'text-red-400 font-black',
      icon: <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
    };
  } else if (level === 'HIGH') {
    config = {
      text: t.riskHigh,
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      textCol: 'text-amber-400 font-bold',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
    };
  } else if (level === 'MEDIUM') {
    config = {
      text: t.riskMedium,
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500/40',
      textCol: 'text-yellow-300 font-medium',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-300" />
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full border shadow-sm font-semibold tracking-wide uppercase ${config.bg} ${config.border} ${config.textCol} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};
