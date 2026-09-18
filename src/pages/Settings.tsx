import React, { useState } from 'react';
import { UserSettings } from '../types';
import { RefreshCw, Download, RotateCcw, Check, Palette, Plus, Trash2 } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onSyncD2L: () => void;
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
  onUpdateSettings,
  onSyncD2L,
  onResetData,
  isSyncing,
  syncMessage,
}) => {
  const [feedInput, setFeedInput] = useState(settings.d2lFeedUrl);
  const [isSaved, setIsSaved] = useState(false);

  // Course Color state
  const [newCourseCode, setNewCourseCode] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f61a');

  const courseColors = settings.courseColors || {};

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ d2lFeedUrl: feedInput.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
    <div className="flex flex-col gap-6 max-w-[900px]">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Settings & Customization
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Configure D2L Learn feed sync, per-course subtle background colors, and data backups.
        </p>
      </div>

      {/* Per-Course Accent Color Customizer */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--c3)]" />
              Per-Course Subtle Background Colors
            </h3>
            <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
              Assign custom background tint colors to courses across your dashboard, assignments, and calendar.
            </p>
          </div>
        </div>

        {/* Existing Course Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(courseColors).map(([code, color]) => (
            <div
              key={code}
              className="uw-card p-3 flex items-center justify-between border-[var(--border)]"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 border border-[var(--border)]"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono font-bold text-xs text-[var(--c5)]">{code}</span>
              </div>

              <button
                onClick={() => handleRemoveCourseColor(code)}
                className="text-[var(--c3)] hover:text-rose-500 p-1 transition-colors"
                title="Remove course color"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Course Color Form */}
        <form onSubmit={handleAddCourseColor} className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
          <span className="mono-label">assign color to course</span>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Course Code (e.g. CS 135)"
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
              <span>add color</span>
            </button>
          </div>
        </form>
      </div>

      {/* D2L Calendar Feed Setup */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h3 className="font-sans font-bold text-base text-[var(--c5)]">
            Waterloo Learn Calendar Feed URL
          </h3>
        </div>

        <p className="mono-text text-xs text-[var(--c4)] leading-relaxed">
          Waterloo Learn provides an iCal feed URL for your registered courses. By subscribing to this feed, UWexplorer fetches your course deadlines client-side.
        </p>

        <form onSubmit={handleSaveUrl} className="flex flex-col gap-3">
          <label className="mono-label">d2l subscribe url (.ics / webcal)</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://learn.uwaterloo.ca/d2l/le/calendar/feed/user/feed.ics?..."
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
          <div className="p-3 border border-[var(--border)] bg-[var(--c1)] text-xs font-mono text-[var(--c5)] mt-1">
            {syncMessage}
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
