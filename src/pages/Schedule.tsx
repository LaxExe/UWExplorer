import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Calendar, Clock, MapPin, Plus, User, Trash2, CalendarDays } from 'lucide-react';

interface ScheduleProps {
  schedule: ScheduleItem[];
  courseColors: Record<string, string>;
  onAddScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  onDeleteScheduleItem: (id: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({
  schedule,
  courseColors,
  onAddScheduleItem,
  onDeleteScheduleItem,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(currentDay) ? currentDay : 'Mon';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:20 AM');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [instructor, setInstructor] = useState('');
  const [type, setType] = useState<ScheduleItem['type']>('lecture');

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredItems = schedule.filter(item => item.daysOfWeek.includes(selectedDay));

  const handleToggleDay = (day: string) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !title || !location || daysOfWeek.length === 0) return;

    onAddScheduleItem({
      courseCode: courseCode.toUpperCase(),
      courseName: `${courseCode.toUpperCase()} Course`,
      title,
      location,
      startTime,
      endTime,
      daysOfWeek,
      instructor,
      type,
    });

    setCourseCode('');
    setTitle('');
    setLocation('');
    setIsModalOpen(false);
  };

  // Hourly timetable slots: 8:30 AM - 5:30 PM
  const TIME_SLOTS = [
    { label: '8:30 AM - 9:30 AM', hourStart: 8, minStart: 30 },
    { label: '9:30 AM - 10:30 AM', hourStart: 9, minStart: 30 },
    { label: '10:30 AM - 11:30 AM', hourStart: 10, minStart: 30 },
    { label: '11:30 AM - 12:30 PM', hourStart: 11, minStart: 30 },
    { label: '12:30 PM - 1:30 PM', hourStart: 12, minStart: 30 },
    { label: '1:30 PM - 2:30 PM', hourStart: 13, minStart: 30 },
    { label: '2:30 PM - 3:30 PM', hourStart: 14, minStart: 30 },
    { label: '3:30 PM - 4:30 PM', hourStart: 15, minStart: 30 },
    { label: '4:30 PM - 5:30 PM', hourStart: 16, minStart: 30 },
  ];

  // Helper to match class items to time slots
  const getSlotClasses = (slot: typeof TIME_SLOTS[0]) => {
    return filteredItems.filter(item => {
      const itemTimeLower = item.startTime.toLowerCase();
      const slotHourStr = slot.hourStart > 12 ? (slot.hourStart - 12).toString() : slot.hourStart.toString();
      return itemTimeLower.includes(slotHourStr) || itemTimeLower.includes(`${slot.hourStart}:`);
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Class & Course Schedule
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
        >
          <Plus className="w-4 h-4" />
          <span>add class / lecture</span>
        </button>
      </div>

      {/* Day Selector */}
      <div className="uw-card p-3 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[var(--c3)] mr-1 shrink-0" />
          {daysList.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`uw-button text-xs ${selectedDay === day ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clean Today's Classes List (No lines in-between, no free slot labels) */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="uw-card text-center py-12">
            <p className="font-mono text-xs text-[var(--c3)]">
              No classes scheduled for {selectedDay}.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const courseColor = courseColors[item.courseCode] || 'transparent';

            return (
              <div
                key={item.id}
                className="uw-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                style={{ backgroundColor: courseColor !== 'transparent' ? courseColor : undefined }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[var(--border)] bg-[var(--bg)] flex flex-col items-center justify-center shrink-0">
                    <span className="font-mono font-bold text-xs text-[var(--c5)]">
                      {item.courseCode.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[0.62rem] text-[var(--c3)]">
                      {item.courseCode.split(' ')[1] || ''}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="uw-tag font-bold">{item.courseCode}</span>
                      <span className="uw-tag">{item.type}</span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-[var(--c5)] mt-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-1 font-mono text-xs text-[var(--c4)] flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-[var(--c5)]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--c3)]" />
                        {item.location}
                      </span>

                      {item.instructor && (
                        <span className="flex items-center gap-1 text-[var(--c3)]">
                          <User className="w-3.5 h-3.5" />
                          {item.instructor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--c5)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--c3)]" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>

                  <button
                    onClick={() => onDeleteScheduleItem(item.id)}
                    className="text-[var(--c3)] hover:text-rose-500 p-1 transition-colors shrink-0"
                    title="Delete class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Adding Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">
              Add Class / Lecture
            </h3>

            <form onSubmit={handleCreateSchedule} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 135"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 001"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label block mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MC 2065"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                </div>

                <div>
                  <label className="mono-label block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ScheduleItem['type'])}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  >
                    <option value="lecture">lecture</option>
                    <option value="lab">lab</option>
                    <option value="tutorial">tutorial</option>
                    <option value="office_hours">office hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label block mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                </div>

                <div>
                  <label className="mono-label block mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="11:20 AM"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                </div>
              </div>

              <div>
                <label className="mono-label block mb-1">Days of Week *</label>
                <div className="flex gap-1 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`uw-button text-xs py-1 px-2.5 h-auto ${
                        daysOfWeek.includes(day) ? 'active font-semibold border-[var(--c3)]' : ''
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mono-label block mb-1">Instructor</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Gregor Richards"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="uw-button"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
                >
                  save class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
