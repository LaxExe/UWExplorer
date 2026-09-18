import React, { useState } from 'react';
import { Announcement } from '../types';
import { Search, Filter, AlertCircle, Calendar, User } from 'lucide-react';

interface AnnouncementsProps {
  announcements: Announcement[];
  courseColors: Record<string, string>;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, courseColors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  const courseCodes = ['ALL', ...Array.from(new Set(announcements.map(a => a.courseCode)))];

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesCourse = selectedCourse === 'ALL' || ann.courseCode === selectedCourse;
    const matchesQuery = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Course Announcements
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Live stream of updates, exam details, and assignment notices from your instructors.
        </p>
      </div>

      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
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

      <div className="flex flex-col gap-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="uw-card text-center py-12">
            <p className="font-mono text-xs text-[var(--c3)]">
              No announcements match your filter query.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const courseBg = courseColors[ann.courseCode] || 'transparent';

            return (
              <div
                key={ann.id}
                className={`uw-card p-5 flex flex-col gap-3 ${
                  ann.priority === 'important' ? 'border-amber-500/50' : ''
                }`}
                style={{ backgroundColor: courseBg !== 'transparent' ? courseBg : undefined }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="uw-tag font-bold text-[var(--c5)]">{ann.courseCode}</span>
                    <span className="mono-label text-[0.68rem]">{ann.courseName}</span>
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
                  <h3 className="font-sans text-base font-bold text-[var(--c5)]">
                    {ann.title}
                  </h3>
                  <p className="mono-text text-xs text-[var(--c4)] mt-2 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
