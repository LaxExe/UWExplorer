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
      <div className="max-w-[1300px] mx-auto px-6 py-2.5 flex items-center justify-between min-h-[48px]">
        {/* Left spacing for macOS traffic light buttons */}
        <div className="flex items-center gap-2.5 pl-16 md:pl-20 [app-region:no-drag]">
          <div className="w-6 h-6 border border-[var(--border)] flex items-center justify-center bg-[var(--c1)]">
            <Compass className="w-3 h-3 text-[var(--c5)]" />
          </div>
          <span className="font-mono text-xs font-semibold text-[var(--c5)] tracking-wide">
            {getTitle()}
          </span>
        </div>
      </div>
    </header>
  );
};
