import React from 'react';
import {
  Shield,
  MessageSquare,
  Image,
  Link2,
  Mic,
  Users,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  QrCode,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TabId } from '../components/BottomNav';
import { Language, translations } from '../i18n/translations';
import { ThreatHistoryItem, TrustedContact } from '../types';
import { RiskBadge } from '../components/RiskBadge';

interface HomePageProps {
  onNavigate: (tab: TabId) => void;
  onOpenVoiceModal: () => void;
  language: Language;
  recentScans: ThreatHistoryItem[];
  trustedContacts: TrustedContact[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenVoiceModal,
  language,
  recentScans,
  trustedContacts
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shield-blue via-shield-navy to-shield-card border border-shield-cardBorder p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-shield-teal/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shield-teal/15 border border-shield-teal/30 text-shield-teal text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-shield-teal" />
            <span>{t.scamShieldActive}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'hi' ? 'माता-पिता का डिजिटल अंगरक्षक' : 'A Digital Bodyguard for Parents'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            {t.subTagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('scan')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-shield-cyan to-shield-teal text-white font-bold text-sm shadow-lg shadow-shield-teal/25 hover:opacity-95 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.actionScanMessage}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
            <button
              onClick={() => onNavigate('screenshot')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-semibold text-sm border border-slate-700/60 transition"
            >
              <Image className="w-4 h-4 text-shield-cyan" />
              <span>{t.actionUploadScreenshot}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('scan')}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-shield-cyan/20 text-shield-cyan flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {t.actionScanMessage}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {t.actionScanMessageSub}
          </p>
        </button>

        <button
          onClick={() => onNavigate('screenshot')}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-shield-teal/20 text-shield-teal flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Image className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {t.actionUploadScreenshot}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {t.actionUploadScreenshotSub}
          </p>
        </button>

        <button
          onClick={() => onNavigate('link')}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-shield-amber/20 text-shield-amber flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {t.actionCheckLink}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {t.actionCheckLinkSub}
          </p>
        </button>

        <button
          onClick={onOpenVoiceModal}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {t.actionAskVoice}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {t.actionAskVoiceSub}
          </p>
        </button>

        <button
          onClick={() => onNavigate('notification')}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {language === 'hi' ? 'नोटिफिकेशन सुरक्षा' : 'Notification Guard'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {language === 'hi' ? 'एसएमएस और व्हाट्सएप की लाइव निगरानी' : 'Live SMS & WhatsApp intercept'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('qr')}
          className="p-4 sm:p-5 rounded-3xl bg-shield-card border border-shield-cardBorder hover:border-shield-cyan/50 transition-all text-left group relative overflow-hidden shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-shield-cyan transition-colors">
            {language === 'hi' ? 'क्यूआर कोड जांचें' : 'Scan QR Code'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {language === 'hi' ? 'पेमेंट क्यूआर कोड में छुपे खतरे पहचानें' : 'Detect UPI scam links in QR codes'}
          </p>
        </button>
      </div>

      {/* Today's Activity Dashboard (Prototype Data Clearly Labelled) */}
      <div className="rounded-3xl bg-shield-card border border-shield-cardBorder p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.todayActivity}
            </h3>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {t.prototypeBadge}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-shield-teal">
            <span className="w-2 h-2 rounded-full bg-shield-teal animate-pulse" />
            <span className="font-semibold">Guard Active</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-white">7</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">
              {t.scansChecked}
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-red-400">2</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">
              {t.highRiskDetected}
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-shield-teal">1</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">
              {t.familyAlertsSent}
            </p>
          </div>
        </div>
      </div>

      {/* Trusted Family Quick Connection Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-shield-card border border-shield-cardBorder p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 pr-2">
          <div className="w-11 h-11 rounded-2xl bg-shield-cyan/15 text-shield-cyan flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'hi' ? 'विश्वसनीय परिवार' : 'Trusted Family Connected'}
            </h4>
            <p className="text-xs text-slate-400">
              {trustedContacts.length > 0
                ? `${trustedContacts[0].name} (${trustedContacts[0].relationship}) is connected.`
                : 'Connect your children to review suspicious messages.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('family')}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Recent Threats / Scans List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {language === 'hi' ? 'हालिया जांच' : 'Recent Threats & Scans'}
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-shield-cyan hover:underline font-semibold"
          >
            {language === 'hi' ? 'सभी देखें' : 'View All'}
          </button>
        </div>

        <div className="space-y-2">
          {recentScans.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-shield-card/90 border border-shield-cardBorder flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-xs">
                  {item.snippet}
                </p>
              </div>
              <RiskBadge level={item.riskLevel} language={language} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Parent Golden Safety Rules */}
      <div className="rounded-3xl bg-shield-card border border-shield-cardBorder p-5 space-y-3">
        <h3 className="text-sm font-bold text-shield-teal uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {t.safetyTipsTitle}
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-0.5">1. {t.tip1Title}</span>
            <p className="text-slate-400 leading-relaxed">{t.tip1Desc}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-0.5">2. {t.tip2Title}</span>
            <p className="text-slate-400 leading-relaxed">{t.tip2Desc}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-0.5">3. {t.tip3Title}</span>
            <p className="text-slate-400 leading-relaxed">{t.tip3Desc}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center px-4 leading-relaxed italic">
        {t.disclaimer}
      </p>
    </div>
  );
};
