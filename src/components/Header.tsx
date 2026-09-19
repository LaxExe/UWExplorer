import React from 'react';
import { Sun, Moon, Compass } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  activeTab: string;
  settings: UserSettings;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg)] transition-colors select-none [app-region:drag]">
      <div className="max-w-[1300px] mx-auto px-6 py-2.5 flex items-center justify-between min-h-[38px]">
        {/* Empty header drag region reserving traffic lights spacing */}
        <div className="h-4" />
      </div>
    </header>
  );
};
