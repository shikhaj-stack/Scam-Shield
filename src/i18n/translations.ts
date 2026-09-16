export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appName: 'ScamShield',
    tagline: 'A Digital Bodyguard for Parents',
    subTagline: 'Check suspicious messages, links, and screenshots before you act.',
    heroSubtitle: 'Detect scams. Understand the danger. Stay safe.',
    
    // Nav
    navHome: 'Home',
    navScan: 'Scan',
    navScreenshot: 'Screenshot',
    navLink: 'Check Link',
    navHistory: 'History',
    navFamily: 'Family Alert',
    navSettings: 'Settings',
    navRoadmap: 'Roadmap',

    // Quick Actions
    actionScanMessage: 'Check a Message',
    actionScanMessageSub: 'SMS, WhatsApp, Telegram, Email',
    actionUploadScreenshot: 'Upload Screenshot',
    actionUploadScreenshotSub: 'Chat capture, bank alert screenshot',
    actionCheckLink: 'Check a Link',
    actionCheckLinkSub: 'Suspicious website or payment link',
    actionAskVoice: 'Ask by Voice',
    actionAskVoiceSub: 'Speak or ask ScamShield aloud',

    // Status Dashboard
    protectionStatus: 'Protection Status',
    scamShieldActive: 'ScamShield is Active & Guarding',
    todayActivity: "Today's Activity",
    prototypeBadge: 'Prototype Demo Data',
    scansChecked: 'Messages Checked',
    highRiskDetected: 'High-Risk Detected',
    familyAlertsSent: 'Family Alerts Prepared',

    // Safety Tips
    safetyTipsTitle: 'Parent Safety Golden Rules',
    tip1Title: 'Never Share OTP or PIN',
    tip1Desc: 'Banks and officials never ask for OTP or UPI PIN to receive money.',
    tip2Title: 'Beware of "Urgent Block" Threats',
    tip2Desc: 'Scammers invent fake urgency ("blocked in 2 hours") to cause panic.',
    tip3Title: 'Always Verify with Family First',
    tip3Desc: 'When in doubt, use ScamShield "Ask My Family" before clicking anything.',

    // Message Scanner
    scannerTitle: 'Message Scanner',
    scannerPlaceholder: 'Paste a suspicious SMS, WhatsApp message, email or payment request here...',
    btnAnalyze: 'Analyze with ScamShield',
    btnAnalyzing: 'Analyzing Scam Signals...',
    tryExamplesTitle: 'Try Demo Real-World Examples',
    clearText: 'Clear',

    // Result screen
    resultTitle: 'Safety Assessment',
    riskLevelTitle: 'Risk Level',
    whyFlaggedTitle: 'Why ScamShield Flagged This',
    recommendedActionsTitle: 'Recommended Actions for Parents',
    doThis: 'Safe Steps to Take',
    dontDoThis: 'What NOT to Do',
    btnAskFamily: '👨‍👩‍👧 Ask My Family',
    btnScanAnother: 'Check Another Message',
    btnListenAudio: 'Listen to Explanation',
    btnStopAudio: 'Stop Audio',
    localFallbackNote: 'ScamShield evaluated this using rule-based local safety checks.',

    // Risk levels
    riskLow: 'LOW RISK / LIKELY SAFE',
    riskMedium: 'MEDIUM RISK / CAUTION',
    riskHigh: 'HIGH RISK / PROBABLE SCAM',
    riskCritical: 'CRITICAL THREAT / DO NOT PROCEED',

    // Disclaimer
    disclaimer: 'ScamShield provides risk indicators and safety guidance. It does not guarantee that a message is legitimate or fraudulent. Always verify through official channels.',

    // Family
    familyTitle: 'Trusted Family Contacts',
    familySubtitle: 'Connect your trusted child or spouse so they can review suspicious messages with you.',
    addContact: 'Add Trusted Contact',
    contactName: 'Full Name',
    contactPhone: 'Mobile / WhatsApp Number',
    relationship: 'Relationship',

    // Voice
    voiceTitle: 'Voice Assistant',
    voicePrompt: 'Press mic and say your query or read the message aloud...',
    voiceListening: 'Listening to you...',
    voiceFallback: 'Speech recognition not supported in this browser. You can type or use message scanner.',

    // Common
    loading: 'Loading...',
    back: 'Back',
    copied: 'Copied to clipboard!',
    alertSentSuccess: 'Family alert card generated! Ready to share via WhatsApp/SMS.',
  },

  hi: {
    appName: 'स्कैमशील्ड (ScamShield)',
    tagline: 'माता-पिता का डिजिटल अंगरक्षक',
    subTagline: 'संदिग्ध मैसेज, लिंक और स्क्रीनशॉट पर क्लिक करने से पहले जांचें।',
    heroSubtitle: 'धोखाधड़ी पहचानें। खतरे को समझें। सुरक्षित रहें।',

    // Nav
    navHome: 'होम',
    navScan: 'मैसेज जांचें',
    navScreenshot: 'स्क्रीनशॉट',
    navLink: 'वेब लिंक',
    navHistory: 'इतिहास',
    navFamily: 'परिवार अलर्ट',
    navSettings: 'सेटिंग्स',
    navRoadmap: 'रोडमैप',

    // Quick Actions
    actionScanMessage: 'मैसेज की जांच करें',
    actionScanMessageSub: 'एसएमएस, व्हाट्सएप, टेलीग्राम मैसेज',
    actionUploadScreenshot: 'स्क्रीनशॉट अपलोड करें',
    actionUploadScreenshotSub: 'व्हाट्सएप चैट या संदेश का फोटो',
    actionCheckLink: 'वेबसाइट लिंक जांचें',
    actionCheckLinkSub: 'संदिग्ध पेमेंट या बैंक लिंक',
    actionAskVoice: 'बोलकर पूछें',
    actionAskVoiceSub: 'आवाज़ में बोलकर सवाल करें',

    // Status Dashboard
    protectionStatus: 'सुरक्षा स्थिति',
    scamShieldActive: 'स्कैमशील्ड सक्रिय है और रक्षा कर रहा है',
    todayActivity: 'आज की गतिविधि',
    prototypeBadge: 'डेमो प्रोटोटाइप डेटा',
    scansChecked: 'जांचे गए मैसेज',
    highRiskDetected: 'पहचाने गए खतरे',
    familyAlertsSent: 'परिवार अलर्ट तैयार',

    // Safety Tips
    safetyTipsTitle: 'माता-पिता के लिए सुरक्षा नियम',
    tip1Title: 'ओटीपी या पिन कभी साझा न करें',
    tip1Desc: 'बैंक या सरकारी अधिकारी पैसे देने के लिए कभी भी यूपीआई पिन या ओटीपी नहीं मांगते।',
    tip2Title: '"खाता तुरंत ब्लॉक होगा" की धमकी से सावधान',
    tip2Desc: 'धोखेबाज घबराहट पैदा करने के लिए फर्जी तात्कालिकता ("2 घंटे में ब्लॉक") का उपयोग करते हैं।',
    tip3Title: 'संदेह होने पर पहले बच्चों से पूछें',
    tip3Desc: 'किसी भी अनजान लिंक पर क्लिक करने से पहले "Ask My Family" बटन दबाएं।',

    // Message Scanner
    scannerTitle: 'मैसेज स्कैनर',
    scannerPlaceholder: 'यहां संदिग्ध एसएमएस, व्हाट्सएप संदेश या भुगतान अनुरोध पेस्ट करें...',
    btnAnalyze: 'स्कैमशील्ड से जांचें',
    btnAnalyzing: 'खतरों की पड़ताल जारी है...',
    tryExamplesTitle: 'प्रसिद्ध धोखाधड़ी उदाहरण आज़माएं',
    clearText: 'साफ़ करें',

    // Result screen
    resultTitle: 'सुरक्षा परिणाम',
    riskLevelTitle: 'जोखिम स्तर',
    whyFlaggedTitle: 'स्कैमशील्ड ने यह चेतावनी क्यों दी?',
    recommendedActionsTitle: 'माता-पिता के लिए आवश्यक कदम',
    doThis: 'ये सुरक्षित कदम उठाएं',
    dontDoThis: 'ये गलतियां बिल्कुल न करें',
    btnAskFamily: '👨‍👩‍👧 अपने परिवार से पूछें',
    btnScanAnother: 'दूसरा संदेश जांचें',
    btnListenAudio: 'आवाज़ में सुनें',
    btnStopAudio: 'आवाज़ रोकें',
    localFallbackNote: 'स्कैमशील्ड ने यह मूल्यांकन स्थानीय सुरक्षा नियमों के आधार पर किया।',

    // Risk levels
    riskLow: 'कम जोखिम / संभवतः सुरक्षित',
    riskMedium: 'मध्यम जोखिम / सावधानी बरतें',
    riskHigh: 'उच्च जोखिम / संभावित धोखाधड़ी',
    riskCritical: 'गंभीर खतरा / आगे न बढ़ें',

    // Disclaimer
    disclaimer: 'स्कैमशील्ड केवल जोखिम संकेतक और सुरक्षा मार्गदर्शन प्रदान करता है। यह आधिकारिक पुष्टि नहीं है। आधिकारिक बैंक ऐप से अवश्य पुष्टि करें।',

    // Family
    familyTitle: 'विश्वसनीय परिवार संपर्क',
    familySubtitle: 'अपने बेटे, बेटी या जीवनसाथी को जोड़ें ताकि वे आपके साथ संदेशों की जांच कर सकें।',
    addContact: 'नया संपर्क जोड़ें',
    contactName: 'नाम',
    contactPhone: 'मोबाइल / व्हाट्सएप नंबर',
    relationship: 'रिश्ता',

    // Voice
    voiceTitle: 'वॉइस सहायक',
    voicePrompt: 'माइक दबाएं और संदेश पढ़ें या सवाल पूछें...',
    voiceListening: 'आपकी बात सुन रहे हैं...',
    voiceFallback: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। आप लिखकर पूछ सकते हैं।',

    // Common
    loading: 'लोड हो रहा है...',
    back: 'वापस जाएं',
    copied: 'कॉपी कर लिया गया!',
    alertSentSuccess: 'परिवार के लिए अलर्ट कार्ड तैयार! व्हाट्सएप/एसएमएस से साझा करें।',
  },
};
