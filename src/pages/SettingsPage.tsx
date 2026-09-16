import React, { useState } from 'react';
import { Settings, Shield, Lock, Bell, Smartphone, Trash2, Key, Check, Info } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { MONITORED_APPS, androidNotificationAdapter } from '../android/NotificationListenerStub';

interface SettingsPageProps {
  onClearAllData: () => void;
  language: Language;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onClearAllData,
  language
}) => {
  const [apiKey, setApiKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('scamshield_ai_key') || '' : ''
  );
  const [keySaved, setKeySaved] = useState(false);
  const [androidAccess, setAndroidAccess] = useState(
    androidNotificationAdapter.getStatus().permissionGranted
  );

  const t = translations[language];
  const isHi = language === 'hi';

  const handleSaveApiKey = () => {
    localStorage.setItem('scamshield_ai_key', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleToggleAndroid = () => {
    const next = !androidAccess;
    setAndroidAccess(next);
    androidNotificationAdapter.setPermissionGranted(next);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-shield-cyan" />
          {t.navSettings} & Privacy
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isHi ? 'डेटा गोपनीयता, एंड्रॉयड एकीकरण और सुरक्षा नियंत्रण' : 'Privacy principles, Android listener architecture, and controls'}
        </p>
      </div>

      {/* Privacy Policy & Transparency Card */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-shield-teal" />
          {isHi ? 'गोपनीयता नीति (Privacy Architecture)' : 'Privacy Architecture & Minimum Data'}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isHi
            ? 'स्कैमशील्ड "न्यूनतम आवश्यक डेटा" सिद्धांत पर काम करता है। आपका डेटा स्थानीय रूप से प्रोसेस किया जाता है।'
            : 'ScamShield adheres to the principle of "minimum necessary data". All rule evaluations run locally in your browser/device without uploading personal chats to centralized servers.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="font-bold text-shield-teal block mb-0.5">Local First</span>
            <span className="text-slate-400">Analysis runs instantly via the built-in rule engine even offline.</span>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="font-bold text-shield-teal block mb-0.5">No Secret Logging</span>
            <span className="text-slate-400">Threat history is stored in local browser storage only and can be purged anytime.</span>
          </div>
        </div>
      </div>

      {/* Android Notification Integration Architecture */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-shield-cyan" />
            {isHi ? 'एंड्रॉयड नोटिफिकेशन सुरक्षा (मॉड्यूलर)' : 'Android Notification Listener Integration'}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shield-cyan/15 text-shield-cyan border border-shield-cyan/30">
            Modular Adapter
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isHi
            ? 'जब एंड्रॉयड ऐप के रूप में संकलित किया जाता है, तो यह NotificationListenerService के जरिए आने वाले एसएमएस और व्हाट्सएप संदेशों की स्वचालित जांच करता है।'
            : 'ScamShield architecture is wired to Android\'s NotificationListenerService. The user must explicitly grant permission before any notification is analyzed.'}
        </p>

        {/* Permission Toggle Simulation */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">
              Notification Listener Permission
            </span>
            <span className="text-[11px] text-slate-400">
              {androidAccess ? 'Granted by user (Simulation Active)' : 'Explicit user consent required'}
            </span>
          </div>
          <button
            onClick={handleToggleAndroid}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              androidAccess
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {androidAccess ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Monitored Apps Grid */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Supported Target Apps:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MONITORED_APPS.map((app) => (
              <div key={app.packageName} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2">
                <span>{app.icon}</span>
                <span className="text-xs text-slate-300 font-medium truncate">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional AI Configuration */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-shield-amber" />
          {isHi ? 'वैकल्पिक एआई एपीआई कुंजी (Optional AI API Key)' : 'Optional Cloud AI Enhancement'}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isHi
            ? 'यदि आप क्लाउड एआई (Gemini API) जोड़ना चाहते हैं तो कुंजी दर्ज करें। इसके बिना भी स्थानीय इंजन 100% काम करता है।'
            : 'ScamShield works 100% offline out-of-the-box using rule-based scoring. You can optionally attach a Gemini API key for hybrid LLM explanations.'}
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (Gemini API Key)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-shield-cyan"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2.5 bg-shield-cyan hover:bg-shield-teal text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            {keySaved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{keySaved ? (isHi ? 'सुरक्षित!' : 'Saved!') : (isHi ? 'सहेजें' : 'Save')}</span>
          </button>
        </div>
      </div>

      {/* Clear Data & Reset */}
      <div className="bg-red-950/20 border border-red-500/30 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-red-400">
            {isHi ? 'स्थानीय डेटा साफ़ करें' : 'Reset & Clear Demo Data'}
          </h4>
          <p className="text-xs text-red-200/80 mt-0.5">
            {isHi ? 'सभी सहेजे गए स्कैन और परिवार संपर्क हटाता है' : 'Purge all cached scans, demo items, and contact entries'}
          </p>
        </div>
        <button
          onClick={onClearAllData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isHi ? 'साफ़ करें' : 'Clear Data'}</span>
        </button>
      </div>

      {/* Legal & Security Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed italic">
        <strong>Security Disclaimer:</strong> {t.disclaimer}
      </div>
    </div>
  );
};
