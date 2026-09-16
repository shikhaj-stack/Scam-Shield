import React, { useState, useRef } from 'react';
import { Image, Upload, FileText, ArrowRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { extractTextFromImage } from '../engine/ocrScanner';

interface ScreenshotScannerPageProps {
  onAnalyzeExtractedText: (text: string) => void;
  language: Language;
}

export const ScreenshotScannerPage: React.FC<ScreenshotScannerPageProps> = ({
  onAnalyzeExtractedText,
  language
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [ocrError, setOcrError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Run OCR
    setIsProcessing(true);
    setOcrError(null);
    setProgressStatus(language === 'hi' ? 'स्क्रीनशॉट से टेक्स्ट पढ़ा जा रहा है...' : 'Extracting text with OCR...');

    const res = await extractTextFromImage(file, (_progress, status) => {
      setProgressStatus(status);
    });

    setIsProcessing(false);

    if (res.text) {
      setExtractedText(res.text);
    } else {
      setOcrError(
        language === 'hi'
          ? 'टेक्स्ट स्वतः नहीं पढ़ा जा सका। आप नीचे सीधे लिख या सुधार सकते हैं।'
          : 'Could not auto-extract text cleanly. You can paste or type the message text below.'
      );
    }
  };

  const loadDemoScreenshot = (scenario: 'bank' | 'courier') => {
    if (scenario === 'bank') {
      setExtractedText(
        'SBI Security Alert: Dear customer, your YONO account is locked. Update your PAN card immediately: http://sbi-pan-kyc.top/login to restore access.'
      );
      setImagePreview('https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60');
    } else {
      setExtractedText(
        'India Post Alert: Package ID 77192 cannot be delivered due to wrong address. Update address & pay 25 Rs re-delivery fee here: http://indiapost-parcel.top'
      );
      setImagePreview('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60');
    }
    setOcrError(null);
  };

  const handleAnalyze = () => {
    if (!extractedText.trim()) return;
    onAnalyzeExtractedText(extractedText.trim());
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Image className="w-5 h-5 text-shield-teal" />
          {t.actionUploadScreenshot}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {language === 'hi'
            ? 'व्हाट्सएप चैट या एसएमएस का स्क्रीनशॉट अपलोड करें। स्कैमशील्ड टेक्स्ट पढ़कर जांच करेगा।'
            : 'Upload a WhatsApp chat, SMS or email screenshot. ScamShield will extract the text and analyze it.'}
        </p>
      </div>

      {/* Demo sample shortcuts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-shield-cyan" />
          {language === 'hi' ? 'डेमो स्क्रीनशॉट लोड करें:' : 'Try Demo Screenshot:'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => loadDemoScreenshot('bank')}
            className="px-2.5 py-1 text-xs rounded-lg bg-shield-blue hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Bank Scam
          </button>
          <button
            onClick={() => loadDemoScreenshot('courier')}
            className="px-2.5 py-1 text-xs rounded-lg bg-shield-blue hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Courier Scam
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-shield-card border-2 border-dashed border-shield-cardBorder hover:border-shield-teal/60 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition group shadow-md"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-shield-teal/15 text-shield-teal flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
          <Upload className="w-8 h-8" />
        </div>

        <h4 className="text-base font-bold text-white mb-1">
          {language === 'hi' ? 'स्क्रीनशॉट चुनने के लिए टैप करें' : 'Tap to Select Screenshot'}
        </h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          {language === 'hi'
            ? 'गैलरी से व्हाट्सएप, एसएमएस या बैंक संदेश की फोटो चुनें'
            : 'Select WhatsApp, SMS, or Telegram screenshot from photo library'}
        </p>
      </div>

      {/* Image Preview & OCR Status */}
      {imagePreview && (
        <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-4 flex flex-col sm:flex-row gap-4 items-center">
          <img
            src={imagePreview}
            alt="Screenshot Preview"
            className="w-full sm:w-32 h-36 object-cover rounded-2xl border border-slate-700"
          />
          <div className="flex-1 w-full">
            <span className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'hi' ? 'अपलोड किया गया स्क्रीनशॉट' : 'Selected Screenshot Preview'}
            </span>
            {isProcessing ? (
              <div className="flex items-center gap-2 text-xs text-shield-teal font-medium py-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{progressStatus}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'टेक्स्ट निकाला जा चुका है। नीचे दिए गए टेक्स्ट की पुष्टि करें और जांच बटन दबाएं।'
                  : 'Image parsed. Review extracted text below and proceed to analyze.'}
              </p>
            )}
          </div>
        </div>
      )}

      {ocrError && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{ocrError}</span>
        </div>
      )}

      {/* Extracted / Editable Text Area */}
      <div className="bg-shield-card border border-shield-cardBorder rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-shield-cyan" />
            {language === 'hi' ? 'निकाला गया टेक्स्ट (आप सुधार सकते हैं):' : 'Extracted Text (Editable):'}
          </label>
          <span className="text-[10px] text-slate-400">Parent-Friendly Fallback</span>
        </div>

        <textarea
          rows={5}
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'स्क्रीनशॉट से टेक्स्ट यहाँ दिखेगा। यदि आवश्यक हो तो आप इसमें बदलाव कर सकते हैं...'
              : 'Text extracted from screenshot will appear here. You can manually edit or refine before checking...'
          }
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-shield-cyan resize-none leading-relaxed"
        />

        <div className="mt-4">
          <button
            onClick={handleAnalyze}
            disabled={!extractedText.trim() || isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-shield-cyan to-shield-teal text-white font-bold text-sm shadow-lg shadow-shield-teal/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <Image className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्क्रीनशॉट टेक्स्ट की जांच करें' : 'Analyze Screenshot Text'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
