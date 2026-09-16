import React from 'react';
import { Home, MessageSquare, Image, Link2, Users, ShieldAlert, Settings, Sparkles } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

export type TabId = 'home' | 'scan' | 'screenshot' | 'link' | 'qr' | 'notification' | 'history' | 'family' | 'settings' | 'roadmap' | 'privacy' | 'tests';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, language }) => {
  const t = translations[language];

  const navItems: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'scan', label: t.navScan, icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'screenshot', label: t.navScreenshot, icon: <Image className="w-5 h-5" /> },
    { id: 'link', label: t.navLink, icon: <Link2 className="w-5 h-5" /> },
    { id: 'family', label: t.navFamily, icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: t.navSettings, icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-shield-navy/95 backdrop-blur-lg border-t border-shield-cardBorder px-2 py-1 sm:py-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-shield-cyan font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-shield-cyan/15 text-shield-cyan' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5 truncate max-w-[55px] text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
