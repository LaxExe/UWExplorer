import React from 'react';
import { Course, TaskItem, ScheduleItem, QuickLink } from '../types';
import { BookOpen, CheckSquare, CalendarDays, ArrowUpRight, AlertCircle, Plus } from 'lucide-react';

interface DashboardProps {
  courses: Course[];
  tasks: TaskItem[];
  schedule: ScheduleItem[];
  quickLinks: QuickLink[];
  onToggleTask: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  courses,
  tasks,
  schedule,
  quickLinks,
  onToggleTask,
  onNavigate,
}) => {
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  // Today's classes
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = days[new Date().getDay()];
  const todayClasses = schedule.filter(s => s.daysOfWeek.includes(todayStr));

  const sortedPending = [...pendingTasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const upcomingNext = sortedPending.slice(0, 5);

  const featuredLinks = quickLinks.filter(l =>
    ['waterlooworks', 'quest', 'outlook', 'crowdmark'].includes(l.id)
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      {/* Hero Banner */}
      <div className="uw-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Student Dashboard
          </h2>
          <p className="font-mono text-xs text-[var(--c4)] mt-1 max-w-xl">
            Manual course-by-course task tracker, class schedule, and quick campus links.
          </p>
        </div>

        <button
          onClick={() => onNavigate('courses')}
          className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
        >
          <Plus className="w-4 h-4" />
          <span>manage courses & tasks</span>
        </button>
      </div>

      {/* Metrics Row (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Active Courses */}
        <div
          onClick={() => onNavigate('courses')}
          className="uw-card flex flex-col justify-between cursor-pointer hover:border-[var(--c3)] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="mono-label font-bold text-[var(--c5)]">enrolled courses</span>
            <BookOpen className="w-4 h-4 text-[var(--c3)]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {courses.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">active courses</span>
          </div>
        </div>

        {/* Card 2: Pending Tasks */}
        <div
          onClick={() => onNavigate('courses')}
          className="uw-card flex flex-col justify-between cursor-pointer hover:border-[var(--c3)] transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="mono-label font-bold text-[var(--c5)]">pending tasks</span>
            <CheckSquare className="w-4 h-4 text-[var(--c3)]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {pendingTasks.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">tasks due</span>
          </div>
        </div>

        {/* Card 3: Today's Schedule (Display card) */}
        <div
          onClick={() => onNavigate('schedule')}
          className="uw-card flex flex-col justify-between cursor-pointer hover:border-[var(--c3)] transition-all bg-[var(--c1)]/30"
        >
          <div className="flex justify-between items-start">
            <span className="mono-label font-bold text-[var(--c5)]">today's schedule</span>
            <CalendarDays className="w-4 h-4 text-[var(--c5)]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {todayClasses.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">
              {todayClasses.length === 1 ? 'class today' : 'classes today'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Tasks & Enrolled Courses Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-base font-semibold text-[var(--c5)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--c3)]" />
              Upcoming Course Tasks
            </h3>
            <button
              onClick={() => onNavigate('courses')}
              className="mono-label text-xs hover:text-[var(--c5)] cursor-pointer"
            >
              view all ({tasks.length}) →
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingNext.length === 0 ? (
              <div className="uw-card text-center py-8">
                <p className="font-mono text-xs text-[var(--c3)]">No upcoming tasks! Click "+ Manage Courses & Tasks" to create one.</p>
              </div>
            ) : (
              upcomingNext.map(item => {
                const courseObj = courses.find(c => c.code === item.courseCode);
                const courseBg = courseObj?.color || 'transparent';
                const dueDateObj = new Date(item.dueDate);
                const isOverdue = dueDateObj.getTime() < Date.now() && !item.isCompleted;

                return (
                  <div
                    key={item.id}
                    className="uw-card flex items-start gap-4 justify-between"
                    style={{ backgroundColor: courseBg !== 'transparent' ? courseBg : undefined }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => onToggleTask(item.id)}
                        className="mt-1 cursor-pointer accent-[var(--c5)]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="uw-tag">{item.courseCode}</span>
                          <span className="uw-tag">{item.type}</span>
                          {isOverdue && (
                            <span className="uw-tag text-rose-500 border-rose-500/30 bg-rose-500/10 font-bold">
                              overdue
                            </span>
                          )}
                        </div>
                        <h4 className="font-sans font-semibold text-sm text-[var(--c5)] mt-1">
                          {item.title}
                        </h4>
                        {item.notes && (
                          <p className="mono-text text-xs text-[var(--c3)] mt-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0">
                      <span className="mono-label">due</span>
                      <span className="font-mono text-xs font-semibold text-[var(--c5)] mt-0.5">
                        {dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Shortcuts */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-base font-semibold text-[var(--c5)]">
                Quick Shortcuts
              </h3>
              <button
                onClick={() => onNavigate('links')}
                className="mono-label text-xs hover:text-[var(--c5)] cursor-pointer"
              >
                all links →
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {featuredLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uw-button w-full justify-between py-2.5 h-auto text-left"
                >
                  <span className="font-sans font-semibold text-xs text-[var(--c5)]">
                    {link.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--c4)]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
