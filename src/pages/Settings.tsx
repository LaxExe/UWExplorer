import React, { useState } from 'react';
import { UserSettings, Course } from '../types';
import { Download, RotateCcw, Sliders, Plus, Trash2, Edit2, Palette, BookOpen } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  courses: Course[];
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onUpdateCourse: (courseId: string, updated: Partial<Course>) => void;
  onDeleteCourse: (courseId: string) => void;
  onResetData: () => void;
}

const PRESET_COLORS = [
  { name: 'Blue', hex: '#3b82f61a' },
  { name: 'Green', hex: '#10b9811a' },
  { name: 'Purple', hex: '#8b5cf61a' },
  { name: 'Amber', hex: '#f59e0b1a' },
  { name: 'Red', hex: '#ef44441a' },
  { name: 'Rose', hex: '#f43f5e1a' },
  { name: 'Cyan', hex: '#06b6d41a' },
  { name: 'Slate', hex: '#64748b1a' },
];

export const Settings: React.FC<SettingsProps> = ({
  settings,
  courses,
  onUpdateSettings,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onResetData,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f61a');
  const [instructor, setInstructor] = useState('');

  const handleOpenAdd = () => {
    setCode('');
    setName('');
    setColor('#3b82f61a');
    setInstructor('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setCode(c.code);
    setName(c.name);
    setColor(c.color);
    setInstructor(c.instructor || '');
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCourse) {
      onUpdateCourse(editingCourse.id, {
        code: code.toUpperCase().trim(),
        name: name || `${code.toUpperCase().trim()} Course`,
        color,
        instructor,
      });
      setEditingCourse(null);
    } else {
      onAddCourse({
        code: code.toUpperCase().trim(),
        name: name || `${code.toUpperCase().trim()} Course`,
        color,
        instructor,
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[900px] mx-auto w-full">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Settings & Course Manager
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Add and edit your enrolled courses, customize course colors, and manage local data.
        </p>
      </div>

      {/* Course Management Section */}
      <div className="uw-card p-6 flex flex-col gap-4 border-[var(--c4)]">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--c3)]" />
              My Enrolled Courses ({courses.length})
            </h3>
            <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
              Manage course codes, titles, instructors, and subtle background accent colors.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <Plus className="w-4 h-4" />
            <span>add course</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {courses.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[var(--border)] p-4">
              <p className="mono-text text-xs text-[var(--c3)]">
                No courses added yet. Click "+ Add Course" to get started!
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="uw-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[var(--border)]"
                style={{ backgroundColor: course.color }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 border border-[var(--border)] shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                  <div>
                    <span className="font-mono font-bold text-sm text-[var(--c5)]">{course.code}</span>
                    <span className="font-sans text-xs text-[var(--c4)] ml-2">{course.name}</span>
                    {course.instructor && (
                      <span className="mono-label text-[0.68rem] block text-[var(--c3)]">
                        Instructor: {course.instructor}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => onUpdateCourse(course.id, { color: preset.hex })}
                        className={`w-4 h-4 border transition-all ${
                          course.color === preset.hex ? 'border-[var(--c5)] scale-125' : 'border-[var(--border)]'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="text-[var(--c3)] hover:text-[var(--c5)] p-1.5 transition-colors"
                    title="Edit course details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="text-[var(--c3)] hover:text-rose-500 p-1.5 transition-colors"
                    title="Delete course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--c3)]" />
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <span className="font-sans font-bold text-sm text-[var(--c5)]">Color Mode</span>
            <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
              Switch between Light and Dark visual modes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`uw-button ${settings.theme === 'light' ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              light mode
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`uw-button ${settings.theme === 'dark' ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              dark mode
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-sm text-[var(--c5)]">
          Data Management & Backup
        </h3>

        <p className="mono-text text-xs text-[var(--c4)] leading-relaxed">
          All data is stored locally in <code className="bg-[var(--c1)] px-1.5 py-0.5 border border-[var(--border)]">data/uwexplorer_db.json</code>.
        </p>

        <div className="flex items-center gap-4 flex-wrap pt-2">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "uwexplorer_backup.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>export data backup (.json)</span>
          </button>

          <button
            onClick={onResetData}
            className="uw-button text-rose-500 border-rose-500/30 hover:border-rose-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>clear all data</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {(isAddModalOpen || editingCourse) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">
              {editingCourse ? 'Edit Course' : 'Add Course'}
            </h3>

            <form onSubmit={handleSaveCourse} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 135"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Designing Functional Programs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Subtle Accent Color</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_COLORS.map(preset => (
                    <button
                      type="button"
                      key={preset.hex}
                      onClick={() => setColor(preset.hex)}
                      className={`w-7 h-7 border transition-all ${color === preset.hex ? 'border-[var(--c5)] scale-110' : 'border-[var(--border)]'}`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
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
                  onClick={() => { setIsAddModalOpen(false); setEditingCourse(null); }}
                  className="uw-button"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
                >
                  save course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
