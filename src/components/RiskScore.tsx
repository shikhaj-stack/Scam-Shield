import React from 'react';
import { Language } from '../i18n/translations';

interface RiskScoreProps {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  language: Language;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ score, riskLevel, language }) => {
  // Determine color according to score
  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';

  if (score >= 80) {
    barColor = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (score >= 60) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (score >= 30) {
    barColor = 'bg-yellow-400';
    textColor = 'text-yellow-300';
  }

  return (
    <div className="bg-shield-card border border-shield-cardBorder rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
          {language === 'hi' ? 'खतरा संकेत स्कोर' : 'Evidence Risk Score'}
        </span>
        <span className={`text-xl font-black ${textColor}`}>
          {score}<span className="text-xs font-normal text-slate-400">/100</span>
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(8, score))}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400 mt-2 italic leading-tight">
        {language === 'hi'
          ? '* यह स्कोर संदेश में पाए गए दबाव, अनजान लिंक और संदिग्ध पैटर्न के आधार पर निकाला गया है।'
          : '* Weighted score calculated from urgency keywords, credential requests, and link safety.'}
      </p>
    </div>
  );
};
