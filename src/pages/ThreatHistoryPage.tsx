import React from 'react';
import { History, Trash2, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { ThreatHistoryItem } from '../types';
import { Language, translations } from '../i18n/translations';
import { RiskBadge } from '../components/RiskBadge';

interface ThreatHistoryPageProps {
  history: ThreatHistoryItem[];
  onClearHistory: () => void;
  onSelectItem: (item: ThreatHistoryItem) => void;
  language: Language;
}

export const ThreatHistoryPage: React.FC<ThreatHistoryPageProps> = ({
  history,
  onClearHistory,
  onSelectItem,
  language
}) => {
  const t = translations[language];
  const isHi = language === 'hi';

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-shield-cyan" />
            {t.navHistory}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi ? 'हाल में जांची गई चेतावनियों और संदेशों का इतिहास' : 'Saved scans and safety assessments on this device'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-500/30 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isHi ? 'इतिहास मिटाएं' : 'Clear History'}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {isHi ? 'अभी तक कोई संदेश इतिहास नहीं है' : 'No threat history yet'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isHi ? 'मैसेज जांचने पर परिणाम यहाँ सुरक्षित रहेंगे' : 'Scanned messages will be catalogued here for reference'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="p-4 rounded-2xl bg-shield-card hover:bg-slate-800 border border-shield-cardBorder hover:border-slate-600 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {item.snippet}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <RiskBadge level={item.riskLevel} language={language} size="sm" />
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-shield-cyan group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
