import { AnalysisResult, RiskLevel, ScamCategory, ScamSignal } from '../types';
import { analyzeUrlString } from './urlScanner';

// Words that indicate urgency
const URGENCY_PATTERNS = [
  { regex: /\b(immediately|urgent|urgently|today|within \d+ (hours?|mins?|minutes?)|final warning|act now|hurry|last chance|expir(es|ed|ing)|blocked within|suspended today|deactivate[d]?)\b/i, weight: 25, labelEn: 'Urgent Threat / Time Pressure', labelHi: 'तुरंत कार्रवाई का फर्जी दबाव' },
  { regex: /\b(account (will be|has been) (blocked|suspended|closed|frozen|deactivated))\b/i, weight: 30, labelEn: 'Account Freeze Threat', labelHi: 'खाता ब्लॉक होने की धमकी' },
  { regex: /\b(electricity|power|bijli) (will be disconnected|cut off tonight|bill unpaid)\b/i, weight: 35, labelEn: 'Utility Disconnection Threat', labelHi: 'बिजली कटने की धमकी' }
];

// Words indicating financial pressure or requests
const FINANCIAL_PATTERNS = [
  { regex: /\b(pay|payment|transfer|refund|upi|rupees|inr|rs\.?|₹|\$|cashback|bonus|lottery|prize|won \d+|credited|deducted|charges)\b/i, weight: 20, labelEn: 'Financial Transaction Trigger', labelHi: 'पैसों के लेन-देन से जुड़ी बात' },
  { regex: /\b(customs duty|parcel fee|delivery charges?|pending fee)\b/i, weight: 25, labelEn: 'Courier / Delivery Fee Demand', labelHi: 'पार्सल या डिलीवरी शुल्क की मांग' },
  { regex: /\b(part-time job|earn (daily|per day|monthly|from home)|telegram task|like youtube)\b/i, weight: 30, labelEn: 'Work-from-Home Job Scam Hook', labelHi: 'घर बैठे पैसे कमाने का फर्जी ऑफर' }
];

// Words indicating credential requests (CRITICAL)
const CREDENTIAL_PATTERNS = [
  { regex: /\b(otp|one time password|pin|mpin|upi pin|password|cvv|card number|expiry date)\b/i, weight: 35, labelEn: 'Sensitive Credential Request', labelHi: 'ओटीपी / पिन / पासवर्ड की मांग' },
  { regex: /\b(kyc|update kyc|kyc expired|pan card|aadhaar card|verify identity|re-kyc)\b/i, weight: 25, labelEn: 'KYC Verification Trigger', labelHi: 'केवाईसी नवीनीकरण का बहाना' },
  { regex: /\b(download apk|install app|anydesk|teamviewer|rustdesk|quicksupport|screenshare)\b/i, weight: 40, labelEn: 'Remote Access / Malicious APK Request', labelHi: 'संदिग्ध ऐप या रिमोट एक्सेस डाउनलोड' }
];

// Brand Impersonation patterns
const IMPERSONATION_PATTERNS = [
  { regex: /\b(sbi|hdfc|icici|axis|pnb|bob|kotak|canara|union bank|rbi|reserve bank of india)\b/i, brand: 'Bank', weight: 20, labelEn: 'Major Bank Mention', labelHi: 'प्रमुख बैंक का नाम इस्तेमाल' },
  { regex: /\b(paytm|phonepe|google pay|gpay|bhim|cred)\b/i, brand: 'UPI Provider', weight: 20, labelEn: 'UPI Payment App Mention', labelHi: 'यूपीआई पेमेंट ऐप का नाम' },
  { regex: /\b(india post|delhivery|blue dart|fedex|dhl|dtdc|amazon|flipkart)\b/i, brand: 'Courier / Delivery', weight: 20, labelEn: 'Courier / Shopping Impersonation', labelHi: 'कूरियर या डिलीवरी कंपनी का नाम' },
  { regex: /\b(income tax|challan|police|cbi|ed|court|ncrb|customs)\b/i, brand: 'Government Authority', weight: 30, labelEn: 'Law Enforcement / Government Impersonation', labelHi: 'सरकारी विभाग / पुलिस का डर' },
  { regex: /\b(hi mom|hi dad|hello mom|hello dad|lost my phone|new number|send money to my friend)\b/i, brand: 'Family Member', weight: 35, labelEn: 'Family Impersonation', labelHi: 'परिवार के सदस्य बनकर ठगी' }
];

// Legitimate signals that REDUCE risk (False Positive Protection)
const SAFE_CONTEXT_PATTERNS = [
  { regex: /\b(official (app|website|branch)|visit your nearest branch|through the official (mobile|bank) app)\b/i, scoreReduction: 25, label: 'Mentions official bank app or in-person branch' },
  { regex: /\b(do not share (this )?otp|never share otp|bank never asks for otp)\b/i, scoreReduction: 30, label: 'Contains standard bank anti-fraud disclaimer' },
  { regex: /\b(monthly account statement|e-statement|account balance is)\b/i, scoreReduction: 20, label: 'Standard informational bank statement format' }
];

export function analyzeMessageLocally(rawText: string, inputType: 'message' | 'screenshot' | 'link' = 'message'): AnalysisResult {
  const text = rawText.trim();
  const signals: ScamSignal[] = [];
  let rawScore = 0;

  // 1. URL Analysis
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|site|app|cc|info|biz|me|online|live|ru|cn|in|co|link|pw|icu)(?:\/[^\s]*)?)/gi;
  const urlsFound = text.match(urlRegex) || [];
  
  let primaryUrlAnalysis;
  let hasSuspiciousUrl = false;

  if (urlsFound.length > 0 && urlsFound[0]) {
    primaryUrlAnalysis = analyzeUrlString(urlsFound[0]);
    if (primaryUrlAnalysis.riskIndicators.length > 0 || !primaryUrlAnalysis.isHttps || primaryUrlAnalysis.hasSuspiciousTld || primaryUrlAnalysis.isShortener) {
      hasSuspiciousUrl = true;
      rawScore += 35;
      signals.push({
        id: 'sig-url',
        type: 'url',
        severity: 'high',
        title: 'Unverified or Suspicious Link',
        titleHi: 'अनजान या संदिग्ध वेब लिंक',
        description: `Message includes a link (${primaryUrlAnalysis.domain}) that does not match verified official bank domains.`,
        descriptionHi: `संदेश में ऐसा लिंक (${primaryUrlAnalysis.domain}) है जो आधिकारिक बैंक वेबसाइट से मेल नहीं खाता।`,
        matchedText: urlsFound[0]
      });
    } else {
      rawScore += 10;
      signals.push({
        id: 'sig-url-detected',
        type: 'url',
        severity: 'medium',
        title: 'External Web Link Included',
        titleHi: 'बाहरी वेब लिंक मौजूद',
        description: 'Contains a clickable link. Always check domain authenticity before clicking.',
        descriptionHi: 'संदेश में एक लिंक है। क्लिक करने से पहले वेबसाइट नाम ध्यान से देखें।',
        matchedText: urlsFound[0]
      });
    }
  }

  // 2. Urgency signals
  let hasUrgency = false;
  for (const pattern of URGENCY_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      hasUrgency = true;
      rawScore += pattern.weight;
      signals.push({
        id: `sig-urg-${signals.length}`,
        type: 'urgency',
        severity: pattern.weight >= 30 ? 'high' : 'medium',
        title: pattern.labelEn,
        titleHi: pattern.labelHi,
        description: `Creates artificial urgency: "${match[0]}". Scammers use deadlines to stop you from thinking or consulting family.`,
        descriptionHi: `तुरंत घबराहट पैदा करने का प्रयास: "${match[0]}"। धोखेबाज जल्दबाजी में फैसला कराने के लिए समयसीमा देते हैं।`,
        matchedText: match[0]
      });
      break; // One primary urgency signal is sufficient
    }
  }

  // 3. Credential requests
  let hasCredentials = false;
  let hasApkDownload = false;
  for (const pattern of CREDENTIAL_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      hasCredentials = true;
      if (match[0].toLowerCase().includes('apk') || match[0].toLowerCase().includes('anydesk') || match[0].toLowerCase().includes('teamviewer')) {
        hasApkDownload = true;
      }
      rawScore += pattern.weight;
      signals.push({
        id: `sig-cred-${signals.length}`,
        type: 'credential',
        severity: 'high',
        title: pattern.labelEn,
        titleHi: pattern.labelHi,
        description: `Requests sensitive identity or credential verification (${match[0]}). Legitimate institutions never request OTP/PIN over SMS or chat.`,
        descriptionHi: `गोपनीय जानकारी (${match[0]}) की मांग की गई है। असली बैंक कभी भी एसएमएस या व्हाट्सएप पर ओटीपी/पिन नहीं मांगते।`,
        matchedText: match[0]
      });
      break;
    }
  }

  // 4. Financial requests
  let hasFinancial = false;
  for (const pattern of FINANCIAL_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      hasFinancial = true;
      rawScore += pattern.weight;
      signals.push({
        id: `sig-fin-${signals.length}`,
        type: 'financial',
        severity: 'medium',
        title: pattern.labelEn,
        titleHi: pattern.labelHi,
        description: `References money movement, payment, or refunds (${match[0]}).`,
        descriptionHi: `पैसों के लेन-देन या रिफंड का जिक्र (${match[0]}) है।`,
        matchedText: match[0]
      });
      break;
    }
  }

  // 5. Impersonation
  let detectedBrand: string | undefined;
  for (const pattern of IMPERSONATION_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      detectedBrand = pattern.brand;
      rawScore += pattern.weight;
      signals.push({
        id: `sig-imp-${signals.length}`,
        type: 'impersonation',
        severity: pattern.weight >= 30 ? 'high' : 'medium',
        title: pattern.labelEn,
        titleHi: pattern.labelHi,
        description: `Claims association with ${pattern.brand} ("${match[0]}"). Scammers masquerade as trusted entities.`,
        descriptionHi: `${pattern.brand} के नाम का दावा ("${match[0]}"). धोखेबाज सरकारी या बैंक जैसी संस्थाओं का झूठा सहारा लेते हैं।`,
        matchedText: match[0]
      });
      break;
    }
  }

  // 6. FALSE-POSITIVE MITIGATION
  // If the message is a legitimate bank statement or advises using official app without an external suspicious link
  let safeReduction = 0;
  for (const safePattern of SAFE_CONTEXT_PATTERNS) {
    if (safePattern.regex.test(text)) {
      safeReduction += safePattern.scoreReduction;
      signals.push({
        id: `sig-safe-${signals.length}`,
        type: 'context',
        severity: 'low',
        title: 'Legitimate Safety Context',
        titleHi: 'वैध सुरक्षा संकेत',
        description: safePattern.label,
        descriptionHi: 'संदेश में आधिकारिक ऐप या बैंक की वैध सुरक्षा चेतावनी शामिल है।'
      });
    }
  }

  // Important rule: A message containing just "KYC" or "Bank" with NO suspicious URL, NO urgency, NO payment demand is LOW or MEDIUM, NOT HIGH!
  if (!hasSuspiciousUrl && !hasUrgency && !hasApkDownload && safeReduction > 0) {
    rawScore = Math.max(10, rawScore - safeReduction);
  } else if (!hasSuspiciousUrl && !hasUrgency && !hasApkDownload && text.toLowerCase().includes('official')) {
    rawScore = Math.min(rawScore, 28);
  }

  // Determine category
  let category: ScamCategory = 'Other';
  const lowerText = text.toLowerCase();
  if (lowerText.includes('bijli') || lowerText.includes('electricity') || lowerText.includes('power officer')) {
    category = 'Utility / Electricity';
  } else if (lowerText.includes('kyc') || lowerText.includes('bank') || lowerText.includes('sbi') || lowerText.includes('hdfc') || lowerText.includes('icici') || lowerText.includes('account blocked')) {
    category = 'Banking / KYC';
  } else if (lowerText.includes('upi') || lowerText.includes('phonepe') || lowerText.includes('paytm') || lowerText.includes('gpay') || lowerText.includes('cashback') || lowerText.includes('refund')) {
    category = 'UPI / Payment';
  } else if (lowerText.includes('parcel') || lowerText.includes('courier') || lowerText.includes('package') || lowerText.includes('delivery') || lowerText.includes('customs') || lowerText.includes('india post')) {
    category = 'Courier / Delivery';
  } else if (lowerText.includes('job') || lowerText.includes('part-time') || lowerText.includes('earn per day') || lowerText.includes('telegram task')) {
    category = 'Job / Work From Home';
  } else if (lowerText.includes('lottery') || lowerText.includes('won') || lowerText.includes('prize') || lowerText.includes('winner') || lowerText.includes('kbc')) {
    category = 'Prize / Lottery';
  } else if (lowerText.includes('tax') || lowerText.includes('challan') || lowerText.includes('police') || lowerText.includes('cbi') || lowerText.includes('court')) {
    category = 'Government / Tax';
  } else if (lowerText.includes('mom') || lowerText.includes('dad') || lowerText.includes('new number') || lowerText.includes('hospital emergency')) {
    category = 'Family Impersonation';
  } else if (lowerText.includes('password') || lowerText.includes('login') || lowerText.includes('verify your account')) {
    category = 'Account / Login';
  }

  // Normalize final score between 5 and 96 (avoid claiming 100% or 0% certainty)
  let normalizedScore = Math.min(96, Math.max(8, rawScore));

  // If only a safe message was provided with no alarming flags
  if (signals.length === 0 || (signals.every(s => s.type === 'context') && !hasSuspiciousUrl)) {
    normalizedScore = 12;
  }

  // Determine Risk Level (0-29 LOW, 30-59 MEDIUM, 60-79 HIGH, 80-100 CRITICAL)
  let riskLevel: RiskLevel = 'LOW';
  if (normalizedScore >= 80) {
    riskLevel = 'CRITICAL';
  } else if (normalizedScore >= 60) {
    riskLevel = 'HIGH';
  } else if (normalizedScore >= 30) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // Recommended actions based on risk
  const safeActionsEn: string[] = [];
  const safeActionsHi: string[] = [];
  const avoidActionsEn: string[] = [];
  const avoidActionsHi: string[] = [];

  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    safeActionsEn.push('Verify directly through the official bank or service application, not through links in this message.');
    safeActionsEn.push('Call the official customer support number printed on the back of your debit card or passbook.');
    safeActionsEn.push('Press "Ask My Family" below so your son, daughter, or spouse can check this message with you.');

    safeActionsHi.push('संदेश के किसी भी लिंक पर न जाएं। केवल बैंक के आधिकारिक मोबाइल ऐप से जांच करें।');
    safeActionsHi.push('अपने एटीएम कार्ड के पीछे लिखे आधिकारिक हेल्पलाइन नंबर पर कॉल करके पूछताछ करें।');
    safeActionsHi.push('नीचे दिया गया "अपने परिवार से पूछें" बटन दबाएं ताकि आपके बच्चे इस संदेश की जांच कर सकें।');

    avoidActionsEn.push('Do not click any link or open attached files.');
    avoidActionsEn.push('Never share OTP, UPI PIN, or banking passwords with anyone.');
    avoidActionsEn.push('Do not install apps (like AnyDesk, QuickSupport, or APK files) requested in the message.');

    avoidActionsHi.push('संदेश में दिए गए किसी भी लिंक या फाइल पर क्लिक न करें।');
    avoidActionsHi.push('किसी के भी साथ अपना ओटीपी, यूपीआई पिन या बैंक पासवर्ड साझा न करें।');
    avoidActionsHi.push('कहे जाने पर कोई भी ऐप (जैसे AnyDesk, APK फाइल) फोन में इंस्टॉल न करें।');
  } else if (riskLevel === 'MEDIUM') {
    safeActionsEn.push('Check the sender phone number or email address carefully.');
    safeActionsEn.push('Open the official app directly if you need to update any information.');
    safeActionsEn.push('Share with a family member before taking any action.');

    safeActionsHi.push('भेजने वाले का मोबाइल नंबर या ईमेल आईडी ध्यान से जांचें।');
    safeActionsHi.push('यदि कोई जानकारी अपडेट करनी है, तो सीधे आधिकारिक ऐप खोलें।');
    safeActionsHi.push('कोई भी कदम उठाने से पहले परिवार के किसी सदस्य को दिखाएं।');

    avoidActionsEn.push('Do not make urgent payments or transfer fees.');
    avoidActionsEn.push('Do not enter personal passwords on unfamiliar web pages.');

    avoidActionsHi.push('जल्दबाजी में कोई भी शुल्क या भुगतान न करें।');
    avoidActionsHi.push('किसी अनजान वेब पेज पर अपना पासवर्ड या जानकारी न भरें।');
  } else {
    safeActionsEn.push('This message contains standard informational patterns with no immediate red flags.');
    safeActionsEn.push('Always practice safe habits: banks never request your password or PIN via SMS.');

    safeActionsHi.push('इस संदेश में कोई सीधा खतरा नहीं मिला है, यह सामान्य सूचनात्मक संदेश प्रतीत होता है।');
    safeActionsHi.push('सुरक्षा नियम याद रखें: बैंक कभी भी एसएमएस पर आपका पिन या पासवर्ड नहीं मांगते।');

    avoidActionsEn.push('Never send money to an unknown person requesting an advance fee.');
    avoidActionsHi.push('अज्ञात व्यक्ति को कभी भी अग्रिम राशि न भेजें।');
  }

  // Summary explanations
  let summary = '';
  let summaryHi = '';

  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    summary = `This message appears suspicious because it creates urgency and asks for financial/credential action or directs you to an unverified link.`;
    summaryHi = `यह संदेश अत्यधिक संदिग्ध लग रहा है क्योंकि इसमें तुरंत कार्रवाई का दबाव बनाया गया है और किसी अनजान लिंक या जानकारी की मांग की गई है।`;
  } else if (riskLevel === 'MEDIUM') {
    summary = `This message contains potential risk indicators (such as payment references or generic alerts). Exercise caution before responding.`;
    summaryHi = `इस संदेश में सावधानी बरतने योग्य कुछ संकेत मिले हैं। बिना पुष्टि किए कोई कदम न उठाएं।`;
  } else {
    summary = `This message does not exhibit common scam patterns. It uses standard informative phrasing, but always stay mindful of unexpected requests.`;
    summaryHi = `इस संदेश में धोखाधड़ी के सामान्य लक्षण नहीं मिले हैं। यह सूचनात्मक संदेश लग रहा है, फिर भी सतर्क रहें।`;
  }

  return {
    id: `scan-${Date.now()}`,
    timestamp: Date.now(),
    inputContent: text,
    inputType,
    riskLevel,
    riskScore: normalizedScore,
    category,
    summary,
    summaryHi,
    signals,
    recommendedActions: {
      safe: safeActionsEn,
      safeHi: safeActionsHi,
      avoid: avoidActionsEn,
      avoidHi: avoidActionsHi
    },
    language: 'en',
    isLocalFallback: true,
    urlAnalysis: primaryUrlAnalysis
  };
}
