import React, { useState } from 'react';
import { Announcement } from '../types';
import { Search, Filter, AlertCircle, Calendar, User, CheckCircle2, Circle } from 'lucide-react';

interface AnnouncementsProps {
  announcements: Announcement[];
  courseColors: Record<string, string>;
  onToggleReadAnnouncement: (id: string) => void;
  onMarkAllRead?: () => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  courseColors,
  onToggleReadAnnouncement,
  onMarkAllRead,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('unread');

  const courseCodes = ['ALL', ...Array.from(new Set(announcements.map(a => a.courseCode)))];

  const unreadCount = announcements.filter(a => !a.isRead).length;

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesCourse = selectedCourse === 'ALL' || ann.courseCode === selectedCourse;
    const matchesQuery = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesRead = true;
    if (readFilter === 'unread') matchesRead = !ann.isRead;
    if (readFilter === 'read') matchesRead = !!ann.isRead;

    return matchesCourse && matchesQuery && matchesRead;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Course Announcements
          </h2>
          <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
            Updates and exam notices from your course instructors ({unreadCount} unread).
          </p>
        </div>

        {unreadCount > 0 && onMarkAllRead && (
          <button
            onClick={onMarkAllRead}
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>mark all read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c3)]" />
          <input
            type="text"
            placeholder="Search announcements (e.g. Midterm, Solution, A05)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] pl-9 pr-4 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
          />
        </div>

        {/* Read Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['unread', 'all', 'read'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setReadFilter(st)}
              className={`uw-button text-xs ${readFilter === st ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{st}</span>
            </button>
          ))}
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-[var(--c3)] mr-1 shrink-0" />
          {courseCodes.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`uw-button text-xs ${selectedCourse === course ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{course}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List of Announcements */}
      <div className="flex flex-col gap-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="uw-card text-center py-12">
            <p className="font-mono text-xs text-[var(--c3)]">
              No announcements match your filter criteria ({readFilter} view).
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const courseBg = courseColors[ann.courseCode] || 'transparent';

            return (
              <div
                key={ann.id}
                className={`uw-card p-5 flex flex-col gap-3 transition-all ${
                  ann.priority === 'important' ? 'border-amber-500/50' : ''
                } ${ann.isRead ? 'opacity-70' : ''}`}
                style={{ backgroundColor: courseBg !== 'transparent' && !ann.isRead ? courseBg : undefined }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleReadAnnouncement(ann.id)}
                      className="text-[var(--c3)] hover:text-[var(--c5)] p-0.5"
                      title={ann.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {ann.isRead ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                      )}
                    </button>

                    <span className="uw-tag font-bold text-[var(--c5)]">{ann.courseCode}</span>
                    <span className="mono-label text-[0.68rem]">{ann.courseName}</span>

                    {!ann.isRead && (
                      <span className="uw-tag border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-bold">
                        new
                      </span>
                    )}

                    {ann.priority === 'important' && (
                      <span className="uw-tag border-amber-500/30 text-amber-600 bg-amber-500/10 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        important
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-[var(--c3)] font-mono text-xs">
                    {ann.author && (
                      <span className="flex items-center gap-1 text-[var(--c4)]">
                        <User className="w-3.5 h-3.5" />
                        {ann.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ann.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-sans text-base font-bold text-[var(--c5)] ${ann.isRead ? 'line-through text-[var(--c3)]' : ''}`}>
                    {ann.title}
                  </h3>
                  <p className="mono-text text-xs text-[var(--c4)] mt-2 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onToggleReadAnnouncement(ann.id)}
                    className="mono-label text-[0.68rem] hover:text-[var(--c5)] cursor-pointer"
                  >
                    {ann.isRead ? 'mark as unread' : 'mark as read ✓'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
