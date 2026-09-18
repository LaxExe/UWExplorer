import { Assignment } from '../types';

/**
 * Basic lightweight client-side iCal / ICS text parser.
 * Converts standard VEVENT fields into Assignment records.
 */
export function parseICSData(icsText: string): Assignment[] {
  const events: Assignment[] = [];
  const lines = icsText.split(/\r\n|\n|\r/);
  
  let inEvent = false;
  let summary = '';
  let description = '';
  let dtend = '';
  let uid = '';
  let location = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      summary = '';
      description = '';
      dtend = '';
      uid = '';
      location = '';
    } else if (line.startsWith('END:VEVENT')) {
      if (inEvent && summary) {
        // Attempt to extract course code from summary e.g. "CS 135: Assignment 5" or "[MATH 135] Homework 4"
        const courseMatch = summary.match(/([A-Z]{2,6}\s?\d{3}[A-Z]?)/i);
        const courseCode = courseMatch ? courseMatch[1].toUpperCase() : 'LEARN';
        
        let formattedDate = new Date().toISOString();
        if (dtend) {
          formattedDate = parseICalDate(dtend);
        }

        events.push({
          id: uid || `ics-${Math.random().toString(36).substring(2, 9)}`,
          courseCode,
          courseName: `${courseCode} Course Task`,
          title: summary.replace(/^[A-Z]{2,6}\s?\d{3}[A-Z]?:\s?/i, ''),
          type: inferAssignmentType(summary),
          dueDate: formattedDate,
          isCompleted: false,
          notes: description ? description.substring(0, 150) : undefined,
          locationUrl: location.startsWith('http') ? location : 'https://learn.uwaterloo.ca/',
        });
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('SUMMARY:')) {
        summary = line.substring(8);
      } else if (line.startsWith('DESCRIPTION:')) {
        description = line.substring(12);
      } else if (line.startsWith('DTEND:') || line.startsWith('DTEND;')) {
        const val = line.split(':')[1];
        if (val) dtend = val;
      } else if (line.startsWith('DTSTART:') || line.startsWith('DTSTART;')) {
        if (!dtend) {
          const val = line.split(':')[1];
          if (val) dtend = val;
        }
      } else if (line.startsWith('UID:')) {
        uid = line.substring(4);
      } else if (line.startsWith('LOCATION:')) {
        location = line.substring(9);
      }
    }
  }

  return events;
}

function parseICalDate(icalStr: string): string {
  const match = icalStr.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hour = match[4] ? parseInt(match[4], 10) : 23;
    const minute = match[5] ? parseInt(match[5], 10) : 59;
    const second = match[6] ? parseInt(match[6], 10) : 0;
    return new Date(Date.UTC(year, month, day, hour, minute, second)).toISOString();
  }
  return new Date().toISOString();
}

function inferAssignmentType(title: string): Assignment['type'] {
  const lower = title.toLowerCase();
  if (lower.includes('quiz') || lower.includes('test')) return 'quiz';
  if (lower.includes('exam') || lower.includes('midterm') || lower.includes('final')) return 'exam';
  if (lower.includes('lab')) return 'lab';
  if (lower.includes('project')) return 'project';
  return 'assignment';
}

/**
 * Normalizes webcal:// or http:// URLs to https://
 */
export function normalizeFeedUrl(url: string): string {
  let cleaned = url.trim();
  if (cleaned.startsWith('webcal://')) {
    cleaned = 'https://' + cleaned.substring(9);
  } else if (cleaned.startsWith('http://')) {
    cleaned = 'https://' + cleaned.substring(7);
  }
  return cleaned;
}

/**
 * Fetch feed via CORS proxies with fallback strategies to bypass 403 / CORS restrictions.
 */
export async function fetchD2LFeed(feedUrl: string): Promise<{ assignments: Assignment[]; error?: string }> {
  if (!feedUrl.trim()) {
    return { assignments: [], error: 'No feed URL specified.' };
  }

  const normalizedUrl = normalizeFeedUrl(feedUrl);

  const proxyEndpoints = [
    // Direct attempt
    normalizedUrl,
    // Proxy 1: AllOrigins raw
    `https://api.allorigins.win/raw?url=${encodeURIComponent(normalizedUrl)}`,
    // Proxy 2: CodeTabs
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(normalizedUrl)}`,
    // Proxy 3: CorsProxy.io
    `https://corsproxy.io/?${encodeURIComponent(normalizedUrl)}`,
  ];

  let lastError = '';

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'text/calendar, text/plain, */*' },
      }).catch(() => null);

      if (res && res.ok) {
        const text = await res.text();
        if (text && (text.includes('BEGIN:VCALENDAR') || text.includes('BEGIN:VEVENT'))) {
          const parsed = parseICSData(text);
          if (parsed.length > 0) {
            return { assignments: parsed };
          }
        }
      } else if (res && res.status) {
        lastError = `HTTP Error ${res.status}`;
      }
    } catch (e: any) {
      lastError = e?.message || 'Network error';
    }
  }

  return {
    assignments: [],
    error: `D2L Access Restriction (${lastError || 'HTTP 403'}). Waterloo Learn blocks browser cross-origin requests. Try using the "Upload .ics File" option below!`,
  };
}
