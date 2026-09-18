import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { QuickLinks } from './pages/QuickLinks';
import { Announcements } from './pages/Announcements';
import { Assignments } from './pages/Assignments';
import { CalendarView } from './pages/CalendarView';
import { Settings } from './pages/Settings';

import { QuickLink, Announcement, Assignment, UserSettings } from './types';
import { INITIAL_QUICK_LINKS, INITIAL_ANNOUNCEMENTS, INITIAL_ASSIGNMENTS } from './data/mockData';
import { fetchD2LFeed } from './services/d2lSync';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Persistent settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('uwexplorer_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      theme: 'light',
      d2lFeedUrl: '',
      lastSyncedAt: null,
      customLinks: [],
    };
  });

  // Persistent quick links state
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const savedCustom = localStorage.getItem('uwexplorer_custom_links');
    if (savedCustom) {
      try {
        const custom: QuickLink[] = JSON.parse(savedCustom);
        return [...INITIAL_QUICK_LINKS, ...custom];
      } catch (e) {}
    }
    return INITIAL_QUICK_LINKS;
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

  // Theme synchronization with html[data-theme]
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('uwexplorer_settings', JSON.stringify(settings));
  }, [settings]);

  // Save quick links to localStorage
  useEffect(() => {
    const customOnly = quickLinks.filter(l => l.isCustom);
    localStorage.setItem('uwexplorer_custom_links', JSON.stringify(customOnly));
  }, [quickLinks]);

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

  const handleAddQuickLink = (newLink: Omit<QuickLink, 'id'>) => {
    const item: QuickLink = {
      ...newLink,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setQuickLinks(prev => [...prev, item]);
  };

  const handleRemoveQuickLink = (id: string) => {
    setQuickLinks(prev => prev.filter(l => l.id !== id));
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
      // Merge fetched events with existing manual/demo assignments
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
    if (window.confirm('Reset to default Waterloo sample data? Custom items will be cleared.')) {
      setAssignments(INITIAL_ASSIGNMENTS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setQuickLinks(INITIAL_QUICK_LINKS);
      setSettings({
        theme: 'light',
        d2lFeedUrl: '',
        lastSyncedAt: null,
        customLinks: [],
      });
      localStorage.clear();
      setSyncMessage('Data reset to default Waterloo sample mode.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--c5)] flex flex-col transition-colors">
      <Header
        activeTab={activeTab}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onSyncD2L={handleSyncD2L}
        isSyncing={isSyncing}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assignmentsCount={assignments.filter(a => !a.isCompleted).length}
          announcementsCount={announcements.length}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              quickLinks={quickLinks}
              announcements={announcements}
              assignments={assignments}
              onToggleAssignment={handleToggleAssignment}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'links' && (
            <QuickLinks
              links={quickLinks}
              onAddLink={handleAddQuickLink}
              onRemoveLink={handleRemoveQuickLink}
            />
          )}

          {activeTab === 'announcements' && (
            <Announcements announcements={announcements} />
          )}

          {activeTab === 'assignments' && (
            <Assignments
              assignments={assignments}
              onToggleAssignment={handleToggleAssignment}
              onAddAssignment={handleAddAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView assignments={assignments} />
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
        </main>
      </div>
    </div>
  );
}

export default App;
