import React, { useState } from 'react';
import { Course, TaskItem } from '../types';
import { Plus, CheckSquare, Trash2, Palette, Filter, Search, Calendar } from 'lucide-react';

interface CoursesProps {
  courses: Course[];
  tasks: TaskItem[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onUpdateCourseColor: (courseId: string, color: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
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

export const Courses: React.FC<CoursesProps> = ({
  courses,
  tasks,
  onAddCourse,
  onUpdateCourseColor,
  onDeleteCourse,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Course Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f61a');
  const [newInstructor, setNewInstructor] = useState('');

  // New Task Form State
  const [taskCourseCode, setTaskCourseCode] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskItem['type']>('assignment');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  const nowTime = Date.now();

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    onAddCourse({
      code: newCode.toUpperCase().trim(),
      name: newName || `${newCode.toUpperCase()} Course`,
      color: newColor,
      instructor: newInstructor,
    });

    setNewCode('');
    setNewName('');
    setNewInstructor('');
    setIsCourseModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskCourseCode || !taskTitle) return;

    onAddTask({
      courseCode: taskCourseCode.toUpperCase().trim(),
      title: taskTitle,
      type: taskType,
      dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : new Date().toISOString(),
      isCompleted: false,
      notes: taskNotes,
    });

    setTaskTitle('');
    setTaskNotes('');
    setIsTaskModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesCourse = selectedCourseCode === 'ALL' || t.courseCode === selectedCourseCode;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Course Tracker & To-Do List
          </h2>
          <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
            Organize assignments, tasks, and deadlines course-by-course with custom subtle accent colors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="uw-button"
          >
            <Plus className="w-4 h-4" />
            <span>add course</span>
          </button>
          <button
            onClick={() => {
              if (courses.length > 0) setTaskCourseCode(courses[0].code);
              setIsTaskModalOpen(true);
            }}
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <Plus className="w-4 h-4" />
            <span>add task / todo</span>
          </button>
        </div>
      </div>

      {/* Courses Cards Row */}
      <div className="flex flex-col gap-3">
        <span className="mono-label">my courses ({courses.length})</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map(course => {
            const coursePendingTasks = tasks.filter(t => t.courseCode === course.code && !t.isCompleted);

            return (
              <div
                key={course.id}
                className="uw-card p-4 flex flex-col justify-between border-[var(--border)] relative"
                style={{ backgroundColor: course.color }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="uw-tag font-bold text-[var(--c5)]">{course.code}</span>
                    <div className="flex items-center gap-1">
                      {PRESET_COLORS.slice(0, 4).map(preset => (
                        <button
                          key={preset.hex}
                          onClick={() => onUpdateCourseColor(course.id, preset.hex)}
                          className={`w-3.5 h-3.5 border ${course.color === preset.hex ? 'border-[var(--c5)] scale-110' : 'border-[var(--border)]'}`}
                          style={{ backgroundColor: preset.hex }}
                          title={preset.name}
                        />
                      ))}
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="text-[var(--c3)] hover:text-rose-500 p-1 ml-1"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-sm text-[var(--c5)] mt-2">
                    {course.name}
                  </h3>
                  {course.instructor && (
                    <p className="mono-text text-[0.68rem] text-[var(--c3)] mt-0.5">
                      {course.instructor}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="mono-text text-xs text-[var(--c4)]">
                    {coursePendingTasks.length} pending task(s)
                  </span>
                  <button
                    onClick={() => {
                      setTaskCourseCode(course.code);
                      setIsTaskModalOpen(true);
                    }}
                    className="uw-button text-[0.65rem] py-0.5 px-2 h-auto"
                  >
                    + task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Filter & Search */}
      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c3)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] pl-9 pr-4 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-[var(--c3)] mr-1 shrink-0" />
          {['ALL', ...courses.map(c => c.code)].map(code => (
            <button
              key={code}
              onClick={() => setSelectedCourseCode(code)}
              className={`uw-button text-xs ${selectedCourseCode === code ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Checklist Stream */}
      <div className="flex flex-col gap-3">
        {sortedTasks.length === 0 ? (
          <div className="uw-card text-center py-12">
            <p className="font-mono text-xs text-[var(--c3)]">
              No tasks found for course "{selectedCourseCode}". Click "+ Add Task" to create one!
            </p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const courseObj = courses.find(c => c.code === task.courseCode);
            const courseBg = courseObj?.color || 'transparent';
            const dueDateObj = new Date(task.dueDate);
            const isOverdue = dueDateObj.getTime() < nowTime && !task.isCompleted;

            return (
              <div
                key={task.id}
                className={`uw-card p-4 flex items-start justify-between gap-4 transition-all ${
                  task.isCompleted ? 'opacity-60 bg-[var(--c1)]/20' : ''
                }`}
                style={{ backgroundColor: courseBg !== 'transparent' && !task.isCompleted ? courseBg : undefined }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleTask(task.id)}
                    className="mt-1 cursor-pointer accent-[var(--c5)] w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="uw-tag font-bold text-[var(--c5)]">{task.courseCode}</span>
                      <span className="uw-tag">{task.type}</span>
                      {isOverdue && (
                        <span className="uw-tag text-rose-500 border-rose-500/30 bg-rose-500/10 font-bold">
                          overdue
                        </span>
                      )}
                    </div>

                    <h4 className={`font-sans font-semibold text-sm text-[var(--c5)] mt-1.5 ${task.isCompleted ? 'line-through text-[var(--c3)]' : ''}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="mono-text text-xs text-[var(--c3)] mt-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <div className="text-right font-mono text-xs text-[var(--c4)]">
                    <span className="mono-label block">due</span>
                    <span>
                      {dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-[var(--c3)] hover:text-rose-500 p-1 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Course */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">Add Course</h3>

            <form onSubmit={handleCreateCourse} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 135"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Designing Functional Programs"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                      onClick={() => setNewColor(preset.hex)}
                      className={`w-7 h-7 border transition-all ${newColor === preset.hex ? 'border-[var(--c5)] scale-110' : 'border-[var(--border)]'}`}
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
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="uw-button"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
                >
                  add course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">Add Course Task / To-Do</h3>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 135"
                  value={taskCourseCode}
                  onChange={(e) => setTaskCourseCode(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 5 or Review Quiz 2"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label block mb-1">Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskItem['type'])}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  >
                    <option value="assignment">assignment</option>
                    <option value="quiz">quiz</option>
                    <option value="exam">exam</option>
                    <option value="project">project</option>
                    <option value="lab">lab</option>
                    <option value="todo">todo</option>
                  </select>
                </div>

                <div>
                  <label className="mono-label block mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                </div>
              </div>

              <div>
                <label className="mono-label block mb-1">Notes</label>
                <textarea
                  placeholder="Task instructions..."
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="uw-button"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
                >
                  save task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
