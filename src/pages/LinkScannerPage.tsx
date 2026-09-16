import React, { useState } from 'react';
import { Link2, ShieldAlert, CheckCircle2, AlertTriangle, Globe, Lock, Unlock, ArrowRight, ExternalLink } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { analyzeUrlString } from '../engine/urlScanner';
import { UrlAnalysisDetails } from '../types';

interface LinkScannerPageProps {
  language: Language;
}

export const LinkScannerPage: React.FC<LinkScannerPageProps> = ({ language }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [analysis, setAnalysis] = useState<UrlAnalysisDetails | null>(null);

  const t = translations[language];
  const isHi = language === 'hi';

  const handleScan = (urlToScan?: string) => {
    const target = urlToScan || inputUrl;
    if (!target.trim()) return;
    const res = analyzeUrlString(target.trim());
    setAnalysis(res);
  };

  const handleDemoLink = (url: string) => {
    setInputUrl(url);
    handleScan(url);
  };

  const isDangerous = analysis && analysis.riskIndicators.length > 0;

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-shield-amber" />
          {t.actionCheckLink}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isHi
            ? 'किसी भी अज्ञात वेब लिंक की सत्यता और सुरक्षा जांचें'
            : 'Inspect domain name, encryption status and impersonation red flags'}
        </p>
      </div>

      {/* Demo Links */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
        <span className="text-xs font-semibold text-slate-300 block mb-2">
          {isHi ? 'प्रसिद्ध डेमो लिंक आज़माएं:' : 'Try Sample Links:'}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDemoLink('http://sbi-kyc-update.xyz/login')}
            className="px-2.5 py-1 text-xs rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/50 transition font-mono"
          >
            sbi-kyc-update.xyz
          </button>
          <button
            onClick={() => handleDemoLink('http://indiapost-parcel.top/pay')}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition font-mono"
          >
            indiapost-parcel.top
          </button>
          <button
            onClick={() => handleDemoLink('https://onlinesbi.sbi')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition font-mono"
          >
            onlinesbi.sbi (Official)
          </button>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-4 sm:p-5 shadow-xl">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
          {isHi ? 'संदिग्ध लिंक पेस्ट करें' : 'Paste Suspicious Link'}
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. http://sbi-bank-verify.xyz/update"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-shield-cyan transition font-mono"
            />
          </div>
          <button
            onClick={() => handleScan()}
            disabled={!inputUrl.trim()}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-shield-cyan to-shield-teal text-white font-bold text-sm shadow-lg shadow-shield-teal/20 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <span>{isHi ? 'लिंक जांचें' : 'Scan Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-4 animate-in fade-in">
          <div
            className={`rounded-3xl p-5 border ${
              isDangerous
                ? 'bg-red-950/30 border-red-500/50'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span
                className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${
                  isDangerous
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {isDangerous
                  ? (isHi ? 'उच्च जोखिम संकेतक मिले' : 'High-Risk Indicators Detected')
                  : (isHi ? 'सत्यापित सुरक्षित पैटर्न' : 'Standard Web Domain')}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-300 font-mono">
                {analysis.isHttps ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Lock className="w-3.5 h-3.5" /> HTTPS Encrypted
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400">
                    <Unlock className="w-3.5 h-3.5" /> Not Secure (HTTP)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Extracted Domain:</span>
                <span className="text-slate-100 font-bold break-all">{analysis.domain}</span>
              </div>
              {analysis.impersonatedBrand && (
                <div className="flex justify-between border-b border-slate-800 pb-2 text-red-300">
                  <span>Impersonation Target:</span>
                  <span className="font-bold">{analysis.impersonatedBrand}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Security Protocol:</span>
                <span className={analysis.isHttps ? 'text-emerald-400' : 'text-red-400'}>
                  {analysis.protocol}
                </span>
              </div>
            </div>

            {/* Red Flags List */}
            {analysis.riskIndicators.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  {isHi ? 'जांच में पाए गए खतरे:' : 'Detected Risk Signals:'}
                </h4>
                {analysis.riskIndicators.map((ind, i) => (
                  <div key={i} className="text-xs text-red-200/90 flex items-start gap-2 bg-red-950/40 p-2.5 rounded-xl border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {isHi
                    ? 'इस डोमेन में सामान्य फ़िशिंग या शॉर्टनर पैटर्न नहीं मिले।'
                    : 'No obvious phishing markers or deceptive TLD extensions detected.'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
