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
  date: string; // ISO string or human readable
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

export interface UserSettings {
  theme: 'light' | 'dark';
  d2lFeedUrl: string;
  lastSyncedAt: string | null;
  customLinks: QuickLink[];
}
