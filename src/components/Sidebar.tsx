import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ExternalLink,
  CheckSquare,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingTasksCount: number;
  sidebarOrder: string[];
  onReorderSidebar: (newOrder: string[]) => void;
}

const ALL_NAV_ITEMS: Record<string, { label: string; icon: React.ElementType }> = {
  dashboard: { label: 'dashboard', icon: LayoutDashboard },
  courses: { label: 'courses & todo', icon: BookOpen },
  schedule: { label: 'schedule', icon: CalendarDays },
  links: { label: 'quick links', icon: ExternalLink },
  calendar: { label: 'calendar', icon: CalendarIcon },
  settings: { label: 'settings', icon: SettingsIcon },
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  sidebarOrder,
  onReorderSidebar,
}) => {
  const [isReordering, setIsReordering] = useState(false);

  const currentOrder = [
    ...sidebarOrder.filter(id => ALL_NAV_ITEMS[id]),
    ...Object.keys(ALL_NAV_ITEMS).filter(id => !sidebarOrder.includes(id)),
  ];

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    onReorderSidebar(newOrder);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    onReorderSidebar(newOrder);
  };

  return (
    <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--bg)] min-h-0 md:min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between shrink-0">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 mb-2 border-b border-[var(--border)] flex items-center justify-between">
          <span className="font-sans font-bold text-sm text-[var(--c5)] tracking-wider">
            UWEXPLORER
          </span>

          <button
            onClick={() => setIsReordering(!isReordering)}
            className={`text-[var(--c3)] hover:text-[var(--c5)] p-1 rounded transition-colors ${
              isReordering ? 'text-[var(--c5)] bg-[var(--c1)]' : ''
            }`}
            title="Rearrange sidebar tab order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {isReordering && (
          <div className="px-3 py-1 mb-2 bg-[var(--c1)]/50 border border-[var(--border)] font-mono text-[0.68rem] text-[var(--c3)]">
            Use arrows to reorder tabs:
          </div>
        )}

        <nav className="flex flex-col gap-1.5">
          {currentOrder.map((id, index) => {
            const itemConfig = ALL_NAV_ITEMS[id];
            if (!itemConfig) return null;

            const Icon = itemConfig.icon;
            const isActive = activeTab === id;

            let badge = undefined;
            if (id === 'courses') badge = pendingTasksCount;

            return (
              <div key={id} className="flex items-center gap-1 group w-full">
                <button
                  onClick={() => setActiveTab(id)}
                  className={`uw-button flex-1 justify-between min-h-[40px] px-3.5 ${
                    isActive ? 'active text-[var(--c5)] font-semibold border-[var(--c3)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 flex justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[var(--c4)]" />
                    </div>
                    <span className="text-left font-mono text-xs">{itemConfig.label}</span>
                  </div>

                  {badge !== undefined && badge > 0 && (
                    <span className="uw-tag font-mono text-[0.6rem] py-0 px-1.5 border-[var(--border)] bg-amber-500/10 text-amber-600 font-bold shrink-0">
                      {badge}
                    </span>
                  )}
                </button>

                {isReordering && (
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={(e) => handleMoveUp(index, e)}
                      disabled={index === 0}
                      className="p-0.5 border border-[var(--border)] text-[var(--c3)] hover:text-[var(--c5)] disabled:opacity-30"
                      title="Move tab up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleMoveDown(index, e)}
                      disabled={index === currentOrder.length - 1}
                      className="p-0.5 border border-[var(--border)] text-[var(--c3)] hover:text-[var(--c5)] disabled:opacity-30"
                      title="Move tab down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
