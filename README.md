# UWExplorer — Campus Dashboard for Waterloo Students

UWExplorer is a clean, minimalist desktop and web dashboard for University of Waterloo students. It pulls your D2L Learn calendar feed, turns it into a course-by-course to-do list and schedule, and keeps WaterlooWorks, Quest, Outlook and other campus links one click away. Everything is stored locally on your machine.

**Author:** [Lakshman on GitHub](https://github.com/LaxExe) | **Website:** [lakshman-codes.github.io](https://lakshman-codes.github.io) | **Related:** [HireMe](https://hireme-henna.vercel.app/)

---

## Key Features

- **Dashboard**: One screen for upcoming deadlines, announcements and quick links.
- **Courses and To-Do**: Assignments grouped by course, with read/unread and completion tracking.
- **Schedule and Calendar**: Weekly schedule plus a month calendar built from your D2L feed.
- **Quick Links**: Pinned and categorized links to WaterlooWorks, Quest, Outlook and anything else you add.
- **D2L Auto-Sync**: Downloads your `.ics` calendar feed on an interval (default 15 minutes) and updates the app.
- **Custom Deadlines**: Add your own tasks next to the ones D2L provides.
- **Per-Course Colors and Sidebar Order**: Reorder tabs and color-code courses from Settings.
- **Native Mac App**: Packaged with Electron as a `.dmg` and `.zip`, with a local data server built in.
- **Local-First**: No account and no cloud. Your data lives in JSON files on disk.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18, TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3, Lucide icons |
| Desktop | Electron, electron-builder (macOS) |
| Sync | Node script that downloads and parses the D2L `.ics` feed |

---

## How to Build and Run

### Prerequisites
- **Node.js** 20+
- A D2L Learn calendar feed URL

### 1. Clone and install
```bash
git clone https://github.com/LaxExe/UWExplorer.git
cd UWExplorer
npm install
```

### 2. Configure your D2L feed
1. Sign in to [learn.uwaterloo.ca](https://learn.uwaterloo.ca/), open **Calendar**, and choose **Subscribe**.
2. Copy your personal calendar feed URL.
3. Copy `data/config.example.json` to `data/config.json` and paste the URL into `d2lFeedUrl`, or paste it into the in-app Settings page.

If D2L returns 403 errors, subscribe to the feed in your UWaterloo Outlook calendar, publish it, and use the Outlook `.ics` link instead.

Treat your feed URL like a password. It contains a private token, so never commit it.

### 3. Run the web app
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Run as a desktop app
```bash
npm run build
npm run electron:start
```

### 5. Package for macOS
```bash
npm run electron:build
```

### Manual sync from the command line
```bash
node scripts/sync-d2l.js
```

---

## Configuration (`data/config.json`)

```json
{
  "d2lFeedUrl": "https://learn.uwaterloo.ca/d2l/le/calendar/feed/user/feed.ics?token=...",
  "theme": "light",
  "autoSyncIntervalMinutes": 15,
  "courseColors": { "CS 135": "#3b82f61a", "MATH 135": "#10b9811a" },
  "sidebarOrder": ["dashboard", "courses", "schedule", "links", "calendar", "settings"]
}
```

## Local Data Files

| File | Purpose |
|---|---|
| `data/d2l_calendar.ics` | Raw calendar feed downloaded from D2L or Outlook |
| `data/uwexplorer_db.json` | Task completion, read status, custom deadlines and schedule |
| `data/config.json` | Your settings |

---

## Architecture

```
UWExplorer/
├── electron/
│   └── main.js            # Electron shell and local data server (/api/local-data)
├── scripts/
│   └── sync-d2l.js        # D2L feed downloader, config and DB loaders
├── data/                  # Local storage (config, calendar feed, database)
└── src/
    ├── App.tsx
    ├── components/        # Header, Sidebar
    ├── pages/             # Dashboard, Courses, Schedule, CalendarView, QuickLinks, Settings
    ├── services/
    │   └── d2lSync.ts     # Feed parsing and sync
    ├── data/mockData.ts
    └── types/index.ts
```

---

## About the Author

Built by Lakshman, a first-year Computer Engineering student at the University of Waterloo looking to build more experience. See more at [lakshman-codes.github.io](https://lakshman-codes.github.io).
