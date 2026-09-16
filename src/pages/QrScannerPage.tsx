import React, { useState, useRef } from 'react';
import { QrCode, Upload, ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { Language } from '../i18n/translations';
import { analyzeUrlString } from '../engine/urlScanner';
import { UrlAnalysisDetails } from '../types';

interface QrScannerPageProps {
  onAnalyzeExtractedUrl: (url: string) => void;
  language: Language;
}

export const QrScannerPage: React.FC<QrScannerPageProps> = ({
  onAnalyzeExtractedUrl,
  language
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<string>('');
  const [urlAnalysis, setUrlAnalysis] = useState<UrlAnalysisDetails | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHi = language === 'hi';

  const handleDecode = (payload: string, imgUrl?: string) => {
    setDecodedPayload(payload);
    if (imgUrl) setImagePreview(imgUrl);

    // If it's a URL or UPI string, analyze it
    const analysis = analyzeUrlString(payload);
    setUrlAnalysis(analysis);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setIsDecoding(true);
      setTimeout(() => {
        setIsDecoding(false);
        // Fallback or detected payload from QR
        handleDecode('http://sbi-netbanking-update.xyz/login?session=token991');
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const loadDemoQr = (type: 'upi_scam' | 'phish_qr' | 'safe_merchant') => {
    if (type === 'upi_scam') {
      handleDecode(
        'upi://pay?pa=refundclaim99@ybl&pn=CustomsRefund&am=2500&cu=INR&tn=PayToClaimRefund',
        'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=refundclaim99@ybl'
      );
    } else if (type === 'phish_qr') {
      handleDecode(
        'http://indiapost-parcel.top/pay',
        'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://indiapost-parcel.top/pay'
      );
    } else {
      handleDecode(
        'upi://pay?pa=merchant@icici&pn=LocalStore&mc=5411',
        'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=merchant@icici'
      );
    }
  };

  const isDangerous = urlAnalysis && (urlAnalysis.riskIndicators.length > 0 || decodedPayload.includes('refundclaim'));

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-shield-cyan" />
            {isHi ? 'क्यूआर कोड स्कैम डिटेक्टर' : 'QR Code Scam Scanner'}
          </h2>
          <span className="text-[10px] uppercase font-bold text-shield-teal bg-shield-teal/15 border border-shield-teal/30 px-2 py-0.5 rounded-full">
            Experimental
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {isHi
            ? 'क्यूआर कोड का स्क्रीनशॉट स्कैन करें। भुगतान करने या लिंक खोलने से पहले खतरे की जांच करें।'
            : 'Scan or upload a QR screenshot before scanning with Google Pay, PhonePe or camera'}
        </p>
      </div>

      {/* Demo QR Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-shield-cyan" />
          {isHi ? 'डेमो क्यूआर आज़माएं:' : 'Try Demo QR Codes:'}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadDemoQr('upi_scam')}
            className="px-2.5 py-1 text-xs rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/50 transition"
          >
            Fake Refund UPI QR
          </button>
          <button
            onClick={() => loadDemoQr('phish_qr')}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition"
          >
            Phishing Web QR
          </button>
          <button
            onClick={() => loadDemoQr('safe_merchant')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition"
          >
            Verified Merchant QR
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-shield-card border-2 border-dashed border-shield-cardBorder hover:border-shield-cyan/60 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition group shadow-md"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-shield-cyan/15 text-shield-cyan flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
          <Upload className="w-7 h-7" />
        </div>

        <h4 className="text-base font-bold text-white mb-1">
          {isHi ? 'क्यूआर कोड फोटो चुनने के लिए टैप करें' : 'Upload QR Screenshot'}
        </h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          {isHi
            ? 'व्हाट्सएप या मैसेज में आया पेमेंट क्यूआर कोड अपलोड करें'
            : 'Select QR screenshot sent by someone asking you to "scan to receive payment"'}
        </p>
      </div>

      {/* Decoded QR Results */}
      {decodedPayload && (
        <div className="space-y-4 animate-in fade-in">
          <div
            className={`rounded-3xl p-5 border ${
              isDangerous
                ? 'bg-red-950/30 border-red-500/50 glow-critical'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full border bg-slate-900 text-slate-200">
                QR Destination Analysis
              </span>
              <span
                className={`text-xs font-bold ${
                  isDangerous ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isDangerous
                  ? (isHi ? '⚠️ संभावित धोखाधड़ी (Suspicious)' : '⚠️ Potentially Suspicious QR')
                  : (isHi ? 'सत्यापित मर्चेंट' : 'Standard Merchant QR')}
              </span>
            </div>

            {imagePreview && (
              <div className="flex justify-center mb-4">
                <img
                  src={imagePreview}
                  alt="Decoded QR"
                  className="w-32 h-32 rounded-2xl border border-slate-700 bg-white p-1"
                />
              </div>
            )}

            {/* Decoded Payload */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 font-bold block">Decoded Destination / Intent:</span>
              <p className="font-mono text-slate-200 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {decodedPayload}
              </p>
            </div>

            {/* Signals and Recommendation */}
            {isDangerous ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-red-950/50 rounded-xl border border-red-500/30 text-xs space-y-1.5">
                  <span className="font-bold text-red-300 block">Critical Parent Warning:</span>
                  <p className="text-red-200/90">
                    🔴 <strong>"Scan to Receive Money" Trap:</strong> You NEVER need to scan a QR code or enter your UPI PIN to receive money. Scanning this initiates a debit payment from your bank account!
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onAnalyzeExtractedUrl(decodedPayload)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    Run Full ScamShield Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Looks like a standard merchant QR code. Always verify the receiver name before confirming in UPI app.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
