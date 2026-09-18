import React from 'react';
import { QuickLink, Announcement, Assignment } from '../types';
import { Briefcase, ArrowUpRight, Bell, CheckSquare, Calendar, AlertCircle } from 'lucide-react';

interface DashboardProps {
  quickLinks: QuickLink[];
  announcements: Announcement[];
  assignments: Assignment[];
  onToggleAssignment: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  quickLinks,
  announcements,
  assignments,
  onToggleAssignment,
  onNavigate,
}) => {
  const pendingAssignments = assignments.filter(a => !a.isCompleted);
  const completedAssignments = assignments.filter(a => a.isCompleted);
  
  // Sort assignments by due date
  const sortedPending = [...pendingAssignments].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const upcomingNext = sortedPending.slice(0, 4);
  const recentAnnouncements = announcements.slice(0, 3);
  
  // Featured links: WaterlooWorks + Learn + Quest + Outlook
  const featuredLinks = quickLinks.filter(l => 
    ['waterlooworks', 'learn', 'quest', 'outlook', 'crowdmark'].includes(l.id)
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      {/* Hero Banner */}
      <div className="uw-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="mono-label">UNIVERSITY OF WATERLOO DASHBOARD</span>
          <h2 className="text-2xl font-bold font-sans text-[var(--c5)] tracking-tight mt-1">
            Welcome back, Warrior.
          </h2>
          <p className="font-mono text-xs text-[var(--c4)] mt-1 max-w-xl">
            Streamlined Waterloo Learn (D2L) announcements, upcoming assignment deadlines, and direct access to WaterlooWorks, Quest, & Outlook.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://waterlooworks.uwaterloo.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <Briefcase className="w-4 h-4" />
            <span>WaterlooWorks</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onNavigate('assignments')}
            className="uw-button"
          >
            <CheckSquare className="w-4 h-4" />
            <span>view deadlines ({pendingAssignments.length})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="uw-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="mono-label">pending assignments</span>
            <CheckSquare className="w-4 h-4 text-[var(--c3)]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {pendingAssignments.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">tasks due</span>
          </div>
        </div>

        <div className="uw-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="mono-label">recent announcements</span>
            <Bell className="w-4 h-4 text-[var(--c3)]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {announcements.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">course updates</span>
          </div>
        </div>

        <div className="uw-card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="mono-label">completed items</span>
            <Calendar className="w-4 h-4 text-[var(--c3)]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold font-sans text-[var(--c5)]">
              {completedAssignments.length}
            </span>
            <span className="font-mono text-xs text-[var(--c3)] ml-2">done this term</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines & Featured Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Deadlines */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-base font-semibold text-[var(--c5)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--c3)]" />
              Upcoming Deadlines
            </h3>
            <button
              onClick={() => onNavigate('assignments')}
              className="mono-label text-xs hover:text-[var(--c5)] cursor-pointer"
            >
              view all ({assignments.length}) →
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingNext.length === 0 ? (
              <div className="uw-card text-center py-8">
                <p className="font-mono text-xs text-[var(--c3)]">No upcoming assignments! Enjoy your free time.</p>
              </div>
            ) : (
              upcomingNext.map(item => {
                const dueDateObj = new Date(item.dueDate);
                const isOverdue = dueDateObj.getTime() < Date.now() && !item.isCompleted;

                return (
                  <div
                    key={item.id}
                    className="uw-card flex items-start gap-4 justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => onToggleAssignment(item.id)}
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

        {/* Right Column: Fast Launch & Announcements */}
        <div className="flex flex-col gap-6">
          {/* Quick Services Launcher */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-base font-semibold text-[var(--c5)]">
                UW Shortcuts
              </h3>
              <button
                onClick={() => onNavigate('links')}
                className="mono-label text-xs hover:text-[var(--c5)] cursor-pointer"
              >
                all services →
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
                  <div className="flex items-center gap-2.5">
                    {link.id === 'waterlooworks' ? (
                      <Briefcase className="w-4 h-4 text-[var(--c5)]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-[var(--c4)]" />
                    )}
                    <span className="font-sans font-semibold text-xs text-[var(--c5)]">
                      {link.name}
                    </span>
                  </div>
                  <span className="mono-label">open</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Announcements Feed */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-base font-semibold text-[var(--c5)]">
                Latest Announcements
              </h3>
              <button
                onClick={() => onNavigate('announcements')}
                className="mono-label text-xs hover:text-[var(--c5)] cursor-pointer"
              >
                view all →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {recentAnnouncements.map(ann => (
                <div key={ann.id} className="uw-card p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="uw-tag">{ann.courseCode}</span>
                    <span className="mono-label">
                      {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-xs text-[var(--c5)] mt-2">
                    {ann.title}
                  </h4>
                  <p className="mono-text text-[0.72rem] text-[var(--c3)] line-clamp-2 mt-1">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
