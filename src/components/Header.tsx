import React from 'react';
import { Sun, Moon, RefreshCw, Compass } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  activeTab: string;
  settings: UserSettings;
  onToggleTheme: () => void;
  onSyncD2L: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  settings,
  onToggleTheme,
  onSyncD2L,
  isSyncing,
}) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'schedule': return "Today's Schedule";
      case 'links': return 'Quick Links';
      case 'announcements': return 'Announcements';
      case 'assignments': return 'Assignments & Deadlines';
      case 'calendar': return 'Calendar';
      case 'settings': return 'Settings';
      default: return 'UWexplorer';
    }
  };

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg)] px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border border-[var(--border)] flex items-center justify-center bg-[var(--c1)]">
          <Compass className="w-4 h-4 text-[var(--c5)]" />
        </div>
        <h1 className="text-lg font-bold font-sans text-[var(--c5)] tracking-tight">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {settings.d2lFeedUrl && (
          <button
            onClick={onSyncD2L}
            disabled={isSyncing}
            className="uw-button text-xs"
            title="Sync D2L Calendar Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'syncing...' : 'sync d2l'}</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="uw-button"
          aria-label="Toggle theme"
          title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} theme`}
        >
          {settings.theme === 'light' ? (
            <Moon className="w-4 h-4 text-[var(--c5)]" />
          ) : (
            <Sun className="w-4 h-4 text-[var(--c5)]" />
          )}
          <span>{settings.theme === 'light' ? 'dark' : 'light'}</span>
        </button>
      </div>
    </header>
  );
};
