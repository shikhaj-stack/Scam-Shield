import React, { useState } from 'react';
import { X, Send, Users, ShieldAlert, Share2, Check, MessageSquare } from 'lucide-react';
import { AnalysisResult, TrustedContact } from '../types';
import { Language, translations } from '../i18n/translations';

interface FamilyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
  trustedContacts: TrustedContact[];
  language: Language;
}

export const FamilyAlertModal: React.FC<FamilyAlertModalProps> = ({
  isOpen,
  onClose,
  result,
  trustedContacts,
  language
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>(
    trustedContacts[0]?.id || ''
  );
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];
  const selectedContact = trustedContacts.find(c => c.id === selectedContactId) || trustedContacts[0];

  const alertMessage = `🛡️ [ScamShield Alert for Family]
Mom/Dad just received a message flagged as: ${result.riskLevel} (${result.category})

⚠️ Summary:
"${result.summary}"

Message Snippet:
"${result.inputContent.slice(0, 140)}..."

ScamShield Advice:
Do NOT click any link or send money until verified. Please call them to assist.`;

  const handleSimulatedSend = () => {
    setIsSent(true);
    setTimeout(() => {
      // Simulate confirmation
    }, 400);
  };

  const handleShareWhatsApp = () => {
    const phone = selectedContact?.phone.replace(/\D/g, '') || '';
    const encoded = encodeURIComponent(alertMessage);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(alertMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-shield-navy border border-shield-cardBorder rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-shield-cyan to-shield-teal flex items-center justify-center text-white shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'hi' ? 'परिवार से सुरक्षा जांच कराएं' : 'Ask My Family'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'अपने बच्चों या जीवनसाथी को संदेश भेजकर राय लें'
                : 'Send a quick safety alert to your trusted contact'}
            </p>
          </div>
        </div>

        {isSent ? (
          /* Confirmation state */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                {language === 'hi' ? 'अलर्ट तैयार और भेजा गया!' : 'Family Alert Dispatched!'}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                {language === 'hi'
                  ? `आपके ${selectedContact?.relationship || 'परिवार'} (${selectedContact?.name}) को अलर्ट सूचना भेज दी गई है।`
                  : `Notification prepared for ${selectedContact?.name} (${selectedContact?.relationship}).`}
              </p>
            </div>

            {/* Notification Preview Badge */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-left max-w-sm mx-auto flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Simulated Notification to {selectedContact?.name}:
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  "ScamShield: High-risk banking message received by Parent. Please review before they act."
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow"
              >
                <MessageSquare className="w-4 h-4" />
                {language === 'hi' ? 'व्हाट्सएप पर खोलें' : 'Share via WhatsApp'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Form state */
          <div className="space-y-4">
            {/* Contact selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {language === 'hi' ? 'किस सदस्य को अलर्ट भेजना है?' : 'Select Trusted Contact'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trustedContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      selectedContactId === contact.id
                        ? 'bg-shield-teal/15 border-shield-teal text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{contact.name}</p>
                      <p className="text-[11px] text-slate-400">{contact.relationship} • {contact.phone}</p>
                    </div>
                    {selectedContactId === contact.id && (
                      <Check className="w-4 h-4 text-shield-teal" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Preview Box */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  {language === 'hi' ? 'अलर्ट संदेश का पूर्वावलोकन' : 'Prepared Alert Message'}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[11px] text-shield-cyan hover:underline flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  {copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy Text')}
                </button>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {alertMessage}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSimulatedSend}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-shield-cyan to-shield-teal text-white text-sm font-bold shadow-lg shadow-shield-teal/20 hover:opacity-95 transition"
              >
                <Send className="w-4 h-4" />
                {language === 'hi' ? 'सुरक्षा अलर्ट भेजें' : 'Send Family Alert'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition shadow"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
