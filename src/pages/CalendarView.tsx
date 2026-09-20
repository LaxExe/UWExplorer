import React, { useState } from 'react';
import { TaskItem, Course, ScheduleItem } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Pin } from 'lucide-react';

interface CalendarViewProps {
  tasks: TaskItem[];
  courses: Course[];
  schedule: ScheduleItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, courses, schedule }) => {
  const courseColors: Record<string, string> = courses.reduce((acc, c) => ({ ...acc, [c.code]: c.color }), {});

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeekMap: Record<number, string> = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Map tasks by date
  const tasksByDate: Record<string, TaskItem[]> = {};
  tasks.forEach(item => {
    const key = new Date(item.dueDate).toISOString().split('T')[0];
    if (!tasksByDate[key]) {
      tasksByDate[key] = [];
    }
    tasksByDate[key].push(item);
  });

  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const cleanStr = timeStr.trim().toUpperCase();
    const match = cleanStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  // Helper: get schedule items for a specific date (strictly sorted chronologically top to bottom)
  const getScheduleForDate = (dateIso: string) => {
    const parts = dateIso.split('-');
    if (parts.length !== 3) return [];
    const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayName = daysOfWeekMap[dObj.getDay()];
    return schedule
      .filter(s => s.daysOfWeek.includes(dayName))
      .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
  };

  const selectedDateSchedule = getScheduleForDate(selectedDateStr);
  const selectedTasks = tasksByDate[selectedDateStr] || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Semester Calendar & Class Schedule
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Grid Calendar */}
        <div className="lg:col-span-2 uw-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[var(--c3)]" />
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="uw-button p-1 min-h-[32px]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="uw-button p-1 min-h-[32px]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="mono-label text-[0.65rem] py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-20 border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateIso = dateObj.toISOString().split('T')[0];
              const dayTasks = tasksByDate[dateIso] || [];
              const dayClasses = getScheduleForDate(dateIso);
              const pinnedClasses = dayClasses.filter(c => c.isPinned);
              const isSelected = dateIso === selectedDateStr;
              const isToday = new Date().toDateString() === dateObj.toDateString();

              return (
                <div
                  key={dateIso}
                  onClick={() => setSelectedDateStr(dateIso)}
                  className={`h-20 p-1.5 border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--c5)] bg-[var(--c1)]'
                      : 'border-[var(--border)] hover:border-[var(--c3)]'
                  } ${isToday ? 'ring-1 ring-[var(--c5)]' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-mono text-xs ${
                        isToday ? 'font-bold underline text-[var(--c5)]' : 'text-[var(--c4)]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Pinned Notification Badge */}
                      {pinnedClasses.length > 0 && (
                        <span
                          className="flex items-center gap-0.5 px-1 py-0.2 bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[0.55rem] font-bold rounded"
                          title={`${pinnedClasses.length} pinned item(s)`}
                        >
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          <span>{pinnedClasses.length}</span>
                        </span>
                      )}

                      {/* Task dot indicator */}
                      {dayTasks.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--c5)]" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {/* Task snippets (Priority 1) */}
                    {dayTasks.slice(0, 2).map((item) => {
                      const courseObj = courses.find(c => c.code === item.courseCode);
                      const courseBg = courseObj?.color || 'var(--bg)';
                      return (
                        <span
                          key={item.id}
                          className="font-mono text-[0.58rem] truncate px-1 border border-[var(--border)] text-[var(--c5)] font-semibold"
                          style={{ backgroundColor: courseBg !== 'var(--bg)' ? courseBg : undefined }}
                        >
                          {item.courseCode}: {item.title}
                        </span>
                      );
                    })}

                    {/* Pinned Schedule Items (Priority 2) */}
                    {dayTasks.length < 2 && pinnedClasses.slice(0, 1).map(pItem => (
                      <span
                        key={`pin-${pItem.id}`}
                        className="font-mono text-[0.58rem] truncate px-1 border border-amber-500/40 text-[var(--c5)] font-bold flex items-center gap-0.5"
                        style={{ backgroundColor: courseColors[pItem.courseCode] || undefined }}
                      >
                        <Pin className="w-2 h-2 shrink-0 fill-current text-amber-500" />
                        <span>{pItem.courseCode}</span>
                      </span>
                    ))}

                    {dayClasses.length > 0 && pinnedClasses.length === 0 && dayTasks.length === 0 && (
                      <span className="mono-label text-[0.58rem] text-[var(--c3)]">
                        {dayClasses.length} class{dayClasses.length === 1 ? '' : 'es'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel (Tasks & Assignments First) */}
        <div className="uw-card p-5 flex flex-col gap-5">
          <div className="border-b border-[var(--border)] pb-3">
            <h3 className="font-sans font-bold text-base text-[var(--c5)]">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </h3>
          </div>

          {/* Priority 1: Tasks & Assignments Due for Selected Day */}
          <div className="flex flex-col gap-3">
            <span className="mono-label font-bold text-[var(--c5)] flex items-center justify-between">
              <span>Tasks & Assignments Due ({selectedTasks.length})</span>
            </span>

            {selectedTasks.length === 0 ? (
              <p className="mono-text text-xs text-[var(--c3)] py-2">
                No tasks due on this date.
              </p>
            ) : (
              selectedTasks.map((item) => {
                const courseObj = courses.find(c => c.code === item.courseCode);
                const courseBg = courseObj?.color || 'transparent';

                return (
                  <div
                    key={item.id}
                    className="uw-card p-3 flex flex-col gap-1.5 border-[var(--border)]"
                    style={{ backgroundColor: courseBg !== 'transparent' ? courseBg : undefined }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="uw-tag font-bold">{item.courseCode}</span>
                      <span className="mono-label">{item.type}</span>
                    </div>
                    <h4 className="font-sans font-semibold text-xs text-[var(--c5)] mt-1">
                      {item.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs font-mono text-[var(--c3)] mt-1">
                      <span>due: {new Date(item.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.isCompleted ? (
                        <span className="text-emerald-600 font-semibold">Done</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Priority 2: Class Schedule for Selected Day */}
          <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
            <span className="mono-label font-bold text-[var(--c5)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--c3)]" />
              Class Schedule ({selectedDateSchedule.length})
            </span>

            {selectedDateSchedule.length === 0 ? (
              <p className="mono-text text-xs text-[var(--c3)] py-2">
                No classes scheduled for this day.
              </p>
            ) : (
              selectedDateSchedule.map(cItem => {
                const courseBg = courseColors[cItem.courseCode] || 'transparent';
                return (
                  <div
                    key={cItem.id}
                    className={`uw-card p-3 flex flex-col gap-1 border-[var(--border)] ${
                      cItem.isPinned ? 'ring-1 ring-amber-500/60' : ''
                    }`}
                    style={{ backgroundColor: courseBg !== 'transparent' ? courseBg : undefined }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="uw-tag font-bold">{cItem.courseCode}</span>
                        <span className="uw-tag">{cItem.type}</span>
                      </div>
                      {cItem.isPinned && (
                        <span className="uw-tag bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border-amber-500/40 flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          pinned
                        </span>
                      )}
                    </div>
                    <h4 className="font-sans font-semibold text-xs text-[var(--c5)] mt-1">
                      {cItem.title}
                    </h4>
                    <div className="flex justify-between items-center text-[0.68rem] font-mono text-[var(--c4)] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--c3)]" />
                        {cItem.location}
                      </span>
                      <span className="font-bold text-[var(--c5)]">
                        {cItem.startTime} - {cItem.endTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
