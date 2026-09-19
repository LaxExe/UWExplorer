import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Schedule } from './pages/Schedule';
import { QuickLinks } from './pages/QuickLinks';
import { CalendarView } from './pages/CalendarView';
import { Settings } from './pages/Settings';

import { Course, TaskItem, ScheduleItem, QuickLink, UserSettings } from './types';
import { INITIAL_COURSES, INITIAL_TASKS, INITIAL_SCHEDULE, INITIAL_QUICK_LINKS } from './data/mockData';
import { loadLocalData, saveLocalDB } from './services/d2lSync';

const DEFAULT_SIDEBAR_ORDER = ['dashboard', 'courses', 'schedule', 'links', 'calendar', 'settings'];

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Persistent settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('uwexplorer_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sidebarOrder: parsed.sidebarOrder || DEFAULT_SIDEBAR_ORDER,
        };
      } catch (e) {}
    }
    return {
      theme: 'light',
      sidebarOrder: DEFAULT_SIDEBAR_ORDER,
    };
  });

  // Persistent courses state
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('uwexplorer_courses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  // Persistent tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('uwexplorer_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  // Persistent schedule state
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('uwexplorer_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SCHEDULE;
  });

  // Persistent quick links state
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const savedLinks = localStorage.getItem('uwexplorer_quick_links');
    if (savedLinks) {
      try { return JSON.parse(savedLinks); } catch (e) {}
    }
    return INITIAL_QUICK_LINKS;
  });

  // Load disk DB on mount if available
  useEffect(() => {
    async function loadDisk() {
      const diskData = await loadLocalData();
      if (diskData && diskData.db) {
        const db = diskData.db;
        if (db.courses && db.courses.length > 0) setCourses(db.courses);
        if (db.tasks && db.tasks.length > 0) setTasks(db.tasks);
        if (db.schedule && db.schedule.length > 0) setSchedule(db.schedule);
        if (db.quickLinks && db.quickLinks.length > 0) setQuickLinks(db.quickLinks);
      }
    }
    loadDisk();
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('uwexplorer_settings', JSON.stringify(settings));
  }, [settings]);

  // Save courses
  useEffect(() => {
    localStorage.setItem('uwexplorer_courses', JSON.stringify(courses));
  }, [courses]);

  // Save tasks
  useEffect(() => {
    localStorage.setItem('uwexplorer_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save schedule
  useEffect(() => {
    localStorage.setItem('uwexplorer_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Save quick links
  useEffect(() => {
    localStorage.setItem('uwexplorer_quick_links', JSON.stringify(quickLinks));
  }, [quickLinks]);

  // Sync full state to disk DB file (data/uwexplorer_db.json)
  useEffect(() => {
    saveLocalDB({
      courses,
      tasks,
      schedule,
      quickLinks,
      settings,
    });
  }, [courses, tasks, schedule, quickLinks, settings]);

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

  // Course Actions
  const handleAddCourse = (newCourse: Omit<Course, 'id'>) => {
    const item: Course = {
      ...newCourse,
      id: `c-${Date.now()}`,
    };
    setCourses(prev => [...prev, item]);
  };

  const handleUpdateCourseColor = (courseId: string, color: string) => {
    setCourses(prev => prev.map(c => (c.id === courseId ? { ...c, color } : c)));
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // Task Actions
  const handleAddTask = (newTask: Omit<TaskItem, 'id'>) => {
    const item: TaskItem = {
      ...newTask,
      id: `t-${Date.now()}`,
    };
    setTasks(prev => [item, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Schedule Actions
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

  // Quick Links Actions
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

  const handleResetData = () => {
    if (window.confirm('Reset to default clean data?')) {
      setCourses(INITIAL_COURSES);
      setTasks(INITIAL_TASKS);
      setSchedule(INITIAL_SCHEDULE);
      setQuickLinks(INITIAL_QUICK_LINKS);
      setSettings({
        theme: 'light',
        sidebarOrder: DEFAULT_SIDEBAR_ORDER,
      });
      localStorage.clear();
    }
  };

  const pendingTasksCount = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--c5)] flex flex-col transition-colors">
      <Header
        activeTab={activeTab}
        settings={settings}
        onToggleTheme={handleToggleTheme}
      />

      <div className="max-w-[1300px] w-full mx-auto flex-1 flex flex-col md:flex-row items-stretch">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTasksCount={pendingTasksCount}
          sidebarOrder={settings.sidebarOrder || DEFAULT_SIDEBAR_ORDER}
          onReorderSidebar={handleReorderSidebar}
        />

        <main className="flex-1 p-6 overflow-y-auto w-full flex justify-center">
          <div className="w-full max-w-[1100px] mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                courses={courses}
                tasks={tasks}
                schedule={schedule}
                quickLinks={quickLinks}
                onToggleTask={handleToggleTask}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'courses' && (
              <Courses
                courses={courses}
                tasks={tasks}
                onAddCourse={handleAddCourse}
                onUpdateCourseColor={handleUpdateCourseColor}
                onDeleteCourse={handleDeleteCourse}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'schedule' && (
              <Schedule
                schedule={schedule}
                courseColors={courses.reduce((acc, c) => ({ ...acc, [c.code]: c.color }), {})}
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

            {activeTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                courses={courses}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
