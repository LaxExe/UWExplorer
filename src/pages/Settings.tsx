import React, { useState } from 'react';
import { UserSettings } from '../types';
import { RefreshCw, Download, RotateCcw, Check, HelpCircle } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onSyncD2L: () => void;
  onResetData: () => void;
  isSyncing: boolean;
  syncMessage: string | null;
}

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

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ d2lFeedUrl: feedInput.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[900px]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          D2L Learn Feed & Preferences
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Configure zero-auth client-side calendar sync for Waterloo Learn and manage data persistence.
        </p>
      </div>

      {/* D2L Calendar Feed Setup */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <div>
            <span className="mono-label">D2L INTEGRATION</span>
            <h3 className="font-sans font-bold text-base text-[var(--c5)] mt-0.5">
              Waterloo Learn Calendar Feed URL
            </h3>
          </div>
          <span className="uw-tag bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold">
            zero login required
          </span>
        </div>

        <p className="mono-text text-xs text-[var(--c4)] leading-relaxed">
          Waterloo Learn provides an iCal feed URL for your registered courses. By subscribing to this feed, UWexplorer fetches your course deadlines and calendar items client-side without needing your login credentials.
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

      {/* Step-by-Step Instructions */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-sm text-[var(--c5)] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[var(--c3)]" />
          How to Get Your Waterloo Learn iCal Feed URL
        </h3>

        <ol className="list-decimal list-inside flex flex-col gap-2 font-mono text-xs text-[var(--c4)] leading-relaxed">
          <li>Log in to <strong>learn.uwaterloo.ca</strong> in your browser.</li>
          <li>Click on <strong>Calendar</strong> from the top navigation bar.</li>
          <li>Click the <strong>Subscribe</strong> button located at the top of the calendar interface.</li>
          <li>Choose your preferred calendar settings and click <strong>Submit</strong>.</li>
          <li>Copy the generated <strong>Calendar Feed URL</strong> link and paste it into the box above.</li>
        </ol>
      </div>

      {/* Data Management & Demo Reset */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-sm text-[var(--c5)]">
          Data Management & Demo Mode
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
