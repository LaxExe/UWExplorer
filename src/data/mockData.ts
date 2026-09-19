import { Course, TaskItem, QuickLink, ScheduleItem } from '../types';

export const INITIAL_COURSES: Course[] = [];

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_SCHEDULE: ScheduleItem[] = [];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
  {
    id: 'waterlooworks',
    name: 'WaterlooWorks',
    category: 'career',
    url: 'https://waterlooworks.uwaterloo.ca/',
    description: 'Co-op job search, interview schedules, and rankings.',
    iconName: 'Briefcase',
  },
  {
    id: 'quest',
    name: 'Quest',
    category: 'core',
    url: 'https://quest.uwaterloo.ca/',
    description: 'Student information system, course enrollment, and transcripts.',
    iconName: 'GraduationCap',
  },
  {
    id: 'outlook',
    name: 'UWaterloo Mail (Outlook)',
    category: 'core',
    url: 'https://outlook.office.com/mail/',
    description: 'Official student email inbox (@uwaterloo.ca).',
    iconName: 'Mail',
  },
  {
    id: 'crowdmark',
    name: 'Crowdmark',
    category: 'academic',
    url: 'https://app.crowdmark.com/',
    description: 'Online grading platform for math and science assignments.',
    iconName: 'FileCheck',
  },
  {
    id: 'piazza',
    name: 'Piazza',
    category: 'academic',
    url: 'https://piazza.com/',
    description: 'Q&A discussion forum for course content.',
    iconName: 'MessageSquare',
  },
  {
    id: 'learn',
    name: 'LEARN (D2L)',
    category: 'core',
    url: 'https://learn.uwaterloo.ca/',
    description: 'Course materials portal.',
    iconName: 'BookOpen',
  },
];
