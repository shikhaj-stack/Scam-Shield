import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface SafetyActionCardProps {
  safeActions: string[];
  avoidActions: string[];
  language: Language;
}

export const SafetyActionCard: React.FC<SafetyActionCardProps> = ({
  safeActions,
  avoidActions,
  language
}) => {
  const t = translations[language];

  return (
    <div className="space-y-4">
      {/* What NOT to do */}
      {avoidActions.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4">
          <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-400" />
            {t.dontDoThis}
          </h4>
          <ul className="space-y-2">
            {avoidActions.map((action, idx) => (
              <li key={idx} className="text-xs text-red-200/90 flex items-start gap-2 leading-relaxed">
                <span className="text-red-400 font-black mt-0.5">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe steps to take */}
      {safeActions.length > 0 && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.doThis}
          </h4>
          <ul className="space-y-2">
            {safeActions.map((action, idx) => (
              <li key={idx} className="text-xs text-emerald-200/90 flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
