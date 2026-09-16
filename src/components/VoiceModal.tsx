import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeVoiceText: (text: string) => void;
  language: Language;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeVoiceText,
  language
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const t = translations[language];

  useEffect(() => {
    if (!isOpen) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. You can type your question below.');
        } else {
          setErrorMessage('Speech recognition ended. You can review or edit below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    } else {
      setErrorMessage(t.voiceFallback);
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionInstance) {
      setErrorMessage(t.voiceFallback);
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setErrorMessage(null);
      try {
        recognitionInstance.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleProceed = () => {
    if (!transcript.trim()) return;
    onAnalyzeVoiceText(transcript.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-shield-navy border border-shield-cardBorder rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-shield-cyan to-shield-teal flex items-center justify-center text-white mx-auto shadow-lg mb-3">
          <Volume2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {language === 'hi' ? 'आवाज़ में पूछें (Voice Assistant)' : 'Ask ScamShield by Voice'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {language === 'hi'
            ? 'माइक दबाएं और संदेश बोलें या पूछें "क्या यह मैसेज सुरक्षित है?"'
            : 'Speak suspicious message text or ask "Is this payment safe?"'}
        </p>

        {/* Big Mic Button */}
        <div className="relative inline-block mb-6">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-shield-teal/30 animate-ping" />
          )}
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition shadow-xl ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-tr from-shield-cyan to-shield-teal text-white hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-300 mb-3">
          {isListening ? t.voiceListening : (language === 'hi' ? 'माइक पर टैप करके बोलना शुरू करें' : 'Tap microphone to speak')}
        </p>

        {errorMessage && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 mb-4 text-xs text-amber-300 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Spoken Text / Input Box */}
        <div className="text-left mb-5">
          <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            {language === 'hi' ? 'पहचाना गया टेक्स्ट (आप लिख भी सकते हैं):' : 'Captured Speech / Question:'}
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={language === 'hi' ? 'बोलें या यहाँ टाइप करें...' : 'Speak or type here...'}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-shield-cyan resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={handleProceed}
            disabled={!transcript.trim()}
            className="flex-1 py-2.5 bg-gradient-to-r from-shield-cyan to-shield-teal disabled:opacity-40 text-white text-xs font-bold rounded-xl transition shadow"
          >
            {language === 'hi' ? 'स्कैमशील्ड से जांचें' : 'Analyze Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
