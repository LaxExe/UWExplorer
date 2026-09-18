export interface QuickLink {
  id: string;
  name: string;
  category: 'core' | 'academic' | 'career' | 'campus' | 'custom';
  url: string;
  description: string;
  iconName: string;
  isCustom?: boolean;
}

export interface Announcement {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  content: string;
  date: string; // ISO string
  author?: string;
  priority?: 'normal' | 'important';
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project' | 'lab';
  dueDate: string; // ISO string
  points?: number | string;
  locationUrl?: string;
  isCompleted: boolean;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  location: string;
  startTime: string; // e.g. "10:00 AM" or "10:00"
  endTime: string;   // e.g. "11:20 AM" or "11:20"
  daysOfWeek: string[]; // ['Mon', 'Wed', 'Fri']
  instructor?: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'office_hours';
}

export interface UserSettings {
  theme: 'light' | 'dark';
  d2lFeedUrl: string;
  lastSyncedAt: string | null;
  courseColors: Record<string, string>; // courseCode -> hex/rgba color
}
