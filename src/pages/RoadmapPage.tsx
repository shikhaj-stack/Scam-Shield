import React from 'react';
import { Target, Rocket, Sparkles, CheckCircle2, Shield, Heart, Zap, ArrowRight } from 'lucide-react';
import { Language } from '../i18n/translations';

interface RoadmapPageProps {
  language: Language;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ language }) => {
  const isHi = language === 'hi';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Pitch Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-shield-blue via-shield-navy to-shield-card border border-shield-cardBorder p-6 sm:p-7 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shield-cyan/15 border border-shield-cyan/30 text-shield-cyan text-xs font-bold mb-3 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Pitch & Vision</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
          ScamShield: A Digital Bodyguard for Parents
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs uppercase font-extrabold text-red-400 block mb-1">
              The Problem
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Parents in India are bombarded with digital scams (electricity cut threats, fake bank block notices, courier customs fees). Scammers weaponize urgency and technical confusion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs uppercase font-extrabold text-emerald-400 block mb-1">
              Our Solution
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              ScamShield analyzes messages, detects scam signals, explains the risk in simple language (English/Hindi), provides safe actions, and enables 1-click trusted family escalation.
            </p>
          </div>
        </div>

        {/* Differentiator Formula */}
        <div className="mt-5 p-4 rounded-2xl bg-shield-card border border-shield-cyan/30 flex flex-wrap items-center justify-between gap-2 text-center">
          <span className="text-xs font-bold text-white">Our 4-Stage Guard:</span>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-shield-cyan">
            <span>Detect</span>
            <span>→</span>
            <span>Explain</span>
            <span>→</span>
            <span>Protect</span>
            <span>→</span>
            <span className="text-amber-400">Connect Family</span>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline: Today vs Next vs Future */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Rocket className="w-4 h-4 text-shield-cyan" />
          <span>Product Evolution Roadmap</span>
        </h3>

        {/* Phase 1: Today */}
        <div className="rounded-3xl bg-shield-card border border-shield-teal/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-shield-teal flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Phase 1 — Built & Working Today (Hackathon MVP)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shield-teal/20 text-shield-teal">
              Completed
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>Hybrid scam risk engine with weighted explainable signals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>Screenshot OCR text extraction with fallback editing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>Deep URL link analyzer (suspicious TLDs, IP detection, brand impersonation)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>Parent-friendly bilingual Hindi & English interface with Voice TTS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>"Ask My Family" escalation card with simulated & WhatsApp sharing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-teal font-bold">✓</span>
              <span>Demo Mode with 6 preloaded realistic test scenarios</span>
            </li>
          </ul>
        </div>

        {/* Phase 2: Next */}
        <div className="rounded-3xl bg-shield-card border border-shield-cardBorder p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-shield-cyan flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Phase 2 — Next Release (Q3 2026)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shield-cyan/20 text-shield-cyan">
              In Architecture
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-shield-cyan font-bold">•</span>
              <span>Native Android NotificationListenerService for real-time background intercept</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-cyan font-bold">•</span>
              <span>QR code scam scanner (detecting malicious UPI request pay links)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-shield-cyan font-bold">•</span>
              <span>Expansion to regional Indian languages (Tamil, Telugu, Marathi, Bengali)</span>
            </li>
          </ul>
        </div>

        {/* Phase 3: Future */}
        <div className="rounded-3xl bg-shield-card border border-shield-cardBorder p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Phase 3 — Future Vision (Scale)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              Future
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>100% on-device quantized SLM (Small Language Model) running privately in-browser/NPU</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>Real-time voice call scam detection during incoming phone calls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>National Cyber Crime threat intelligence feeds integration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
