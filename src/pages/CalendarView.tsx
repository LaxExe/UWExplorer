import React, { useState } from 'react';
import { TaskItem, Course } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  tasks: TaskItem[];
  courses: Course[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, courses }) => {
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

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const tasksByDate: Record<string, TaskItem[]> = {};
  tasks.forEach(item => {
    const key = new Date(item.dueDate).toISOString().split('T')[0];
    if (!tasksByDate[key]) {
      tasksByDate[key] = [];
    }
    tasksByDate[key].push(item);
  });

  const selectedTasks = tasksByDate[selectedDateStr] || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Semester Deadlines Calendar
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div key={`blank-${idx}`} className="h-16 border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateIso = dateObj.toISOString().split('T')[0];
              const dayItems = tasksByDate[dateIso] || [];
              const isSelected = dateIso === selectedDateStr;
              const isToday = new Date().toDateString() === dateObj.toDateString();

              return (
                <div
                  key={dateIso}
                  onClick={() => setSelectedDateStr(dateIso)}
                  className={`h-16 p-1.5 border flex flex-col justify-between cursor-pointer transition-all ${
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
                    {dayItems.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c5)]" />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayItems.slice(0, 2).map((item) => {
                      const courseObj = courses.find(c => c.code === item.courseCode);
                      const courseBg = courseObj?.color || 'var(--bg)';
                      return (
                        <span
                          key={item.id}
                          className="font-mono text-[0.58rem] truncate px-1 border border-[var(--border)] text-[var(--c5)]"
                          style={{ backgroundColor: courseBg !== 'var(--bg)' ? courseBg : undefined }}
                        >
                          {item.courseCode}
                        </span>
                      );
                    })}
                    {dayItems.length > 2 && (
                      <span className="mono-label text-[0.55rem] text-[var(--c3)]">
                        +{dayItems.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="uw-card p-5 flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-3">
            <h3 className="font-sans font-bold text-base text-[var(--c5)]">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {selectedTasks.length === 0 ? (
              <p className="mono-text text-xs text-[var(--c3)] py-4 text-center">
                No tasks scheduled for this date.
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
        </div>
      </div>
    </div>
  );
};
