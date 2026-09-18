import React from 'react';
import { LayoutDashboard, CalendarDays, ExternalLink, Bell, CheckSquare, Calendar as CalendarIcon, Settings as SettingsIcon } from 'lucide-react';

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
    { id: 'schedule', label: 'schedule', icon: CalendarDays },
    { id: 'links', label: 'quick links', icon: ExternalLink },
    { id: 'announcements', label: 'announcements', icon: Bell, badge: announcementsCount },
    { id: 'assignments', label: 'assignments', icon: CheckSquare, badge: assignmentsCount },
    { id: 'calendar', label: 'calendar', icon: CalendarIcon },
    { id: 'settings', label: 'settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--bg)] min-h-0 md:min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between shrink-0">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 mb-2 border-b border-[var(--border)]">
          <span className="font-sans font-bold text-sm text-[var(--c5)] tracking-wider">
            UWEXPLORER
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`uw-button w-full justify-between min-h-[40px] px-3.5 ${
                  isActive ? 'active text-[var(--c5)] font-semibold border-[var(--c3)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 flex justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--c4)]" />
                  </div>
                  <span className="text-left font-mono text-xs">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="uw-tag font-mono text-[0.6rem] py-0 px-1.5 border-[var(--border)] bg-amber-500/10 text-amber-600 font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
