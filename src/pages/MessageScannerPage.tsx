import React, { useState } from 'react';
import { MessageSquare, Sparkles, Trash2, ArrowRight, Mic, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { DemoExampleSelector } from '../components/DemoExampleSelector';
import { DemoExample } from '../data/demoExamples';

interface MessageScannerPageProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  language: Language;
  onOpenVoiceModal: () => void;
  initialText?: string;
}

export const MessageScannerPage: React.FC<MessageScannerPageProps> = ({
  onAnalyze,
  isLoading,
  language,
  onOpenVoiceModal,
  initialText = ''
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [validationError, setValidationError] = useState<string | null>(null);

  const t = translations[language];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setValidationError(
        language === 'hi'
          ? 'कृपया जांचने के लिए कोई संदेश या एसएमएस पेस्ट करें।'
          : 'Please paste a message or SMS to analyze.'
      );
      return;
    }
    setValidationError(null);
    onAnalyze(inputText.trim());
  };

  const handleSelectExample = (example: DemoExample) => {
    setInputText(example.text);
    setValidationError(null);
  };

  const handleClear = () => {
    setInputText('');
    setValidationError(null);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-shield-cyan" />
            {t.scannerTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'संदेश को यहां पेस्ट करें और धोखाधड़ी के गुप्त संकेत तुरंत जानें'
              : 'Paste any suspicious message to detect urgency, fake links and scam signals'}
          </p>
        </div>
      </div>

      {/* Input Box Card */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'hi' ? 'संदेश सामग्री' : 'Message Content'}
          </label>
          {inputText && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearText}</span>
            </button>
          )}
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder={t.scannerPlaceholder}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-shield-cyan focus:ring-1 focus:ring-shield-cyan transition resize-none leading-relaxed"
        />

        {validationError && (
          <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </p>
        )}

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-shield-cyan to-shield-teal text-white font-bold text-sm shadow-lg shadow-shield-teal/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.btnAnalyzing}</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>{t.btnAnalyze}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-semibold text-sm border border-slate-700/60 transition flex items-center justify-center gap-2"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'बोलकर पूछें' : 'Voice Input'}</span>
          </button>
        </div>
      </div>

      {/* Demo Examples Selector for Reliable Presentation */}
      <DemoExampleSelector
        onSelectExample={handleSelectExample}
        language={language}
      />
    </div>
  );
};
