import React from 'react';

interface HeaderProps {
  activeTab: string;
  settings: any;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)] transition-colors select-none [app-region:drag]">
      <div className="max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between min-h-[54px]">
        {/* Balanced spacing reserving centered alignment for macOS traffic lights */}
        <div className="h-5 flex items-center pl-20" />
      </div>
    </header>
  );
};
