import React, { useState } from 'react';
import { UserSettings, Assignment, Announcement, ScheduleItem } from '../types';
import { RefreshCw, Download, RotateCcw, Check, Palette, Plus, Trash2, Upload, FileText, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { parseICSData } from '../services/d2lSync';

interface SettingsProps {
  settings: UserSettings;
  assignments: Assignment[];
  announcements: Announcement[];
  schedule: ScheduleItem[];
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onSyncD2L: () => void;
  onImportAssignments?: (assignments: Assignment[]) => void;
  onResetData: () => void;
  isSyncing: boolean;
  syncMessage: string | null;
}

const PRESET_COLORS = [
  { name: 'Blue Tint', hex: '#3b82f61a' },
  { name: 'Green Tint', hex: '#10b9811a' },
  { name: 'Purple Tint', hex: '#8b5cf61a' },
  { name: 'Amber Tint', hex: '#f59e0b1a' },
  { name: 'Red Tint', hex: '#ef44441a' },
  { name: 'Rose Tint', hex: '#f43f5e1a' },
  { name: 'Cyan Tint', hex: '#06b6d41a' },
  { name: 'Slate Tint', hex: '#64748b1a' },
];

export const Settings: React.FC<SettingsProps> = ({
  settings,
  assignments,
  announcements,
  schedule,
  onUpdateSettings,
  onSyncD2L,
  onImportAssignments,
  onResetData,
  isSyncing,
  syncMessage,
}) => {
  const [feedInput, setFeedInput] = useState(settings.d2lFeedUrl);
  const [isSaved, setIsSaved] = useState(false);
  const [icsTextPaste, setIcsTextPaste] = useState('');
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Form for custom course code addition
  const [newCourseCode, setNewCourseCode] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f61a');

  const courseColors = settings.courseColors || {};

  // Automatically discover all active course codes across assignments, announcements, and schedule
  const activeCourseSet = new Set<string>();
  assignments.forEach(a => { if (a.courseCode) activeCourseSet.add(a.courseCode.toUpperCase()); });
  announcements.forEach(a => { if (a.courseCode) activeCourseSet.add(a.courseCode.toUpperCase()); });
  schedule.forEach(s => { if (s.courseCode) activeCourseSet.add(s.courseCode.toUpperCase()); });
  Object.keys(courseColors).forEach(c => activeCourseSet.add(c.toUpperCase()));

  const allCourses = Array.from(activeCourseSet).sort();

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ d2lFeedUrl: feedInput.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text && onImportAssignments) {
        const events = parseICSData(text);
        if (events.length > 0) {
          onImportAssignments(events);
          setUploadNotice(`Successfully imported ${events.length} deadline(s) from uploaded .ics file!`);
        } else {
          setUploadNotice('No valid VEVENT items found in file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!icsTextPaste.trim() || !onImportAssignments) return;

    const events = parseICSData(icsTextPaste);
    if (events.length > 0) {
      onImportAssignments(events);
      setUploadNotice(`Successfully imported ${events.length} deadline(s) from pasted text!`);
      setIcsTextPaste('');
    } else {
      setUploadNotice('Could not parse valid iCal events from text.');
    }
  };

  const handleSetCourseColor = (code: string, colorHex: string) => {
    const updated = { ...courseColors, [code]: colorHex };
    onUpdateSettings({ courseColors: updated });
  };

  const handleAddCourseColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode) return;
    const code = newCourseCode.toUpperCase().trim();
    const updated = { ...courseColors, [code]: selectedColor };
    onUpdateSettings({ courseColors: updated });
    setNewCourseCode('');
  };

  const handleRemoveCourseColor = (code: string) => {
    const updated = { ...courseColors };
    delete updated[code];
    onUpdateSettings({ courseColors: updated });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[900px] mx-auto w-full">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Settings & Verified Courses
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Verified course list auto-extracted from your D2L feeds, schedule, and assignments.
        </p>
      </div>

      {/* Auto-Discovered Verified Courses Manager */}
      <div className="uw-card p-6 flex flex-col gap-4 border-[var(--c4)]">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Enrolled Courses ({allCourses.length})
            </h3>
            <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
              Automatically verified from your D2L calendar, announcements, and schedule items.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {allCourses.length === 0 ? (
            <p className="mono-text text-xs text-[var(--c3)] py-4 text-center">
              No courses discovered yet. Sync your D2L feed URL or add classes to verify courses!
            </p>
          ) : (
            allCourses.map((code) => {
              const currentColor = courseColors[code] || PRESET_COLORS[0].hex;

              return (
                <div
                  key={code}
                  className="uw-card p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[var(--border)]"
                  style={{ backgroundColor: currentColor }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 border border-[var(--border)] shrink-0"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div>
                      <span className="font-mono font-bold text-sm text-[var(--c5)]">{code}</span>
                      <span className="mono-label text-[0.68rem] block text-[var(--c3)]">verified course</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="mono-label text-[0.68rem]">accent color:</span>
                    <div className="flex items-center gap-1.5">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => handleSetCourseColor(code, preset.hex)}
                          className={`w-5 h-5 border transition-all ${
                            currentColor === preset.hex ? 'border-[var(--c5)] scale-125' : 'border-[var(--border)]'
                          }`}
                          style={{ backgroundColor: preset.hex }}
                          title={preset.name}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleRemoveCourseColor(code)}
                      className="text-[var(--c3)] hover:text-rose-500 p-1 transition-colors ml-1"
                      title="Reset course color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Manual Course Code Addition */}
        <form onSubmit={handleAddCourseColor} className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
          <span className="mono-label">add manual course code</span>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. ECE 105 or CS 246"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
            />

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {PRESET_COLORS.map((preset) => (
                <button
                  type="button"
                  key={preset.hex}
                  onClick={() => setSelectedColor(preset.hex)}
                  className={`w-6 h-6 border transition-all ${
                    selectedColor === preset.hex ? 'border-[var(--c5)] scale-110' : 'border-[var(--border)]'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                />
              ))}
            </div>

            <button
              type="submit"
              className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)] shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>add course</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recommended Outlook Sync Method Banner */}
      <div className="uw-card p-6 border-emerald-500/40 bg-emerald-500/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="uw-tag bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-bold flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            outlook 365 bridge (recommended)
          </span>
          <a
            href="https://outlook.office.com/calendar/"
            target="_blank"
            rel="noopener noreferrer"
            className="uw-button text-xs"
          >
            <span>open uwaterloo outlook</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <h3 className="font-sans font-bold text-base text-[var(--c5)]">
          Syncing via UWaterloo Outlook (Zero 403 Errors & Automatic Updates)
        </h3>

        <ol className="list-decimal list-inside flex flex-col gap-1.5 font-mono text-xs text-[var(--c5)] mt-1">
          <li>Log in to <strong>learn.uwaterloo.ca</strong> &rarr; Calendar &rarr; Subscribe &rarr; Copy D2L link.</li>
          <li>Open <strong>Outlook Calendar</strong> (using your @uwaterloo.ca login) &rarr; Add Calendar &rarr; Subscribe from web &rarr; Paste D2L link.</li>
          <li>In Outlook Settings &rarr; Shared Calendars &rarr; Publish Calendar &rarr; Copy Outlook's `.ics` link.</li>
          <li>Paste that Outlook `.ics` link into the Feed URL box below!</li>
        </ol>
      </div>

      {/* D2L / Outlook Calendar Feed Setup */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <h3 className="font-sans font-bold text-base text-[var(--c5)]">
            Calendar Feed URL (Learn or Outlook iCal)
          </h3>
          <span className="uw-tag bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold">
            auto sync
          </span>
        </div>

        <form onSubmit={handleSaveUrl} className="flex flex-col gap-3">
          <label className="mono-label">calendar feed url (.ics / webcal)</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://outlook.office365.com/owa/calendar/.../reachcalendar.ics"
              value={feedInput}
              onChange={(e) => setFeedInput(e.target.value)}
              className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
            />
            <button
              type="submit"
              className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)] shrink-0"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>saved</span>
                </>
              ) : (
                <span>save feed url</span>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onSyncD2L}
            disabled={isSyncing || !settings.d2lFeedUrl}
            className="uw-button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'fetching feed...' : 'sync now'}</span>
          </button>

          {settings.lastSyncedAt && (
            <span className="mono-text text-[0.7rem] text-[var(--c3)]">
              Last synced: {new Date(settings.lastSyncedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {syncMessage && (
          <div className="p-3 border border-amber-500/30 bg-amber-500/5 text-xs font-mono text-[var(--c5)] mt-1">
            {syncMessage}
          </div>
        )}
      </div>

      {/* Alternative Direct File Upload / Paste */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[var(--c3)]" />
            Direct .ics File Upload / iCal Paste (Offline Backup)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 p-4 border border-[var(--border)] bg-[var(--c1)]/20">
            <span className="mono-label flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload .ics File
            </span>
            <input
              type="file"
              accept=".ics,.ical"
              onChange={handleFileUpload}
              className="font-mono text-xs text-[var(--c5)] file:mr-3 file:py-1.5 file:px-3 file:border file:border-[var(--border)] file:bg-[var(--bg)] file:text-[var(--c5)] file:font-mono file:text-xs hover:file:border-[var(--c3)] cursor-pointer"
            />
          </div>

          <form onSubmit={handlePasteImport} className="flex flex-col gap-2 p-4 border border-[var(--border)] bg-[var(--c1)]/20">
            <span className="mono-label flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Paste iCal / ICS Text
            </span>
            <textarea
              placeholder="BEGIN:VCALENDAR..."
              rows={2}
              value={icsTextPaste}
              onChange={(e) => setIcsTextPaste(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-2 font-mono text-[0.68rem] text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
            />
            <button
              type="submit"
              disabled={!icsTextPaste.trim()}
              className="uw-button text-xs self-end"
            >
              <span>import pasted text</span>
            </button>
          </form>
        </div>

        {uploadNotice && (
          <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-600 font-semibold">
            {uploadNotice}
          </div>
        )}
      </div>

      {/* Data Management & Demo Reset */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-sm text-[var(--c5)]">
          Data Management & Reset
        </h3>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onResetData}
            className="uw-button text-rose-500 border-rose-500/30 hover:border-rose-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>reset to default sample data</span>
          </button>

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
            className="uw-button"
          >
            <Download className="w-3.5 h-3.5" />
            <span>export settings backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
