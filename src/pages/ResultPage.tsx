import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  Volume2,
  VolumeX,
  Users,
  RotateCcw,
  Sparkles,
  Info,
  ExternalLink,
  Share2
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { Language, translations } from '../i18n/translations';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScore } from '../components/RiskScore';
import { SignalCard } from '../components/SignalCard';
import { SafetyActionCard } from '../components/SafetyActionCard';

interface ResultPageProps {
  result: AnalysisResult;
  onScanAnother: () => void;
  onAskFamily: () => void;
  language: Language;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onScanAnother,
  onAskFamily,
  language
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = translations[language];
  const isHi = language === 'hi';

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech audio is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Construct simple, parent-friendly speech text
    let spokenText = '';
    if (isHi) {
      if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
        spokenText = `सावधान! यह संदेश अत्यधिक संदिग्ध है। ${result.summaryHi}. कृपया किसी लिंक पर क्लिक न करें और अपने बच्चों या बैंक से तुरंत बात करें।`;
      } else if (result.riskLevel === 'MEDIUM') {
        spokenText = `कृपया ध्यान दें। ${result.summaryHi}. सावधानी बरतें।`;
      } else {
        spokenText = `यह संदेश सामान्य प्रतीत होता है। फिर भी किसी अनजान व्यक्ति को अपना बैंक पिन या पासवर्ड न दें।`;
      }
    } else {
      if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
        spokenText = `Warning! High risk detected. ${result.summary}. Do not click any links or share your OTP. Check with your family.`;
      } else if (result.riskLevel === 'MEDIUM') {
        spokenText = `Caution advised. ${result.summary}. Please verify before taking any action.`;
      } else {
        spokenText = `This message appears standard. Remember, banks never ask for your password or OTP via SMS.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = isHi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Slightly slower for clarity

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const isHighRisk = result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onScanAnother}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio read-aloud button */}
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              isPlayingAudio
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-shield-blue text-shield-cyan border-shield-cardBorder hover:bg-slate-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? t.btnStopAudio : t.btnListenAudio}</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div
        className={`rounded-3xl p-6 border transition-all ${
          isHighRisk
            ? 'bg-gradient-to-b from-red-950/40 via-shield-navy to-shield-card border-red-500/50 glow-critical'
            : result.riskLevel === 'MEDIUM'
            ? 'bg-gradient-to-b from-amber-950/30 via-shield-navy to-shield-card border-amber-500/40 glow-high'
            : 'bg-gradient-to-b from-emerald-950/30 via-shield-navy to-shield-card border-emerald-500/40 glow-safe'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <RiskBadge level={result.riskLevel} language={language} size="lg" />
          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              {language === 'hi' ? 'श्रेणी' : 'Category'}
            </span>
            <span className="text-sm font-bold text-white">
              {result.category}
            </span>
          </div>
        </div>

        {/* Parent-friendly summary box */}
        <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-800 my-4">
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            {isHi ? result.summaryHi || result.summary : result.summary}
          </p>
        </div>

        {/* Risk Score */}
        <RiskScore
          score={result.riskScore}
          riskLevel={result.riskLevel}
          language={language}
        />

        {/* Fallback Notice if local rule engine was used */}
        {result.isLocalFallback && (
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 italic">
            <Info className="w-3.5 h-3.5 text-shield-cyan flex-shrink-0" />
            <span>{t.localFallbackNote}</span>
          </div>
        )}
      </div>

      {/* Scanned Input Snippet */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-4">
        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
          {language === 'hi' ? 'जांचा गया संदेश' : 'Scanned Message Text'}
        </span>
        <p className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 break-words leading-relaxed">
          "{result.inputContent}"
        </p>
      </div>

      {/* Why ScamShield Flagged This (Detected Signals) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-shield-amber" />
          {t.whyFlaggedTitle} ({result.signals.length})
        </h3>

        <div className="space-y-2.5">
          {result.signals.length === 0 ? (
            <div className="p-4 rounded-2xl bg-shield-card border border-shield-cardBorder text-xs text-slate-400 text-center">
              {language === 'hi'
                ? 'कोई खतरनाक सिग्नल नहीं मिला।'
                : 'No hazardous scam patterns detected in this text.'}
            </div>
          ) : (
            result.signals.map((sig) => (
              <SignalCard key={sig.id} signal={sig} language={language} />
            ))
          )}
        </div>
      </div>

      {/* Recommended Actions for Parents */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          {t.recommendedActionsTitle}
        </h3>
        <SafetyActionCard
          safeActions={isHi ? result.recommendedActions.safeHi : result.recommendedActions.safe}
          avoidActions={isHi ? result.recommendedActions.avoidHi : result.recommendedActions.avoid}
          language={language}
        />
      </div>

      {/* Primary Result Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        {isHighRisk && (
          <button
            onClick={onAskFamily}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-base shadow-xl shadow-red-600/25 hover:opacity-95 transition flex items-center justify-center gap-2.5"
          >
            <Users className="w-5 h-5" />
            <span>{t.btnAskFamily}</span>
          </button>
        )}

        <button
          onClick={onScanAnother}
          className={`py-4 px-6 rounded-2xl font-bold text-sm border transition flex items-center justify-center gap-2 ${
            isHighRisk
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'flex-1 bg-gradient-to-r from-shield-cyan to-shield-teal text-white shadow-lg shadow-shield-teal/20'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.btnScanAnother}</span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center px-4 leading-relaxed italic">
        {t.disclaimer}
      </p>
    </div>
  );
};
