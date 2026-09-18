import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Schedule } from './pages/Schedule';
import { QuickLinks } from './pages/QuickLinks';
import { Announcements } from './pages/Announcements';
import { Assignments } from './pages/Assignments';
import { CalendarView } from './pages/CalendarView';
import { Settings } from './pages/Settings';

import { QuickLink, Announcement, Assignment, ScheduleItem, UserSettings } from './types';
import { INITIAL_QUICK_LINKS, INITIAL_ANNOUNCEMENTS, INITIAL_ASSIGNMENTS, INITIAL_SCHEDULE, DEFAULT_COURSE_COLORS } from './data/mockData';
import { fetchD2LFeed } from './services/d2lSync';

const DEFAULT_SIDEBAR_ORDER = ['dashboard', 'schedule', 'links', 'announcements', 'assignments', 'calendar', 'settings'];

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Persistent settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('uwexplorer_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          courseColors: parsed.courseColors || DEFAULT_COURSE_COLORS,
          sidebarOrder: parsed.sidebarOrder || DEFAULT_SIDEBAR_ORDER,
        };
      } catch (e) {}
    }
    return {
      theme: 'light',
      d2lFeedUrl: '',
      lastSyncedAt: null,
      courseColors: DEFAULT_COURSE_COLORS,
      sidebarOrder: DEFAULT_SIDEBAR_ORDER,
    };
  });

  // Persistent quick links state
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const savedLinks = localStorage.getItem('uwexplorer_quick_links');
    if (savedLinks) {
      try { return JSON.parse(savedLinks); } catch (e) {}
    }
    return INITIAL_QUICK_LINKS;
  });

  // Persistent schedule state
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('uwexplorer_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SCHEDULE;
  });

  // Persistent announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('uwexplorer_announcements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Persistent assignments state
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('uwexplorer_assignments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ASSIGNMENTS;
  });

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('uwexplorer_settings', JSON.stringify(settings));
  }, [settings]);

  // Save quick links
  useEffect(() => {
    localStorage.setItem('uwexplorer_quick_links', JSON.stringify(quickLinks));
  }, [quickLinks]);

  // Save schedule
  useEffect(() => {
    localStorage.setItem('uwexplorer_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Save assignments
  useEffect(() => {
    localStorage.setItem('uwexplorer_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Save announcements
  useEffect(() => {
    localStorage.setItem('uwexplorer_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const handleUpdateSettings = (newPartial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newPartial }));
  };

  const handleReorderSidebar = (newOrder: string[]) => {
    setSettings(prev => ({ ...prev, sidebarOrder: newOrder }));
  };

  const handleToggleAssignment = (id: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  const handleAddAssignment = (newAsgn: Omit<Assignment, 'id'>) => {
    const item: Assignment = {
      ...newAsgn,
      id: `manual-${Date.now()}`,
    };
    setAssignments(prev => [item, ...prev]);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleReadAnnouncement = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, isRead: !a.isRead } : a))
    );
  };

  const handleMarkAllAnnouncementsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleAddQuickLink = (newLink: Omit<QuickLink, 'id'>) => {
    const item: QuickLink = {
      ...newLink,
      id: `link-${Date.now()}`,
      isCustom: true,
    };
    setQuickLinks(prev => [...prev, item]);
  };

  const handleUpdateQuickLink = (id: string, updated: Partial<QuickLink>) => {
    setQuickLinks(prev => prev.map(l => (l.id === id ? { ...l, ...updated } : l)));
  };

  const handleRemoveQuickLink = (id: string) => {
    setQuickLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleAddScheduleItem = (newItem: Omit<ScheduleItem, 'id'>) => {
    const item: ScheduleItem = {
      ...newItem,
      id: `sch-${Date.now()}`,
    };
    setSchedule(prev => [...prev, item]);
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const handleSyncD2L = async () => {
    if (!settings.d2lFeedUrl) return;

    setIsSyncing(true);
    setSyncMessage('Fetching and parsing D2L calendar feed...');

    const res = await fetchD2LFeed(settings.d2lFeedUrl);
    setIsSyncing(false);

    if (res.error) {
      setSyncMessage(`Sync Notice: ${res.error}`);
    } else {
      const fetchedIds = new Set(res.assignments.map(a => a.id));
      const existingNonD2L = assignments.filter(a => !fetchedIds.has(a.id));
      setAssignments([...res.assignments, ...existingNonD2L]);
      setSettings(prev => ({
        ...prev,
        lastSyncedAt: new Date().toISOString(),
      }));
      setSyncMessage(`Successfully fetched ${res.assignments.length} deadline(s) from D2L Learn feed!`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset to default sample data?')) {
      setAssignments(INITIAL_ASSIGNMENTS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setQuickLinks(INITIAL_QUICK_LINKS);
      setSchedule(INITIAL_SCHEDULE);
      setSettings({
        theme: 'light',
        d2lFeedUrl: '',
        lastSyncedAt: null,
        courseColors: DEFAULT_COURSE_COLORS,
        sidebarOrder: DEFAULT_SIDEBAR_ORDER,
      });
      localStorage.clear();
      setSyncMessage('Data reset to default Waterloo sample mode.');
    }
  };

  const unreadAnnouncementsCount = announcements.filter(a => !a.isRead).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--c5)] flex flex-col transition-colors">
      <Header
        activeTab={activeTab}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onSyncD2L={handleSyncD2L}
        isSyncing={isSyncing}
      />

      <div className="max-w-[1300px] w-full mx-auto flex-1 flex flex-col md:flex-row items-stretch">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assignmentsCount={assignments.filter(a => !a.isCompleted).length}
          announcementsCount={unreadAnnouncementsCount}
          sidebarOrder={settings.sidebarOrder || DEFAULT_SIDEBAR_ORDER}
          onReorderSidebar={handleReorderSidebar}
        />

        <main className="flex-1 p-6 overflow-y-auto w-full flex justify-center">
          <div className="w-full max-w-[1100px] mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                quickLinks={quickLinks}
                announcements={announcements}
                assignments={assignments}
                schedule={schedule}
                courseColors={settings.courseColors}
                onToggleAssignment={handleToggleAssignment}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'schedule' && (
              <Schedule
                schedule={schedule}
                courseColors={settings.courseColors}
                onAddScheduleItem={handleAddScheduleItem}
                onDeleteScheduleItem={handleDeleteScheduleItem}
              />
            )}

            {activeTab === 'links' && (
              <QuickLinks
                links={quickLinks}
                onAddLink={handleAddQuickLink}
                onUpdateLink={handleUpdateQuickLink}
                onRemoveLink={handleRemoveQuickLink}
              />
            )}

            {activeTab === 'announcements' && (
              <Announcements
                announcements={announcements}
                courseColors={settings.courseColors}
                onToggleReadAnnouncement={handleToggleReadAnnouncement}
                onMarkAllRead={handleMarkAllAnnouncementsRead}
              />
            )}

            {activeTab === 'assignments' && (
              <Assignments
                assignments={assignments}
                courseColors={settings.courseColors}
                onToggleAssignment={handleToggleAssignment}
                onAddAssignment={handleAddAssignment}
                onDeleteAssignment={handleDeleteAssignment}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                assignments={assignments}
                courseColors={settings.courseColors}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onSyncD2L={handleSyncD2L}
                onResetData={handleResetData}
                isSyncing={isSyncing}
                syncMessage={syncMessage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
