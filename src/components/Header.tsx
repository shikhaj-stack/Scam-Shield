import React from 'react';
import { Shield, Globe, Volume2, HelpCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenVoiceModal?: () => void;
  onNavigateRoadmap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenVoiceModal,
  onNavigateRoadmap
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-shield-navy/90 backdrop-blur-md border-b border-shield-cardBorder px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-shield-cyan to-shield-teal flex items-center justify-center shadow-lg shadow-shield-teal/20 text-white font-bold text-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.appName}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-shield-teal/20 text-shield-teal border border-shield-teal/30">
                PWA MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Voice Assistant Shortcut */}
          {onOpenVoiceModal && (
            <button
              onClick={onOpenVoiceModal}
              title="Voice Assistant"
              className="p-2 rounded-xl bg-shield-blue hover:bg-slate-800 text-shield-teal transition border border-slate-700/60"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}

          {/* Hackathon Roadmap Shortcut */}
          {onNavigateRoadmap && (
            <button
              onClick={onNavigateRoadmap}
              title="Hackathon Pitch & Roadmap"
              className="p-2 rounded-xl bg-shield-blue hover:bg-slate-800 text-slate-300 transition border border-slate-700/60"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-shield-blue rounded-xl p-1 border border-slate-700/60">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                language === 'en'
                  ? 'bg-shield-cyan text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                language === 'hi'
                  ? 'bg-shield-cyan text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
