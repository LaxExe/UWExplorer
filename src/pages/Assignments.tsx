import React, { useState } from 'react';
import { Assignment } from '../types';
import { Search, Plus, ExternalLink, Trash2 } from 'lucide-react';

interface AssignmentsProps {
  assignments: Assignment[];
  onToggleAssignment: (id: string) => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onDeleteAssignment: (id: string) => void;
}

export const Assignments: React.FC<AssignmentsProps> = ({
  assignments,
  onToggleAssignment,
  onAddAssignment,
  onDeleteAssignment,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newType, setNewType] = useState<Assignment['type']>('assignment');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const nowTime = Date.now();

  const filteredAssignments = assignments.filter((item) => {
    const isOverdue = new Date(item.dueDate).getTime() < nowTime && !item.isCompleted;

    let matchesStatus = true;
    if (statusFilter === 'pending') matchesStatus = !item.isCompleted && !isOverdue;
    if (statusFilter === 'completed') matchesStatus = item.isCompleted;
    if (statusFilter === 'overdue') matchesStatus = isOverdue;

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesQuery;
  });

  // Sorted by due date ascending
  const sortedAssignments = [...filteredAssignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCourseCode || !newDueDate) return;

    onAddAssignment({
      title: newTitle,
      courseCode: newCourseCode.toUpperCase(),
      courseName: `${newCourseCode.toUpperCase()} Course`,
      type: newType,
      dueDate: new Date(newDueDate).toISOString(),
      isCompleted: false,
      notes: newNotes,
      locationUrl: 'https://learn.uwaterloo.ca/',
    });

    setNewTitle('');
    setNewCourseCode('');
    setNewDueDate('');
    setNewNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Assignments, Quizzes & Deadlines
          </h2>
          <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
            Track all course deliverables synced from Waterloo Learn or added manually.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
        >
          <Plus className="w-4 h-4" />
          <span>add manual deadline</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c3)]" />
          <input
            type="text"
            placeholder="Filter by assignment or course code (e.g. CS 135, Quiz #4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] pl-9 pr-4 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['pending', 'all', 'completed', 'overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`uw-button text-xs ${statusFilter === st ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{st}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Table / List */}
      <div className="flex flex-col gap-3">
        {sortedAssignments.length === 0 ? (
          <div className="uw-card text-center py-12">
            <p className="font-mono text-xs text-[var(--c3)]">
              No assignments found matching "{statusFilter}" status filter.
            </p>
          </div>
        ) : (
          sortedAssignments.map((item) => {
            const dueDateObj = new Date(item.dueDate);
            const isOverdue = dueDateObj.getTime() < nowTime && !item.isCompleted;

            return (
              <div
                key={item.id}
                className={`uw-card p-4 flex items-start justify-between gap-4 transition-all ${
                  item.isCompleted ? 'opacity-60 bg-[var(--c1)]/20' : ''
                } ${isOverdue ? 'border-rose-500/40 bg-rose-500/5' : ''}`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => onToggleAssignment(item.id)}
                    className="mt-1 cursor-pointer accent-[var(--c5)] w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="uw-tag font-bold text-[var(--c5)]">{item.courseCode}</span>
                      <span className="uw-tag">{item.type}</span>
                      {item.points && (
                        <span className="mono-label text-[0.68rem]">{item.points}</span>
                      )}
                      {isOverdue && (
                        <span className="uw-tag text-rose-500 border-rose-500/30 bg-rose-500/10 font-bold">
                          overdue
                        </span>
                      )}
                      {item.isCompleted && (
                        <span className="uw-tag text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                          completed
                        </span>
                      )}
                    </div>

                    <h3
                      className={`font-sans text-sm font-semibold text-[var(--c5)] mt-1.5 ${
                        item.isCompleted ? 'line-through text-[var(--c3)]' : ''
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.notes && (
                      <p className="mono-text text-xs text-[var(--c3)] mt-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <div className="text-right">
                    <span className="mono-label block">deadline</span>
                    <span className="font-mono text-xs font-semibold text-[var(--c5)]">
                      {dueDateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.locationUrl && (
                      <a
                        href={item.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uw-button text-[0.68rem] py-1 px-2.5 h-auto"
                        title="Open assignment portal"
                      >
                        <span>open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteAssignment(item.id)}
                      className="text-[var(--c3)] hover:text-rose-500 p-1 transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Manual Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">
              Add Custom Deadline
            </h3>
            <p className="mono-text text-xs text-[var(--c3)] mt-1">
              Add a non-D2L task, project milestone, or personal assignment.
            </p>

            <form onSubmit={handleCreateAssignment} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 135"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 6 - Binary Trees"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Assignment['type'])}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  >
                    <option value="assignment">assignment</option>
                    <option value="quiz">quiz</option>
                    <option value="exam">exam</option>
                    <option value="project">project</option>
                    <option value="lab">lab</option>
                  </select>
                </div>

                <div>
                  <label className="mono-label block mb-1">Due Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                  />
                </div>
              </div>

              <div>
                <label className="mono-label block mb-1">Notes</label>
                <textarea
                  placeholder="Additional test instructions or requirements..."
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  add deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
