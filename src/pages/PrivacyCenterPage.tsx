import React from 'react';
import { Lock, Shield, Eye, Database, Server, Smartphone, Trash2, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Language } from '../i18n/translations';

interface PrivacyCenterPageProps {
  onBack: () => void;
  onClearHistory: () => void;
  language: Language;
}

export const PrivacyCenterPage: React.FC<PrivacyCenterPageProps> = ({
  onBack,
  onClearHistory,
  language
}) => {
  const isHi = language === 'hi';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHi ? 'वापस' : 'Back'}</span>
        </button>
        <span className="text-xs uppercase font-bold tracking-wider text-shield-teal">
          ScamShield Transparency
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-shield-teal" />
          {isHi ? 'गोपनीयता और डेटा सुरक्षा केंद्र' : 'Privacy & Transparency Center'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isHi
            ? 'हमारा दृढ़ सिद्धांत: न्यूनतम आवश्यक डेटा, स्थानीय सुरक्षा जांच और कोई गुप्त ट्रैकिंग नहीं'
            : 'Our core principle: Minimum necessary data, local-first rule evaluations, and total transparency.'}
        </p>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-shield-card border border-shield-cardBorder text-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-shield-cyan/15 text-shield-cyan flex items-center justify-center mb-2">
            <Smartphone className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white">Local Evaluation</h4>
          <p className="text-slate-400 leading-relaxed">
            Rule heuristics run directly inside your browser or device without uploading personal text.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-shield-card border border-shield-cardBorder text-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
            <Database className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white">Zero Cloud Storing</h4>
          <p className="text-slate-400 leading-relaxed">
            ScamShield does not operate a remote server database storing your private chat transcripts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-shield-card border border-shield-cardBorder text-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-2">
            <Eye className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white">Permission First</h4>
          <p className="text-slate-400 leading-relaxed">
            Android notifications and image OCR are only accessed upon explicit parent consent.
          </p>
        </div>
      </div>

      {/* Detailed Access Breakdown Table */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          What ScamShield Accesses & Why
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">
              1. Selected Notification Sources (Android PWA / App)
            </span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Why:</strong> Intercepts incoming messages from chosen apps (SMS, WhatsApp) to alert parents before they click links or send payments.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">
              2. Messages Provided for Scanning
            </span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Why:</strong> Extracted solely for detecting scam indicators (urgency, credentials, fake links). Analyzed in-memory and only saved to local device history.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">
              3. Screenshots (Camera & Library)
            </span>
            <p className="text-slate-400 leading-relaxed">
              <strong>Why:</strong> Processed in-browser using Tesseract OCR to convert image text for safety analysis. Raw screenshot files are not transmitted to external hosts.
            </p>
          </div>
        </div>
      </div>

      {/* AI Transparency Clause */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-shield-cyan" />
          AI Transparency Policy
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          ScamShield distinguishes between <strong>offline local rule detection</strong> and <strong>optional Cloud AI enhancement</strong>:
        </p>
        <ul className="text-xs text-slate-400 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-shield-teal flex-shrink-0 mt-0.5" />
            <span><strong>Default Mode:</strong> Runs 100% on-device rules with no external API calls. Zero external transmission.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-shield-teal flex-shrink-0 mt-0.5" />
            <span><strong>Optional Gemini AI:</strong> When an API key is explicitly configured by the user, sanitized prompt snippets are sent to Google Gemini for nuanced conversational explanation.</span>
          </li>
        </ul>
      </div>

      {/* User Data Controls */}
      <div className="bg-red-950/20 border border-red-500/30 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-red-400">Purge Stored Data</h4>
          <p className="text-xs text-red-200/80 mt-0.5">
            Instantly wipe all local threat history, cached alerts, and contacts from this device.
          </p>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge All</span>
        </button>
      </div>
    </div>
  );
};
