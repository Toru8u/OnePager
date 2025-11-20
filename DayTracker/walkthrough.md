# Day Tracking App Walkthrough

I have built a single-page Day Tracking application that allows you to track daily habits, mood, and activities. The app uses **LocalStorage** to save data directly in your browser, ensuring privacy and multi-user capability without a backend server.

## Features

### 1. Premium Design
- **Glassmorphism UI**: Modern, translucent cards with a deep dark mode background.
- **Animations**: Smooth transitions for entries and interactions.
- **Responsive**: Works on desktop and mobile.

### 2. Multi-User Support
- Create multiple profiles (e.g., "User1", "User2").
- Each user has their own separate data storage.
- Easy switching between users.

### 3. Data Entry & Management
- **Date Picker**: Choose any date to add entries.
- **Time Periods**: Morning, Noon, Evening, Night.
- **Categories**: Eating, Toilette, Sports, Mood, Sleeping.
- **Emojis & Text**: Select from curated emojis or type custom notes.
- **Edit & Delete**: Modify or remove past entries easily.

### 4. Activity Feed
- **Grouped History**: Entries are shown in a continuous feed, grouped by "Today", "Yesterday", and specific dates.
- **Reverse Chronological**: Newest entries appear at the top.

## Verification

I have verified the core functionality using an automated browser agent.

### Feed Grouping Verification
I verified that entries are correctly grouped by date (Today vs Yesterday).

![Feed Grouping](/Users/harbig/.gemini/antigravity/brain/f1e611b8-91b5-421d-a6b2-72bb1a84aaf7/feed_with_today_yesterday_1763617885364.png)

### Full Feature Verification
I also verified the entire flow:
1.  Consent Modal
2.  User Creation/Login
3.  Entry Creation
4.  Editing
5.  Logout

![Full Verification Recording](/Users/harbig/.gemini/antigravity/brain/f1e611b8-91b5-421d-a6b2-72bb1a84aaf7/verify_app_refined_1763617809949.webp)

## How to Run
Simply open `index.html` in any modern web browser. No server or installation required.
