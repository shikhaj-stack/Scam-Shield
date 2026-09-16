export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamCategory =
  | 'Banking / KYC'
  | 'UPI / Payment'
  | 'Courier / Delivery'
  | 'Government / Tax'
  | 'Job / Work From Home'
  | 'Investment / Crypto'
  | 'Prize / Lottery'
  | 'Account / Login'
  | 'Family Impersonation'
  | 'Utility / Electricity'
  | 'Other';

export interface ScamSignal {
  id: string;
  type: 'urgency' | 'financial' | 'credential' | 'url' | 'impersonation' | 'context';
  severity: 'high' | 'medium' | 'low';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  matchedText?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  inputContent: string;
  inputType: 'message' | 'screenshot' | 'link';
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 normalized explainable score
  category: ScamCategory;
  summary: string;
  summaryHi: string;
  signals: ScamSignal[];
  recommendedActions: {
    safe: string[];
    safeHi: string[];
    avoid: string[];
    avoidHi: string[];
  };
  language: 'en' | 'hi';
  isLocalFallback: boolean;
  urlAnalysis?: UrlAnalysisDetails;
}

export interface UrlAnalysisDetails {
  rawUrl: string;
  domain: string;
  protocol: string;
  isHttps: boolean;
  hasIpAddress: boolean;
  hasSuspiciousTld: boolean;
  isShortener: boolean;
  impersonatedBrand?: string;
  subdomainCount: number;
  riskIndicators: string[];
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: 'Son' | 'Daughter' | 'Spouse' | 'Relative' | 'Other';
  phone: string;
  notifyOnHighRisk: boolean;
}

export interface ThreatHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  category: ScamCategory;
  riskLevel: RiskLevel;
  riskScore: number;
  snippet: string;
  inputType: 'message' | 'screenshot' | 'link';
}
