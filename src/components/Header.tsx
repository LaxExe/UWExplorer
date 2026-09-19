import React from 'react';
import { Sun, Moon, Compass } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  activeTab: string;
  settings: UserSettings;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  settings,
  onToggleTheme,
}) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'courses': return 'Course Tracker & To-Do List';
      case 'schedule': return "Today's Class Schedule";
      case 'links': return 'Quick Links';
      case 'calendar': return 'Semester Calendar';
      case 'settings': return 'Settings';
      default: return 'UWexplorer';
    }
  };

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg)] transition-colors select-none [app-region:drag]">
      <div className="max-w-[1300px] mx-auto px-6 py-3 flex items-center justify-between min-h-[52px]">
        {/* Left spacing for macOS traffic light buttons (close/min/maximize) */}
        <div className="flex items-center gap-3 pl-16 md:pl-20 [app-region:no-drag]">
          <div className="w-7 h-7 border border-[var(--border)] flex items-center justify-center bg-[var(--c1)]">
            <Compass className="w-3.5 h-3.5 text-[var(--c5)]" />
          </div>
          <h1 className="text-base font-bold font-sans text-[var(--c5)] tracking-tight">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3 [app-region:no-drag]">
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
      </div>
    </header>
  );
};
