import React, { useState } from 'react';
import { Users, Plus, Trash2, CheckCircle2, ShieldAlert, Phone, Heart, Send, Eye, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { ThreatHistoryItem, TrustedContact } from '../types';
import { Language, translations } from '../i18n/translations';
import { RiskBadge } from '../components/RiskBadge';

interface FamilyPageProps {
  contacts: TrustedContact[];
  onAddContact: (contact: TrustedContact) => void;
  onRemoveContact: (id: string) => void;
  recentAlerts: ThreatHistoryItem[];
  language: Language;
}

export const FamilyPage: React.FC<FamilyPageProps> = ({
  contacts,
  onAddContact,
  onRemoveContact,
  recentAlerts,
  language
}) => {
  const [activeView, setActiveView] = useState<'parent' | 'member'>('parent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<TrustedContact['relationship']>('Son');
  const [testSent, setTestSent] = useState<string | null>(null);

  const t = translations[language];
  const isHi = language === 'hi';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddContact({
      id: `contact-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      notifyOnHighRisk: true
    });

    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  const handleSendTestAlert = (contact: TrustedContact) => {
    setTestSent(contact.id);
    setTimeout(() => setTestSent(null), 3000);
  };

  const latestHighRisk = recentAlerts.find(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL');

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* View Switcher: Parent View vs Family Member View */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-shield-cyan" />
            {t.familyTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi ? 'माता-पिता और बच्चों का संयुक्त सुरक्षा चक्र' : 'Collaborative Family Safety Network'}
          </p>
        </div>

        {/* Dual View Toggle */}
        <div className="flex bg-slate-900 border border-slate-700/80 rounded-xl p-1">
          <button
            onClick={() => setActiveView('parent')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeView === 'parent'
                ? 'bg-shield-cyan text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? 'माता-पिता दृश्य' : 'Parent View'}
          </button>
          <button
            onClick={() => setActiveView('member')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeView === 'member'
                ? 'bg-shield-teal text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? 'संतान दृश्य (Detailed)' : 'Family View'}
          </button>
        </div>
      </div>

      {activeView === 'member' ? (
        /* FAMILY MEMBER / CHILD VIEW (More detailed & protective) */
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-gradient-to-r from-shield-blue to-shield-card border border-shield-teal/40 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-shield-teal uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Family Safety Dashboard (Child Perspective)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                🟢 Mom & Dad Protected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-xl font-bold text-white">8</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Scans Checked</p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-xl font-bold text-red-400">2</span>
                <p className="text-[10px] text-slate-400 mt-0.5">High-Risk Blocked</p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-xl font-bold text-shield-teal">1</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Alerts Escalated</p>
              </div>
            </div>

            {/* Latest Intercepted Alert */}
            {latestHighRisk ? (
              <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Latest Threat Received by Parent:
                  </span>
                  <RiskBadge level={latestHighRisk.riskLevel} language={language} size="sm" />
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {latestHighRisk.title} — {latestHighRisk.category}
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-1 bg-slate-900/80 p-2 rounded-xl">
                  "{latestHighRisk.snippet}"
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => alert(`Simulated Call: Dialing Mom to confirm safe status...`)}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Parent to Advise</span>
                  </button>
                  <button
                    onClick={() => alert('Simulated SMS: Sent "Please do not click this link, I will verify it tonight" to Mom.')}
                    className="py-2 px-3 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
                  >
                    Send Safe SMS
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* PARENT VIEW (Simple, Large touch targets, Reassuring) */
        <div className="space-y-4 animate-in fade-in">
          {/* How it works info card */}
          <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-5 flex items-start gap-3.5 shadow-sm">
            <div className="p-2.5 rounded-2xl bg-shield-cyan/15 text-shield-cyan flex-shrink-0 mt-0.5">
              <Heart className="w-6 h-6 text-shield-cyan" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {isHi ? 'आपके बच्चे हमेशा आपकी सुरक्षा के लिए तैयार हैं' : 'Your Family Is Always Here to Help'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {isHi
                  ? 'जब भी कोई अनजान बैंक या कूरियर मैसेज आए, संकोच न करें। "अपने परिवार से पूछें" बटन दबाकर तुरंत राय लें।'
                  : 'Whenever you receive an unfamiliar payment, parcel, or bank message, you don\'t have to decide alone. 1-click sends a clean summary to your children.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connected Contacts Header & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {isHi ? 'संबद्ध परिजन' : 'Trusted Contacts List'} ({contacts.length})
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-shield-cyan text-white text-xs font-bold shadow hover:opacity-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHi ? 'नया संपर्क' : 'Add Contact'}</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-2.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 rounded-3xl bg-shield-card border border-shield-cardBorder flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-800 text-shield-teal border border-slate-700/60 flex items-center justify-center font-bold text-base flex-shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shield-teal/15 text-shield-teal border border-shield-teal/30">
                    {contact.relationship}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {contact.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSendTestAlert(contact)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-shield-cyan" />
                <span>{testSent === contact.id ? (isHi ? 'भेजा गया!' : 'Test Sent!') : (isHi ? 'टेस्ट अलर्ट' : 'Test Alert')}</span>
              </button>

              <button
                onClick={() => onRemoveContact(contact.id)}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-shield-navy border border-shield-cardBorder rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              {isHi ? 'नया परिवार संपर्क जोड़ें' : 'Add Trusted Family Member'}
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.contactName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-shield-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.relationship}
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-shield-cyan"
                >
                  <option value="Son">Son (बेटा)</option>
                  <option value="Daughter">Daughter (बेटी)</option>
                  <option value="Spouse">Spouse (जीवनसाथी)</option>
                  <option value="Relative">Relative (रिश्तेदार)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.contactPhone}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-shield-cyan"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-shield-cyan to-shield-teal text-white rounded-xl text-xs font-bold shadow transition"
                >
                  {isHi ? 'सहेजें' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
