export interface QuickLink {
  id: string;
  name: string;
  category: 'core' | 'academic' | 'career' | 'campus' | 'custom';
  url: string;
  description: string;
  iconName: string;
  isCustom?: boolean;
  isPinned?: boolean;
}

export interface Course {
  id: string;
  code: string; // e.g. "CS 135"
  name: string; // e.g. "Designing Functional Programs"
  color: string; // subtle background accent color e.g. "#3b82f61a"
  instructor?: string;
}

export interface TaskItem {
  id: string;
  courseCode: string;
  title: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project' | 'lab' | 'todo';
  dueDate: string; // ISO string or date
  isCompleted: boolean;
  notes?: string;
  locationUrl?: string;
}

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  instructor?: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'office_hours';
}

export interface UserSettings {
  theme: 'light' | 'dark';
  sidebarOrder: string[];
}
