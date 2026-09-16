import React, { useState } from 'react';
import { Smartphone, Bell, Check, ShieldCheck, ShieldAlert, Sparkles, Send, Info, ArrowRight } from 'lucide-react';
import { Language } from '../i18n/translations';
import { NotificationSource } from '../android/NotificationListenerStub';

interface NotificationProtectionPageProps {
  onSimulateNotification: (notif: NotificationSource) => void;
  language: Language;
}

export const NotificationProtectionPage: React.FC<NotificationProtectionPageProps> = ({
  onSimulateNotification,
  language
}) => {
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [monitoredApps, setMonitoredApps] = useState<{ [key: string]: boolean }>({
    sms: true,
    whatsapp: true,
    email: true,
    telegram: false,
    browser: false
  });
  const [lastSentSim, setLastSentSim] = useState<string | null>(null);

  const isHi = language === 'hi';

  const toggleApp = (key: string) => {
    setMonitoredApps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulate = (scenario: 'banking' | 'courier' | 'safe') => {
    let notif: NotificationSource;

    if (scenario === 'banking') {
      notif = {
        id: `notif-${Date.now()}`,
        packageName: 'com.whatsapp',
        appName: 'WhatsApp',
        title: '+91 98112 00482 (SBI Alerts)',
        text: 'URGENT! Your SBI account will be blocked today within 2 hours. Complete your KYC immediately at http://sbi-kyc-update.xyz/verify',
        timestamp: Date.now()
      };
      setLastSentSim('Banking Scam Intercepted');
    } else if (scenario === 'courier') {
      notif = {
        id: `notif-${Date.now()}`,
        packageName: 'com.google.android.apps.messaging',
        appName: 'SMS / Messages',
        title: 'VK-INDPOST',
        text: 'India Post: Your parcel #IN98124 is detained. Pay ₹25 customs clearance fee here: http://indiapost-parcel.top/pay before 6 PM.',
        timestamp: Date.now()
      };
      setLastSentSim('Courier Scam Intercepted');
    } else {
      notif = {
        id: `notif-${Date.now()}`,
        packageName: 'com.google.android.apps.messaging',
        appName: 'SMS / Messages',
        title: 'AX-HDFCBK',
        text: 'Dear Customer, your monthly e-statement is available in the official mobile app. Never share your OTP with anyone.',
        timestamp: Date.now()
      };
      setLastSentSim('Safe Notice Intercepted');
    }

    onSimulateNotification(notif);
    setTimeout(() => setLastSentSim(null), 3000);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-shield-cyan" />
          {isHi ? 'एंड्रॉयड नोटिफिकेशन सुरक्षा' : 'Notification Protection'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isHi
            ? 'आपके द्वारा चुने गए ऐप्स से आने वाले एसएमएस और संदेशों की सुरक्षा जांच'
            : 'ScamShield analyzes notifications from apps you choose to intercept scams in real-time'}
        </p>
      </div>

      {/* Protection Status Banner */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              permissionGranted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {permissionGranted ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Protection Status
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  permissionGranted ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span className="text-sm font-bold text-white">
                {permissionGranted
                  ? (isHi ? 'सक्रिय (🟢 Active)' : 'Active & Intercepting')
                  : (isHi ? 'निष्क्रिय (🔴 Inactive)' : 'Inactive / Permission Required')}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPermissionGranted(!permissionGranted)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
        >
          {permissionGranted ? 'Toggle Access' : 'Grant Permission'}
        </button>
      </div>

      {/* Choose Monitored Apps */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-shield-cyan" />
          {isHi ? 'निगरानी के लिए चुने गए ऐप्स' : 'Apps Monitored by ScamShield'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isHi
            ? 'केवल चुने हुए ऐप्स के नोटिफिकेशन की जांच की जाएगी। कोई भी निजी चैट सर्वर पर नहीं भेजी जाती।'
            : 'Notification access allows ScamShield to analyze notifications from apps you choose. Data is processed locally.'}
        </p>

        <div className="space-y-2 pt-1">
          {[
            { id: 'sms', label: 'SMS & Messaging (Google Messages)', icon: '💬' },
            { id: 'whatsapp', label: 'WhatsApp', icon: '🟢' },
            { id: 'email', label: 'Email (Gmail/Outlook)', icon: '✉️' },
            { id: 'telegram', label: 'Telegram', icon: '✈️' },
            { id: 'browser', label: 'Browser Notifications (Chrome)', icon: '🌐' }
          ].map(app => (
            <label
              key={app.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{app.icon}</span>
                <span className="text-xs font-semibold text-slate-200">{app.label}</span>
              </div>
              <input
                type="checkbox"
                checked={monitoredApps[app.id] || false}
                onChange={() => toggleApp(app.id)}
                className="w-4 h-4 accent-shield-cyan rounded cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Live Simulation for Judges */}
      <div className="bg-gradient-to-br from-slate-900 via-shield-card to-shield-navy border border-shield-cyan/40 rounded-3xl p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-shield-cyan">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isHi ? 'लाइव नोटिफिकेशन टेस्ट (डेमो सिम्युलेटर)' : 'Live Notification Intercept Simulator'}
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            Judge Demo Tool
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Simulate an incoming status-bar notification from WhatsApp or SMS. ScamShield's notification listener adapter intercepts it and immediately triggers the parental risk engine.
        </p>

        {lastSentSim && (
          <div className="p-2.5 rounded-xl bg-shield-teal/20 border border-shield-teal/40 text-shield-teal text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{lastSentSim}! Check the alert banner above.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleSimulate('banking')}
            className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-xs font-bold transition flex items-center justify-between text-left"
          >
            <span>Simulate SBI Scam Push</span>
            <Send className="w-3.5 h-3.5 text-red-400" />
          </button>
          <button
            onClick={() => handleSimulate('courier')}
            className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-200 text-xs font-bold transition flex items-center justify-between text-left"
          >
            <span>Simulate India Post Push</span>
            <Send className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => handleSimulate('safe')}
            className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition flex items-center justify-between text-left"
          >
            <span>Simulate Normal Bank Push</span>
            <Send className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Android NotificationListenerService Architecture Info */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Info className="w-4 h-4 text-shield-cyan" />
          <span>Android Technical Architecture Note:</span>
        </div>
        <p>
          Android requires user consent under <code>android.permission.BIND_NOTIFICATION_LISTENER_SERVICE</code>.
          The native Kotlin wrapper hooks <code>onNotificationPosted(sbn)</code> and dispatches <code>NotificationInput</code> payloads to ScamShield's detection pipeline.
        </p>
      </div>
    </div>
  );
};
