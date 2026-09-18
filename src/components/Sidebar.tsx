import React from 'react';
import { LayoutDashboard, ExternalLink, Bell, CheckSquare, Calendar as CalendarIcon, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assignmentsCount: number;
  announcementsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  assignmentsCount,
  announcementsCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'links', label: 'quick links', icon: ExternalLink },
    { id: 'announcements', label: 'announcements', icon: Bell, badge: announcementsCount },
    { id: 'assignments', label: 'assignments', icon: CheckSquare, badge: assignmentsCount },
    { id: 'calendar', label: 'calendar', icon: CalendarIcon },
    { id: 'settings', label: 'settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg)] min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 mb-2 border-b border-[var(--border)]">
          <span className="text-[0.68rem] font-mono text-[var(--c3)] tracking-widest uppercase">
            UWEXPLORER v1.0
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`uw-button w-full justify-between min-h-[38px] ${isActive ? 'active text-[var(--c5)] font-semibold border-[var(--c3)]' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[var(--c4)]" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="uw-tag font-mono text-[0.6rem] py-0 px-1.5 border-[var(--border)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border border-[var(--border)] bg-[var(--c1)] flex flex-col gap-1">
        <span className="mono-label">system status</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-xs text-[var(--c4)]">D2L Feed Ready</span>
        </div>
        <p className="font-mono text-[0.68rem] text-[var(--c3)] mt-1">
          Waterloo Learn sync active via client iCal parser.
        </p>
      </div>
    </aside>
  );
};
