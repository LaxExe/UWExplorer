import { QuickLink, Announcement, Assignment, ScheduleItem } from '../types';

export const DEFAULT_COURSE_COLORS: Record<string, string> = {
  'CS 135': '#3b82f61a',   // subtle blue
  'MATH 135': '#10b9811a', // subtle green
  'MATH 137': '#8b5cf61a', // subtle purple
  'ENGL 109': '#f59e0b1a', // subtle amber
  'PHYS 121': '#ef44441a', // subtle red
  'LEARN': '#64748b1a',    // subtle slate
};

export const INITIAL_QUICK_LINKS: QuickLink[] = [
  {
    id: 'waterlooworks',
    name: 'WaterlooWorks',
    category: 'career',
    url: 'https://waterlooworks.uwaterloo.ca/',
    description: 'Co-op job search, interview schedules, rankings, and employment services.',
    iconName: 'Briefcase',
  },
  {
    id: 'learn',
    name: 'LEARN (D2L)',
    category: 'core',
    url: 'https://learn.uwaterloo.ca/',
    description: 'Course materials, assignment submissions, announcements, and grades.',
    iconName: 'BookOpen',
  },
  {
    id: 'quest',
    name: 'Quest',
    category: 'core',
    url: 'https://quest.uwaterloo.ca/',
    description: 'Student information system, course enrollment, transcripts, and tuition fees.',
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
    id: 'portal',
    name: 'UW Portal',
    category: 'campus',
    url: 'https://portal.uwaterloo.ca/',
    description: 'Campus widgets, food services schedules, GRT transit, and alerts.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'crowdmark',
    name: 'Crowdmark',
    category: 'academic',
    url: 'https://app.crowdmark.com/',
    description: 'Online grading platform for math, engineering, and science assignments.',
    iconName: 'FileCheck',
  },
  {
    id: 'piazza',
    name: 'Piazza',
    category: 'academic',
    url: 'https://piazza.com/',
    description: 'Q&A discussion forum for course content and peer assistance.',
    iconName: 'MessageSquare',
  },
  {
    id: 'watiam',
    name: 'WatIAM',
    category: 'core',
    url: 'https://idm.uwaterloo.ca/identity/self-service',
    description: 'Identity management, password updates, and 2FA configuration.',
    iconName: 'Key',
  },
  {
    id: 'workday',
    name: 'Workday',
    category: 'career',
    url: 'https://wd3.myworkday.com/uwaterloo',
    description: 'TA/RA employment, payroll, tax forms, and campus job administration.',
    iconName: 'DollarSign',
  },
  {
    id: 'wusa',
    name: 'WUSA',
    category: 'campus',
    url: 'https://wusa.ca/',
    description: 'Waterloo Undergraduate Student Association, health dental plan, and clubs.',
    iconName: 'Users',
  },
  {
    id: 'library',
    name: 'UW Library (Omni)',
    category: 'academic',
    url: 'https://uwaterloo.ca/library/',
    description: 'Dana Porter & Davis Centre library catalogs, research papers, and study room bookings.',
    iconName: 'Library',
  },
];

const now = new Date();
const addDays = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    courseCode: 'CS 135',
    courseName: 'Designing Functional Programs',
    title: 'A05 Released & Midterm Exam Room Allocation',
    content: 'Assignment 05 has been published on Learn and is due next Tuesday at 23:59. Midterm room allocations are now available under the Course Info tab. Please check your assigned seat (PAC vs DC).',
    date: addDays(-1),
    author: 'Prof. Gregor Richards',
    priority: 'important',
  },
  {
    id: 'ann-2',
    courseCode: 'MATH 135',
    courseName: 'Algebra for Honors Mathematics',
    title: 'Assignment 4 Solution Key & Proof Tips',
    content: 'Solutions for Assignment 4 are posted under Content -> Solutions. Make sure to review the induction proof structuring guide before Assignment 5.',
    date: addDays(-2),
    author: 'Dr. Carmen Bruni',
  },
  {
    id: 'ann-3',
    courseCode: 'MATH 137',
    courseName: 'Calculus 1 for Honors Mathematics',
    title: 'WebWork Problem Set #6 Open',
    content: 'WebWork Set 6 covering implicit differentiation and logarithmic differentiation is now accessible. You have up to 5 attempts per question.',
    date: addDays(-3),
    author: 'Math Undergrad Office',
  },
  {
    id: 'ann-4',
    courseCode: 'ENGL 109',
    courseName: 'Introduction to Academic Writing',
    title: 'Peer Review Draft Deadline Reminder',
    content: 'Your Rough Draft for Essay #2 must be submitted to the Learn Discussion Forum by Friday 5 PM for peer review assignment.',
    date: addDays(-4),
    author: 'Prof. Sarah Jenkins',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-1',
    courseCode: 'CS 135',
    courseName: 'Designing Functional Programs',
    title: 'Assignment 05 — Binary Search Trees & Recursion',
    type: 'assignment',
    dueDate: addDays(2),
    points: '100 pts',
    locationUrl: 'https://learn.uwaterloo.ca/',
    isCompleted: false,
    notes: 'Remember to test edge cases with empty BSTs using check-expect.',
  },
  {
    id: 'asgn-2',
    courseCode: 'MATH 135',
    courseName: 'Algebra for Honors Mathematics',
    title: 'Crowdmark Assignment 05 — Euclidean Algorithm & Congruences',
    type: 'assignment',
    dueDate: addDays(4),
    points: '50 pts',
    locationUrl: 'https://app.crowdmark.com/',
    isCompleted: false,
    notes: 'Format proofs clearly and write legibly for scanning.',
  },
  {
    id: 'asgn-3',
    courseCode: 'MATH 137',
    courseName: 'Calculus 1 for Honors Mathematics',
    title: 'WebWork Online Quiz #4',
    type: 'quiz',
    dueDate: addDays(1),
    points: '20 pts',
    locationUrl: 'https://learn.uwaterloo.ca/',
    isCompleted: true,
  },
  {
    id: 'asgn-4',
    courseCode: 'CS 135',
    courseName: 'Designing Functional Programs',
    title: 'Midterm Examination 1',
    type: 'exam',
    dueDate: addDays(7),
    points: '25% Grade',
    locationUrl: 'https://learn.uwaterloo.ca/',
    isCompleted: false,
    notes: 'Covers Racket, structural induction, and list processing.',
  },
  {
    id: 'asgn-5',
    courseCode: 'PHYS 121',
    courseName: 'Mechanics & Waves',
    title: 'Lab 3 Report — Oscillations & Simple Harmonic Motion',
    type: 'lab',
    dueDate: addDays(5),
    points: '30 pts',
    locationUrl: 'https://learn.uwaterloo.ca/',
    isCompleted: false,
  },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    courseCode: 'CS 135',
    courseName: 'Designing Functional Programs',
    title: 'Lecture 001',
    location: 'MC 2065',
    startTime: '10:00 AM',
    endTime: '11:20 AM',
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    instructor: 'Gregor Richards',
    type: 'lecture',
  },
  {
    id: 'sch-2',
    courseCode: 'MATH 135',
    courseName: 'Algebra for Honors Mathematics',
    title: 'Lecture 002',
    location: 'MC 4020',
    startTime: '11:30 AM',
    endTime: '12:50 PM',
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    instructor: 'Carmen Bruni',
    type: 'lecture',
  },
  {
    id: 'sch-3',
    courseCode: 'MATH 137',
    courseName: 'Calculus 1 for Honors Mathematics',
    title: 'Lecture 003',
    location: 'RCH 101',
    startTime: '01:30 PM',
    endTime: '02:50 PM',
    daysOfWeek: ['Tue', 'Thu'],
    instructor: 'David Jao',
    type: 'lecture',
  },
  {
    id: 'sch-4',
    courseCode: 'CS 135',
    courseName: 'Designing Functional Programs',
    title: 'Tutorial 101',
    location: 'MC 3003',
    startTime: '03:30 PM',
    endTime: '04:20 PM',
    daysOfWeek: ['Wed'],
    instructor: 'ISG TA',
    type: 'tutorial',
  },
  {
    id: 'sch-5',
    courseCode: 'PHYS 121',
    courseName: 'Mechanics & Waves',
    title: 'Physics Lab 01',
    location: 'PHY 310',
    startTime: '02:30 PM',
    endTime: '05:20 PM',
    daysOfWeek: ['Thu'],
    instructor: 'Lab Instructor',
    type: 'lab',
  },
];
