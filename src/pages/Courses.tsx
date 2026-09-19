import React, { useState } from 'react';
import { Course, TaskItem } from '../types';
import { Plus, Trash2, Filter, Search, CheckCircle2, Circle, Clock } from 'lucide-react';

interface CoursesProps {
  courses: Course[];
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({
  courses,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onNavigate,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'pending' | 'done'>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form State
  const [taskCourseCode, setTaskCourseCode] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskItem['type']>('assignment');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  const nowTime = Date.now();

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
    const matchesStatus = taskStatusFilter === 'pending' ? !t.isCompleted : t.isCompleted;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesStatus && matchesSearch;
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
        </div>

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

      {/* Course Cards Row (Clicking card filters tasks for that course) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="mono-label">my courses ({courses.length})</span>
          <button
            onClick={() => onNavigate('settings')}
            className="mono-label text-[0.68rem] text-[var(--c3)] hover:text-[var(--c5)] cursor-pointer"
          >
            + add/edit courses in settings &rarr;
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="uw-card text-center py-8">
            <p className="mono-text text-xs text-[var(--c3)]">
              No courses added yet. Go to <button onClick={() => onNavigate('settings')} className="underline font-bold text-[var(--c5)]">Settings</button> to add your courses!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map(course => {
              const pendingCount = tasks.filter(t => t.courseCode === course.code && !t.isCompleted).length;
              const isSelected = selectedCourseCode === course.code;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseCode(isSelected ? 'ALL' : course.code)}
                  className={`uw-card p-4 flex flex-col justify-between border cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-[var(--c5)] border-[var(--c5)]' : 'border-[var(--border)] hover:border-[var(--c3)]'
                  }`}
                  style={{ backgroundColor: course.color }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="uw-tag font-bold text-[var(--c5)]">{course.code}</span>
                      {isSelected && (
                        <span className="uw-tag bg-[var(--c5)] text-[var(--bg)] font-bold">
                          active filter
                        </span>
                      )}
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
                    <span className="mono-text text-xs text-[var(--c5)] font-semibold">
                      {pendingCount} undone task{pendingCount === 1 ? '' : 's'}
                    </span>
                    <span className="mono-label text-[0.65rem] text-[var(--c3)]">
                      {isSelected ? 'show all' : 'filter course'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Filter & Search Bar with Pending vs Done Tabs */}
      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mt-2">
        {/* Status Toggle: Pending vs Done */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTaskStatusFilter('pending')}
            className={`uw-button text-xs ${taskStatusFilter === 'pending' ? 'active font-bold border-[var(--c3)]' : ''}`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>pending tasks</span>
          </button>
          <button
            onClick={() => setTaskStatusFilter('done')}
            className={`uw-button text-xs ${taskStatusFilter === 'done' ? 'active font-bold border-[var(--c3)]' : ''}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>done tab</span>
          </button>
        </div>

        {/* Search */}
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

        {/* Course Filter Pills */}
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
              {taskStatusFilter === 'pending'
                ? `No pending tasks for "${selectedCourseCode}". You're all caught up!`
                : `No completed tasks in the Done tab for "${selectedCourseCode}".`}
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
                  task.isCompleted ? 'opacity-70 bg-[var(--c1)]/30' : ''
                }`}
                style={{ backgroundColor: courseBg !== 'transparent' && !task.isCompleted ? courseBg : undefined }}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-[var(--c3)] hover:text-[var(--c5)] transition-colors p-0.5"
                    title={task.isCompleted ? 'Mark as undone' : 'Mark as done'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--c3)]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="uw-tag font-bold text-[var(--c5)]">{task.courseCode}</span>
                      <span className="uw-tag">{task.type}</span>
                      {isOverdue && (
                        <span className="uw-tag text-rose-500 border-rose-500/30 bg-rose-500/10 font-bold">
                          overdue
                        </span>
                      )}
                      {task.isCompleted && (
                        <span className="uw-tag text-emerald-600 border-emerald-500/30 bg-emerald-500/10 font-bold">
                          done
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

      {/* Modal: Add Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">Add Course Task / To-Do</h3>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                {courses.length > 0 ? (
                  <select
                    value={taskCourseCode}
                    onChange={(e) => setTaskCourseCode(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 135"
                    value={taskCourseCode}
                    onChange={(e) => setTaskCourseCode(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                )}
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
