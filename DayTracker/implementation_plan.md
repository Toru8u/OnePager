# Day Tracking App Implementation Plan

## Goal Description
Build a single-page HTML application for tracking daily habits (Eating, Toilette, Sports, Mood, Sleeping). The app will be client-side only, using LocalStorage (referred to as cookies/storage by user intent) for persistence. It will feature a "Premium" design with glassmorphism, dark mode, and smooth animations. It will support multiple users via a profile selection mechanism.

## User Review Required
> [!IMPORTANT]
> **Storage Method**: The request mentioned "cookies". I will use **LocalStorage** instead because Cookies are limited to 4KB (too small for a tracking history) and are sent with every server request (inefficient). LocalStorage provides ~5MB and is standard for client-side apps. I will still include the requested "Cookie/Storage Consent" popup.

> [!NOTE]
> **Single File vs. Multi File**: I will develop this as standard `index.html`, `style.css`, and `script.js` for maintainability. If you strictly need a **single physical file** (all code inlined), please let me know, and I can bundle it at the end.

## Proposed Changes

### Core Structure
#### [NEW] [index.html](file:///Users/harbig/Projects/AntigravityTest/index.html)
- Main entry point.
- Contains the DOM structure:
    - **Consent Modal**: For GDPR/Privacy compliance.
    - **Login/Profile Screen**: To handle "multi-user" sessions.
    - **Main Dashboard**:
        - Header with User Profile & Date Picker.
        - **Input Section**: Tabs or Cards for each category (Eating, Toilette, Sports, Mood, Sleeping).
        - **Time Selector**: Morning, Noon, Evening, Night.
        - **Feed Section**: Reverse chronological list of entries.

#### [NEW] [style.css](file:///Users/harbig/Projects/AntigravityTest/style.css)
- **Design System**:
    - Dark Mode theme (Deep blues/purples/blacks).
    - Glassmorphism effects (backdrop-filter: blur).
    - Animations for transitions and interactions.
    - Responsive layout (Mobile-first).

#### [NEW] [script.js](file:///Users/harbig/Projects/AntigravityTest/script.js)
- **State Management**:
    - `currentUser`: String.
    - `entries`: Array of objects `{ id, timestamp, dateStr, timeOfDay, category, content, emoji }`.
- **Storage Layer**:
    - Wrapper around `localStorage` namespaced by user (e.g., `tracker_user_Harbig`).
- **UI Logic**:
    - Rendering the feed.
    - Handling form inputs.
    - "Edit" mode for existing entries.

## Verification Plan

### Automated Tests
- I will use the browser tool to open the page and verify:
    - Consent modal appears.
    - Profile creation works.
    - Data entry persists after reload.
    - Switching users shows different data.

### Manual Verification
- Check aesthetics (Glassmorphism, animations).
- Verify "Edit" functionality changes the specific item without losing order.
