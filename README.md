# UWexplorer 🧭

> A clean, minimalist dashboard & campus hub for University of Waterloo students. Track D2L Learn announcements, assignments, and due date deadlines alongside quick links to **WaterlooWorks**, Quest, Outlook, and UW services.

---

## ⚙️ Configuration File Setup (`data/config.json`)

UWexplorer includes a central configuration file located at **`data/config.json`** to manage your feed URLs, theme preferences, course colors, and sidebar order.

### `data/config.json` Schema
```json
{
  "d2lFeedUrl": "https://learn.uwaterloo.ca/d2l/le/calendar/feed/user/feed.ics?...",
  "theme": "light",
  "autoSyncIntervalMinutes": 15,
  "courseColors": {
    "CS 135": "#3b82f61a",
    "MATH 135": "#10b9811a",
    "MATH 137": "#8b5cf61a",
    "ENGL 109": "#f59e0b1a",
    "PHYS 121": "#ef44441a",
    "LEARN": "#64748b1a"
  },
  "sidebarOrder": [
    "dashboard",
    "schedule",
    "links",
    "announcements",
    "assignments",
    "calendar",
    "settings"
  ]
}
```

---

## 🚀 Quick Start & Setup Guide

### 1. Clone & Install
```bash
git clone https://github.com/LaxExe/UWExplorer.git
cd UWExplorer
npm install
```

### 2. Configure Your D2L Calendar Feed
1. Log in to **[learn.uwaterloo.ca](https://learn.uwaterloo.ca/)** &rarr; **Calendar** &rarr; **Subscribe**.
2. Copy your unique **Calendar Feed URL** (`.ics` / webcal link).
3. Paste it into `data/config.json` under `"d2lFeedUrl"` (or via the in-app Settings UI).

*(Recommended for zero 403 errors: Subscribe to your D2L calendar link inside **UWaterloo Outlook Calendar** (`outlook.office.com`) &rarr; Publish calendar &rarr; paste the Outlook `.ics` link into `data/config.json`!)*

### 3. Start the Web App & Auto-Sync Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Background Downloader Engine (CLI)
To manually pull down the latest `.ics` file directly to your disk at any time:
```bash
node scripts/sync-d2l.js
```

---

## 🗄️ On-Disk File Storage System

All your data lives locally on your computer in `/Users/lakshman/Small Projects/UWexplorer/data/`:
- **`data/d2l_calendar.ics`**: Saved raw `.ics` feed downloaded from D2L/Outlook.
- **`data/uwexplorer_db.json`**: Saved student metadata (read/unread status, task completion, course colors, schedule, custom deadlines).
- **`data/config.json`**: Saved configuration settings.

---

## License

MIT License © 2026 LaxExe
