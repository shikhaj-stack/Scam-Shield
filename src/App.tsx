import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabId } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { MessageScannerPage } from './pages/MessageScannerPage';
import { ResultPage } from './pages/ResultPage';
import { ScreenshotScannerPage } from './pages/ScreenshotScannerPage';
import { LinkScannerPage } from './pages/LinkScannerPage';
import { ThreatHistoryPage } from './pages/ThreatHistoryPage';
import { FamilyPage } from './pages/FamilyPage';
import { SettingsPage } from './pages/SettingsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { NotificationProtectionPage } from './pages/NotificationProtectionPage';
import { QrScannerPage } from './pages/QrScannerPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { TestRunnerPage } from './pages/TestRunnerPage';
import { FamilyAlertModal } from './components/FamilyAlertModal';
import { VoiceModal } from './components/VoiceModal';
import { ThreatAlert } from './components/ThreatAlert';
import { AnalysisResult, ThreatHistoryItem, TrustedContact } from './types';
import { Language } from './i18n/translations';
import { analyzeContentWithFallback } from './engine/aiAnalyzer';
import { analyzeMessageLocally } from './engine/riskEngine';
import { NotificationSource, androidNotificationAdapter } from './android/NotificationListenerStub';

// Initial prototype seed data
const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: 'c-1',
    name: 'Aarav Sharma (Son)',
    relationship: 'Son',
    phone: '+91 98765 43210',
    notifyOnHighRisk: true
  },
  {
    id: 'c-2',
    name: 'Pooja Sharma (Daughter)',
    relationship: 'Daughter',
    phone: '+91 98123 45678',
    notifyOnHighRisk: true
  }
];

const DEFAULT_HISTORY: ThreatHistoryItem[] = [
  {
    id: 'hist-1',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    title: 'SBI KYC Block Notice',
    category: 'Banking / KYC',
    riskLevel: 'HIGH',
    riskScore: 84,
    snippet: 'URGENT! Your SBI account will be blocked today within 2 hours. Update KYC at http://sbi-update.xyz',
    inputType: 'message'
  },
  {
    id: 'hist-2',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    title: 'India Post Delivery Fee',
    category: 'Courier / Delivery',
    riskLevel: 'HIGH',
    riskScore: 78,
    snippet: 'Package detained at hub. Pay ₹25 customs fee to prevent return.',
    inputType: 'message'
  },
  {
    id: 'hist-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // Yesterday
    title: 'Monthly Statement Alert',
    category: 'Banking / KYC',
    riskLevel: 'LOW',
    riskScore: 12,
    snippet: 'Your monthly statement is available in the official banking app.',
    inputType: 'message'
  }
];

export function App() {
  const [currentTab, setCurrentTab] = useState<TabId | 'result'>('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('scamshield_lang') as Language) || 'en';
  });

  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => {
    const saved = localStorage.getItem('scamshield_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  const [history, setHistory] = useState<ThreatHistoryItem[]>(() => {
    const saved = localStorage.getItem('scamshield_history');
    return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
  });

  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [activeThreatPopup, setActiveThreatPopup] = useState<AnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isFamilyAlertModalOpen, setIsFamilyAlertModalOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('scamshield_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('scamshield_contacts', JSON.stringify(trustedContacts));
  }, [trustedContacts]);

  useEffect(() => {
    localStorage.setItem('scamshield_history', JSON.stringify(history));
  }, [history]);

  // Hook Android Notification Adapter listener
  useEffect(() => {
    const unsubscribe = androidNotificationAdapter.registerListener((result, source) => {
      // If result is high or critical risk, popup the ThreatAlert component
      if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
        setActiveThreatPopup(result);
      }

      // Record in history
      const historyItem: ThreatHistoryItem = {
        id: result.id,
        timestamp: result.timestamp,
        title: `${result.category} (${source.appName})`,
        category: result.category,
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        snippet: source.text.slice(0, 90) + (source.text.length > 90 ? '...' : ''),
        inputType: 'message'
      };
      setHistory(prev => [historyItem, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleAnalyzeText = async (text: string, inputType: 'message' | 'screenshot' | 'link' = 'message') => {
    setIsLoadingAnalysis(true);
    try {
      const result = await analyzeContentWithFallback(text, inputType, language);
      setCurrentResult(result);
      setCurrentTab('result');

      // Append to history
      const historyItem: ThreatHistoryItem = {
        id: result.id,
        timestamp: result.timestamp,
        title: `${result.category} Assessment`,
        category: result.category,
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        snippet: text.slice(0, 90) + (text.length > 90 ? '...' : ''),
        inputType
      };

      setHistory(prev => [historyItem, ...prev]);
    } catch (err) {
      console.error('Analysis error:', err);
      const localRes = analyzeMessageLocally(text, inputType);
      setCurrentResult(localRes);
      setCurrentTab('result');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSimulateNotification = (notif: NotificationSource) => {
    const res = androidNotificationAdapter.handleIncomingNotification(notif);
    if (res.riskLevel === 'HIGH' || res.riskLevel === 'CRITICAL') {
      setActiveThreatPopup(res);
    } else {
      setCurrentResult(res);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scamshield_history');
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setHistory([]);
    setTrustedContacts(DEFAULT_CONTACTS);
    setCurrentResult(null);
    setCurrentTab('home');
  };

  const handleAddContact = (contact: TrustedContact) => {
    setTrustedContacts(prev => [...prev, contact]);
  };

  const handleRemoveContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSelectHistoryItem = (item: ThreatHistoryItem) => {
    const simulated = analyzeMessageLocally(item.snippet, item.inputType);
    setCurrentResult(simulated);
    setCurrentTab('result');
  };

  return (
    <div className="min-h-screen bg-shield-navy text-slate-100 flex flex-col font-sans pb-20 sm:pb-24">
      {/* Top App Header */}
      <Header
        language={language}
        onToggleLanguage={handleLanguageChange}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onNavigateRoadmap={() => setCurrentTab('roadmap')}
      />

      {/* Floating Threat Alert Banner (Auto-pops up on intercepted high-risk push notifications) */}
      {activeThreatPopup && (
        <ThreatAlert
          result={activeThreatPopup}
          onViewAnalysis={() => {
            setCurrentResult(activeThreatPopup);
            setActiveThreatPopup(null);
            setCurrentTab('result');
          }}
          onAskFamily={() => {
            setCurrentResult(activeThreatPopup);
            setActiveThreatPopup(null);
            setIsFamilyAlertModalOpen(true);
          }}
          onDismiss={() => setActiveThreatPopup(null)}
          language={language}
        />
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            language={language}
            recentScans={history}
            trustedContacts={trustedContacts}
          />
        )}

        {currentTab === 'scan' && (
          <MessageScannerPage
            onAnalyze={(text) => handleAnalyzeText(text, 'message')}
            isLoading={isLoadingAnalysis}
            language={language}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            initialText={prefilledMessage}
          />
        )}

        {currentTab === 'result' && currentResult && (
          <ResultPage
            result={currentResult}
            onScanAnother={() => {
              setPrefilledMessage('');
              setCurrentTab('scan');
            }}
            onAskFamily={() => setIsFamilyAlertModalOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'screenshot' && (
          <ScreenshotScannerPage
            onAnalyzeExtractedText={(text) => handleAnalyzeText(text, 'screenshot')}
            language={language}
          />
        )}

        {currentTab === 'link' && (
          <LinkScannerPage language={language} />
        )}

        {currentTab === 'qr' && (
          <QrScannerPage
            onAnalyzeExtractedUrl={(url) => handleAnalyzeText(url, 'link')}
            language={language}
          />
        )}

        {currentTab === 'notification' && (
          <NotificationProtectionPage
            onSimulateNotification={handleSimulateNotification}
            language={language}
          />
        )}

        {currentTab === 'history' && (
          <ThreatHistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onSelectItem={handleSelectHistoryItem}
            language={language}
          />
        )}

        {currentTab === 'family' && (
          <FamilyPage
            contacts={trustedContacts}
            onAddContact={handleAddContact}
            onRemoveContact={handleRemoveContact}
            recentAlerts={history}
            language={language}
          />
        )}

        {currentTab === 'settings' && (
          <div className="space-y-4">
            <SettingsPage
              onClearAllData={handleClearAllData}
              language={language}
            />
            {/* Quick shortcuts to Privacy Center and Test Runner */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setCurrentTab('privacy')}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-shield-teal transition text-left"
              >
                🔒 Open Privacy Center
              </button>
              <button
                onClick={() => setCurrentTab('tests')}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-bold text-shield-cyan transition text-left"
              >
                🧪 Run 20-Case Test Suite
              </button>
            </div>
          </div>
        )}

        {currentTab === 'privacy' && (
          <PrivacyCenterPage
            onBack={() => setCurrentTab('settings')}
            onClearHistory={handleClearHistory}
            language={language}
          />
        )}

        {currentTab === 'tests' && (
          <TestRunnerPage
            onBack={() => setCurrentTab('settings')}
            language={language}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapPage language={language} />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        currentTab={currentTab === 'result' ? 'scan' : currentTab}
        onSelectTab={(tab) => {
          if (tab === 'scan') setPrefilledMessage('');
          setCurrentTab(tab);
        }}
        language={language}
      />

      {/* Voice Assistant Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAnalyzeVoiceText={(text) => handleAnalyzeText(text, 'message')}
        language={language}
      />

      {/* Ask My Family Escalation Modal */}
      {currentResult && (
        <FamilyAlertModal
          isOpen={isFamilyAlertModalOpen}
          onClose={() => setIsFamilyAlertModalOpen(false)}
          result={currentResult}
          trustedContacts={trustedContacts}
          language={language}
        />
      )}
    </div>
  );
}

export default App;
