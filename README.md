# UWexplorer 🧭

> A clean, minimalist dashboard & campus hub for University of Waterloo students. Track D2L Learn announcements, assignments, and due date deadlines alongside quick links to **WaterlooWorks**, Quest, Outlook, and UW services.

---

## Features

- 💼 **WaterlooWorks & Campus Shortcuts**: Direct access to WaterlooWorks (co-op portal), LEARN (D2L), Quest, Outlook Mail, UW Portal, Crowdmark, Piazza, WatIAM, Workday, WUSA, and UW Library.
- 📢 **D2L Announcements Feed**: Streamlined course updates with course tag filtering and keyword search.
- 📋 **Assignments & Deadlines Tracker**: Interactive checklist sorted by due dates with status filters (Pending, Completed, Overdue).
- 📅 **Semester Calendar Grid**: Minimalist visual monthly view of upcoming quizzes, midterms, and project deliverables.
- 🔄 **Zero-Auth D2L Calendar Sync**: Client-side iCal (`.ics`) feed parser that syncs deadlines from Waterloo Learn without requiring user credentials or login tokens.
- 🎨 **Minimalist Design System**: Built with restraint using **Sora** display font, **DM Mono** UI typography, custom 5-token light & dark color palette, sharp 0px card borders, and responsive micro-interactions.

---

## Design System Specifications

UWexplorer enforces strict visual restraint:
- **Fonts**: `Sora` (sans-serif) for headlines & body, `DM Mono` (monospace) for labels, code, and UI controls.
- **Palette**:
  - **Light Theme**: Background (`#ffffff`), Surface (`#f0f0f0`), Text (`#000000`, `#2c2c2c`), Border (`#c8c8c8`).
  - **Dark Theme**: Background (`#000000`), Surface (`#141414`), Text (`#ffffff`, `#cecece`), Border (`#303030`).
- **Borders & Radii**: Sharp 0px card radiuses, 1px solid borders, hover slide fills (`translateX(-100%)` to `translateX(0)`), 2px card lifts (`translateY(-2px)`).

---

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/LaxExe/UWExplorer.git
cd UWExplorer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser to launch the dashboard.

---

## How to Sync Your D2L Calendar Feed

You can automatically import your real Waterloo Learn deadlines into UWexplorer without sharing password details:

1. Log in to **[learn.uwaterloo.ca](https://learn.uwaterloo.ca/)**.
2. Navigate to **Calendar** from the top menu bar.
3. Click the **Subscribe** button.
4. Copy your unique **Calendar Feed URL** (`.ics` / webcal link).
5. Open UWexplorer -> **Settings** -> Paste your feed URL and click **Save & Sync**.

All your course deadlines will be parsed locally and cached in your browser (`localStorage`).

---

## Contributing & License

Contributions are welcome! Feel free to open issues or submit pull requests to add new Waterloo service integrations or features.

MIT License © 2026 LaxExe
