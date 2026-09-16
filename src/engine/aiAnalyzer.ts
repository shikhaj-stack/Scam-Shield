import { AnalysisResult, RiskLevel, ScamCategory } from '../types';
import { analyzeMessageLocally } from './riskEngine';

interface AiApiResponse {
  riskLevel: RiskLevel;
  riskScore: number;
  category: ScamCategory;
  summary: string;
  summaryHi?: string;
  signals: Array<{
    type: 'urgency' | 'financial' | 'credential' | 'url' | 'impersonation' | 'context';
    severity: 'high' | 'medium' | 'low';
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    matchedText?: string;
  }>;
  recommendedActions: {
    safe: string[];
    safeHi?: string[];
    avoid: string[];
    avoidHi?: string[];
  };
  language: 'en' | 'hi';
}

export async function analyzeContentWithFallback(
  text: string,
  inputType: 'message' | 'screenshot' | 'link' = 'message',
  preferredLanguage: 'en' | 'hi' = 'en'
): Promise<AnalysisResult> {
  // Check if an AI key is saved in LocalStorage or configured via environment
  const savedApiKey = typeof window !== 'undefined' ? localStorage.getItem('scamshield_ai_key') : null;
  const envApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_OPENAI_API_KEY;
  const apiKey = savedApiKey || envApiKey;

  // If no API key is provided, instantly use local rule-based engine (100% offline & fast for demo)
  if (!apiKey) {
    const localResult = analyzeMessageLocally(text, inputType);
    localResult.language = preferredLanguage;
    return localResult;
  }

  try {
    // Attempt Gemini or standard LLM endpoint if configured
    const prompt = `You are ScamShield, an AI digital bodyguard protecting elderly parents from scams in India.
Analyze this message for fraud/phishing signals:
"${text}"

Return STRICT JSON matching this schema:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number (0 to 100),
  "category": "Banking / KYC" | "UPI / Payment" | "Courier / Delivery" | "Government / Tax" | "Job / Work From Home" | "Investment / Crypto" | "Prize / Lottery" | "Account / Login" | "Family Impersonation" | "Utility / Electricity" | "Other",
  "summary": "Simple clear explanation in English for an older parent",
  "summaryHi": "सरल हिंदी व्याख्या माता-पिता के लिए",
  "signals": [
    {
      "type": "urgency" | "financial" | "credential" | "url" | "impersonation" | "context",
      "severity": "high" | "medium" | "low",
      "title": "Short title",
      "titleHi": "छोटा शीर्षक",
      "description": "Parent-friendly reason",
      "descriptionHi": "हिंदी कारण"
    }
  ],
  "recommendedActions": {
    "safe": ["action 1", "action 2"],
    "safeHi": ["कदम 1", "कदम 2"],
    "avoid": ["avoid 1", "avoid 2"],
    "avoidHi": ["बचें 1", "बचें 2"]
  }
}
Do not accuse legitimate messages solely for containing words like "bank" or "KYC" unless urgent threats or unverified links exist.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) {
      throw new Error('Empty AI response body');
    }

    const parsed: AiApiResponse = JSON.parse(rawJson);

    return {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      inputContent: text,
      inputType,
      riskLevel: parsed.riskLevel || 'MEDIUM',
      riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 50,
      category: parsed.category || 'Other',
      summary: parsed.summary || 'ScamShield analyzed this message.',
      summaryHi: parsed.summaryHi || 'स्कैमशील्ड ने इस संदेश का विश्लेषण किया।',
      signals: parsed.signals.map((s, idx) => ({
        id: `ai-sig-${idx}`,
        type: s.type || 'context',
        severity: s.severity || 'medium',
        title: s.title || 'Indicator',
        titleHi: s.titleHi || 'संकेत',
        description: s.description || '',
        descriptionHi: s.descriptionHi || '',
        matchedText: s.matchedText
      })),
      recommendedActions: {
        safe: parsed.recommendedActions?.safe || ['Verify through official app.'],
        safeHi: parsed.recommendedActions?.safeHi || ['आधिकारिक ऐप से जांच करें।'],
        avoid: parsed.recommendedActions?.avoid || ['Do not share OTP.'],
        avoidHi: parsed.recommendedActions?.avoidHi || ['ओटीपी कभी न दें।']
      },
      language: preferredLanguage,
      isLocalFallback: false
    };
  } catch (err) {
    console.warn('AI analysis unavailable or timed out, seamlessly using local detection engine:', err);
    const localResult = analyzeMessageLocally(text, inputType);
    localResult.isLocalFallback = true;
    localResult.language = preferredLanguage;
    return localResult;
  }
}
