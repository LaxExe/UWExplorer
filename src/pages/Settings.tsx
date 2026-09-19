import React from 'react';
import { UserSettings } from '../types';
import { Download, RotateCcw, Sliders } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-[900px] mx-auto w-full">
      <div>
        <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
          Settings & Preferences
        </h2>
        <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
          Theme preferences and data backups for your local student dashboard.
        </p>
      </div>

      {/* Appearance */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-base text-[var(--c5)] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--c3)]" />
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <span className="font-sans font-bold text-sm text-[var(--c5)]">Color Mode</span>
            <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
              Switch between Light and Dark visual modes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`uw-button ${settings.theme === 'light' ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              light mode
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`uw-button ${settings.theme === 'dark' ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              dark mode
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="uw-card p-6 flex flex-col gap-4">
        <h3 className="font-sans font-bold text-sm text-[var(--c5)]">
          Data Management & Backup
        </h3>

        <p className="mono-text text-xs text-[var(--c4)] leading-relaxed">
          All your course data, task items, and schedule entries are stored locally on your device in <code className="bg-[var(--c1)] px-1.5 py-0.5 border border-[var(--border)]">localStorage</code> and <code className="bg-[var(--c1)] px-1.5 py-0.5 border border-[var(--border)]">data/uwexplorer_db.json</code>.
        </p>

        <div className="flex items-center gap-4 flex-wrap pt-2">
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
            className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>export data backup (.json)</span>
          </button>

          <button
            onClick={onResetData}
            className="uw-button text-rose-500 border-rose-500/30 hover:border-rose-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>reset to default clean data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
