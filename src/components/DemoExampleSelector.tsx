import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { DEMO_EXAMPLES, DemoExample } from '../data/demoExamples';
import { Language } from '../i18n/translations';

interface DemoExampleSelectorProps {
  onSelectExample: (example: DemoExample) => void;
  language: Language;
}

export const DemoExampleSelector: React.FC<DemoExampleSelectorProps> = ({
  onSelectExample,
  language
}) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-shield-cyan flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {language === 'hi' ? 'डेमो उदाहरण (1-क्लिक से आज़माएं)' : 'Try Demo Real Examples'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Hackathon Ready</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_EXAMPLES.map((example) => {
          const isHigh = example.expectedRisk === 'HIGH' || example.expectedRisk === 'CRITICAL';
          return (
            <button
              key={example.id}
              onClick={() => onSelectExample(example)}
              className="text-left p-3 rounded-2xl bg-shield-card/80 hover:bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition group flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHigh ? 'bg-red-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {example.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-100 group-hover:text-shield-cyan transition line-clamp-1">
                  {language === 'hi' ? example.titleHi : example.title}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {example.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-shield-cyan group-hover:translate-x-0.5 transition flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
