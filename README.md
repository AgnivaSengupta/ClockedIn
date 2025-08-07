# 📱 Attendance Tracker App

A mobile app built with **React Native (Expo)** to help college students track and maintain the minimum 75% attendance requirement. The app offers a subject-wise view, class schedules, and clean visuals to make attendance tracking simple and effective.

---

## 🚀 Features

### ✅ Completed

- **🎯 User Onboarding**  
  Set your name, weekly class schedule, and target attendance percentage.  
  *(Currently stored in memory using Zustand – persistent storage via MMKV is upcoming)*

- **📅 Daily Attendance Overview**  
  Home screen displays today’s classes and current attendance percentage per subject.

- **📆 Expandable Weekly Calendar**  
  Check which classes are scheduled on any day with a clean calendar interface.

- **🧭 Bottom Navigation Bar**  
  Navigate between Home, Schedule, History, and Settings pages with a custom-designed bottom nav.

- **📄 Subject Management**  
  View and manage each subject individually, with planned per-subject attendance history calendar.

---

### 🛠️ In Progress

- **📦 Persistent Storage with MMKV**  
  To save attendance data and user preferences locally using high-performance storage.

- **📊 Subject-wise Attendance Calendar View**  
  Visualize attendance history (present, absent, no class) per subject in a calendar format.

- **🕒 Reanimated Clock UI**  
  Animated flip-clock style time display on the Home screen.

- **🌙 Dark Mode Support**  
  Toggle between light and dark themes.

- **🧮 Improved Attendance Logic**  
  Fixing edge cases in attendance percentage calculation.

- **✨ Onboarding Animations**  
  Smooth and intuitive animations using Reanimated for better UX.

---

## 🧑‍💻 Tech Stack

- **React Native (Expo)**
- **Zustand** – global state management
- **React Native Calendars** – calendar components
- **MMKV (Planned)** – for persistent offline storage
- **React Native Reanimated (Planned)** – for animations

---

## 📸 Screenshots

_(Coming soon)_ — Will include UI previews of the home screen, calendar, and subject pages.

---

## 🔮 Upcoming Enhancements

- Attendance analytics and graphs
- Notification reminders before classes
- Cloud sync or export/backup functionality
- Customizable attendance rules

---

## 📁 Project Structure (Simplified)

```bash
.
├── app/                            # Core screens and tabs
│   ├── (tabs)/                     # Bottom tab views (calendar, home, history)
│   │   ├── calendar.tsx
│   │   ├── home.tsx
│   │   └── history.tsx
│   ├── onboarding/                # Onboarding screens (username, schedule, target)
│   ├── settings/                  # Settings (Dark mode, etc.)
│   ├── splash/                    # Splash or loading components
│   ├── subject-history/          # Subject-wise history (calendar view - WIP)
│   ├── support/                   # Possibly helper screens
│   ├── _layout.tsx               # App layout wrapper
│   └── index.tsx                 # App entry point
│
├── components/
│   ├── ui/                        # UI components
│   ├   ├── attendanceCard.tsx
│   ├   └── customNavbar.tsx
│   └── Scheduler.tsx
│
├── store/                         # Zustand state stores
│   ├── attendanceStore.ts
│   └── useAppStore.ts
│
├── utils/                         # Utility functions, helpers, constants
│
├── assets/                        # Fonts, images, splash screens, etc.
│
├── .gitignore
├── app.json
├── package.json
├── README.md
└── tsconfig.json
