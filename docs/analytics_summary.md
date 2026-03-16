# Analytics Events and Screen Names Summary

## Table of Contents
- [Events Currently Generated](#events-currently-generated)
  - [Session and App Lifecycle Events](#session-and-app-lifecycle-events)
  - [Screen and Navigation Events](#screen-and-navigation-events)
  - [Level and Gameplay Events](#level-and-gameplay-events)
  - [Player Management Events](#player-management-events)
  - [Subscription and Assessment Events](#subscription-and-assessment-events)
  - [Debug and Miscellaneous Events](#debug-and-miscellaneous-events)
- [Detailed Event Documentation](#detailed-event-documentation)
  - [TimeTaken Event](#timetaken-event)
  - [DebugInfo Event](#debuginfo-event)
  - [screen_view Event](#screen_view-event)
  - [PlayerSessionStart vs segmentStarted](#playersessionstart-vs-segmentstarted)
- [Screen Names and Descriptions](#screen-names-and-descriptions)
  - [Core Game Screens](#core-game-screens)
  - [Player Management Screens](#player-management-screens)
  - [Settings and Configuration](#settings-and-configuration)
  - [Subscription and Monetization](#subscription-and-monetization)
  - [Utility and Special Screens](#utility-and-special-screens)
  - [Ignored/Overlay Elements (Not Full Screens)](#ignoredoverlay-elements-not-full-screens)
- [Custom Dimensions in GA4](#custom-dimensions-in-ga4)
  - [Root Cause For (not set) values](#root-cause-for-not-set-values)
- [Troubleshooting Common GA Issues](#troubleshooting-common-ga-issues)
  - [Events Not Appearing in GA](#events-not-appearing-in-ga)
  - ["(not set)" Values in Custom Dimensions](#not-set-values-in-custom-dimensions)
  - [Drop-Off Analysis](#drop-off-analysis)
  - [General Tips](#general-tips)

## Events Currently Generated
The following is a comprehensive list of analytics events sent by the app, based on the `Analytics.sendEvent` calls in `UserEvents.gd` and related code. These track user behavior, gameplay, and app lifecycle.

### Session and App Lifecycle Events
- **GameFirstStart**: Fired when the game is started for the first time.
- **PlayerSessionStart**: Fired at the start of a player session, includes duration and player age data.
- **PlayerSessionFinish**: Fired at the end of a player session, includes duration and player age data.
- **SubscriptionOpened**: Fired when the subscription screen is opened.

### Screen and Navigation Events
- **TimeTaken**: Tracks time spent on screens, with parameters like screen name and duration.
- **SettingsChanged**: Fired when user settings are updated, includes changed setting keys and values.
- **screen_view**: Standard Firebase/GA4 event fired when a screen is displayed. Automatically populated with `screen_name` parameter.

### Level and Gameplay Events
- **LevelData**: A versatile event used for various level-related actions, with a "type" parameter indicating:
  - `levelStarted`: When a level begins, includes level ID, skill age, and player data.
  - `levelDropped`: When a level is abandoned, includes moves, duration, and board count.
  - `levelStaged`: When progressing through level stages, includes segment info (training/testing), attempt count, and move data.
  - `levelCompleted`: When a level is successfully finished, includes score, moves, and duration.
  - `levelFailed`: When a level fails, includes moves and duration.
- **Score**: Fired alongside level completion, includes score and level data.
- **LevelLoaded**: Fired when a level is loaded, includes level properties.
- **segmentStarted**: Fired when a level segment begins, includes player ID, level details, and attempt info.
- **segmentDropped**: Fired when a segment is dropped, includes moves and duration.
- **segmentCompleted**: Fired when a segment is completed, includes status (success/fail) and metrics.

### Player Management Events
- **PlayerCreate**: Fired when a new player is created, includes gender and age.
- **PlayerDelete**: Fired when a player is deleted, includes gender and age.
- **PlayerUpdate**: Fired when player properties are updated, includes gender and age.

### Subscription and Assessment Events
- **GameSubscription**: Fired when a subscription is created, includes plan type.
- **assessmentCompleted**: Fired when an assessment is completed, includes assessment data.

### Debug and Miscellaneous Events
- **DebugInfo**: Fired for logging debug information, includes custom properties (e.g., screen, source, event for UI interactions). Used for funnel analysis and UX debugging (button clicks, wizard steps, cancellations).

These events are published internally via a PubSub system and translated into analytics events in `UserEvents.gd`. They include player data like age and various gameplay metrics for tracking and analysis.

## Detailed Event Documentation

### TimeTaken Event
**Purpose:** Tracks the duration a user spends on each screen before navigating to another.

**When fired:** When a screen transition occurs (via `ScreenManager.changeScreen()`), the `TimeTaken` event is sent for the previous screen.

**Payload parameters:**
- `type` (string): "screen" — indicates this is a screen-level timing event.
- `screen` (string): Name of the screen the user just exited (e.g., "Home", "Level", "Profile").
- `duration` (integer): Time in seconds spent on the screen.
- `age_in_days` (string): Current player's age in days (auto-included via `_includeCurrentPlayerData`).

**Example:** `{"type":"screen","screen":"Level","duration":45,"age_in_days":"365"}`

**GA4 usage:**
- Register `duration` as a custom metric in GA4 to compute average/median screen dwell time.
- Segment by `screen` to identify which screens players spend most time on.
- Use Explorations to correlate screen time with engagement or drop-off.

**Code location:** `autoload/UserEvents.gd::_onScreenPassed()`

---

### DebugInfo Event
**Purpose:** Lightweight telemetry for UI interactions, flow debugging, and QA. Primarily used to build funnels and track user journeys through wizards and settings.

**When fired:** Published when UI elements are interacted with (button clicks, form selections, confirmations, cancellations) across various screens.

**Standard payload parameters:**
- `screen` (string): Current screen name where the interaction occurred (e.g., "ProfileWizard", "Home").
- `source` (string): The UI element or logical component triggering the event (e.g., "avatar", "DatePicker", "Save", "DeleteConfirm").
- `event` (string): The action/state (e.g., "Picked", "Click", "Changed", "Cancelled").

**Examples:**
- `{"screen":"ProfileWizard","source":"avatar","event":"Picked"}`
- `{"screen":"Home","source":"Start","event":"Click"}`
- `{"screen":"ProfileWizard","source":"gender","event":"Cancelled"}`

**GA4 usage:**
- Build funnels using Funnel Exploration: Filter by `event_name = DebugInfo` and add parameter filters like `source = "avatar" AND event = "Picked"`.
- Track abandonment: Identify steps with high "Cancelled" rates to diagnose UX friction.
- Flow analysis: Segment by `screen` to understand different user journeys (e.g., profile creation vs. profile editing).

**Code location:** Published in `scenes/screens/profile/playerDetails.gd`, `scenes/screens/home/main.gd`, `scenes/DOB/main.gd`, and other UI scripts via `PubSub.publish("logDebugInfo", {...})`, then aggregated in `autoload/UserEvents.gd::_onLogDebugInfo()`.

---

### screen_view Event
**Purpose:** Standard Firebase/GA4 event that records when a user navigates to a new screen. This is the primary event for screen-level analytics in GA4.

**When fired:** Called when a screen becomes visible (via `ScreenManager.changeScreen()` → `Analytics.setScreen(screenName)`).

**Payload parameters (auto-populated by Firebase):**
- `screen_name` (string): The name of the screen being displayed (e.g., "Home", "Level", "Profile").
- `firebase_screen_class` / `screen_class` (string): Platform-level identifier (managed by Firebase SDK).

**GA4 usage:**
- Navigation report: View screen popularity and transition sequences.
- Session flow: Start with `screen_view` events to understand user journeys.
- Combine with `TimeTaken` to compute engagement metrics (time per screen).
- Filter in Reports: GA4 → Events → `screen_view` to see screen traffic trends.

**Code location:** `autoload/UserEvents.gd::_onScreenChanged()` calls `Analytics.setScreen(screenName)`, which triggers the Firebase SDK to log `screen_view`.

---

### PlayerSessionStart vs segmentStarted
**Scope & Hierarchy:**

| Aspect | **PlayerSessionStart** | **segmentStarted** |
|--------|----------------------|-------------------|
| **Level** | App session (top-level) | Individual puzzle/board within a level |
| **When fired** | User launches the app and starts playing | User begins a specific level segment (training or testing phase) |
| **Frequency** | Once per app session | Multiple times per level (one per board/puzzle) |
| **Timer** | `sessionTimer` (tracks overall playtime) | `segmentTimer` (resets per segment) |
| **Payload** | `duration`, `age_in_days` | `playerID`, `level`, `type` (assessment/main), `segment` (training/testing), `branch`, `currentSkillAge`, `branchSkillAge`, `attempt`, `boardIndex`, `boardCount`, `wrongMoves`, `rightMoves`, `duration` |

**Sequence in a typical play session:**

```
App Launch
  ↓
PlayerSessionStart (fired) ← "User started playing"
  ↓
User selects Level 5
  ↓
LevelData (levelStarted) ← "Level is loaded"
  ↓
Segment 1 (Training Board 1)
  ├─ segmentStarted (fired) ← "User starts first puzzle"
  ├─ Player solves it
  └─ segmentCompleted (fired) ← "User completed segment 1"
  ↓
Segment 2 (Training Board 2)
  ├─ segmentStarted (fired) ← "User starts second puzzle"
  ├─ Player solves it
  └─ segmentCompleted (fired) ← "User completed segment 2"
  ↓
Segment 3 (Testing Board)
  ├─ segmentStarted (fired) ← "User starts test puzzle"
  ├─ Player solves it
  └─ segmentCompleted (fired) ← "User completed segment 3"
  ↓
LevelData (levelCompleted) ← "Level finished"
  ↓
[User plays another level or exits]
  ↓
PlayerSessionFinish (fired) ← "User ended session"
```

**GA4 Analysis patterns:**

1. **Session metrics:** Use `PlayerSessionStart.duration` to measure total playtime per session.
2. **Segment-level performance:** Use `segmentCompleted` events to analyze per-board completion rates and average duration.
3. **Attempt tracking:** `segmentStarted.attempt` shows if a user is retrying a segment (attempt > 1).
4. **Dropout funnels:** Compare `segmentStarted` vs `segmentCompleted` counts to identify hard segments.
5. **Player segmentation:** Combine both events with `playerID` / `age_in_days` for cohort analysis.

**Code locations:**
- `autoload/UserEvents.gd::_onPlayerSessionStart()` — fires PlayerSessionStart.
- `autoload/UserEvents.gd::_onSegmentStarted()` — fires segmentStarted.

---

## Screen Names and Descriptions
The following is a list of all screen names (node names in the main scene at `scenes/screens/main/main.tscn`) and their descriptions. These are the valid `screenName` values passed to `ScreenManager.changeScreen()`.

### Core Game Screens
- **Home**: The main menu/home screen where players start the game. Displays profile info, score, and navigation buttons (e.g., to levels, settings, or player reports). Handles play mode setup and audio.
- **Level**: The active gameplay screen for playing math levels. Manages level progression, boards, scoring, speedruns, and transitions to completion or failure screens. Includes logic for assessments and segment tracking.
- **Complete**: The level completion screen shown after successfully finishing a level. Displays score with animations, confetti, and options to proceed (next level, replay, or random branch). Updates player progress and handles assessment completions.
- **LevelsSelection**: A screen for selecting levels or branches. Allows players to choose specific levels to play, with navigation back to the home or level screens.

### Player Management Screens
- **Profile**: Player profile management screen. Handles creating, selecting, or editing player profiles (e.g., name, gender, DOB). Includes player details, deletion, and report generation.
- **PlayerReport**: Displays detailed player reports/progress. Shows stats like levels completed, scores, and time played. Accessible from profile or completion screens.
- **Onboard**: Onboarding/tutorial screen for new players. Guides users through initial setup, likely including slides or intro content.

### Settings and Configuration
- **Settings**: General app settings screen. Allows changing audio, timeouts, and other preferences. Triggers settings update events when exited.
- **DebugSettings**: Debug-specific settings (likely for development/testing). Probably includes options for debugging features not available in regular settings.
- **FeatureCheck**: Feature availability check screen. Verifies device capabilities (e.g., TTS, screen size) and redirects accordingly.
- **Consent**: Consent/privacy screen. Handles user consent for data collection, shown on first launch or as needed.
- **Messages**: In-app messages screen. Displays read/unread messages (e.g., tips or updates) before allowing access to the home screen.

### Subscription and Monetization
- **Subscription**: Subscription management screen. Shows plans, handles purchases, and tracks subscription status. Triggers analytics events when opened.
- **AgeGate**: Age verification screen. Appears before accessing certain screens (e.g., Profile, Settings, Subscription, PlayerReport) to ensure age-appropriate content.

### Utility and Special Screens
- **About**: About/info screen. Provides app information, version details, and links (e.g., to feature checks).
- **Slides**: Dynamic slides screen. Displays configurable slide content (e.g., tutorials or stories) with navigation to a next screen (default: Home).
- **TimeOut**: Timeout screen. Shown when playtime limits are reached, preventing further level access until reset.
- **Loader**: Loading screen (likely shown during app startup or transitions).
- **Main**: The root/main screen container (not a user-facing screen, but manages others).

### Ignored/Overlay Elements (Not Full Screens)
These are not treated as screens by `ScreenManager` (filtered out via `ignoreScreens`):
- **DebugStats**: Debug statistics overlay (monitor for performance metrics).
- **BuildId**: Build/version ID display overlay.
- **HomeButton**: Persistent home navigation button overlay.
- **HelpButton**: Persistent help button overlay.
- **Toast**: Toast notification overlay (handled separately).

Some screens have conditional logic (e.g., AgeGate appears based on user age and target screen).

## Custom Dimensions in GA4
Based on your GA4 setup, the following custom dimensions are defined to pull from event parameters.

- **type** (Scope: Event, Parameter: type): Populated for `LevelData` (e.g., "levelStarted") and segment events (e.g., "assessment"). "(not set)" for most other events.
- **gender** (Scope: Event, Parameter: gender): Populated for player CRUD events (`PlayerCreate`, `PlayerDelete`, `PlayerUpdate`). "(not set)" for most other events.
- **skillAge** (Scope: Event, Parameter: skill_age): Populated for `LevelData` events (e.g., "5 Y"). "(not set)" for most other events.

### Root Cause For (not set) values
"(not set)" appears for events missing the parameter, which is common for non-level/player-specific events. This is by design, as these parameters are only included in specific event types to avoid bloating payloads.

## Troubleshooting Common GA Issues
### Events Not Appearing in GA
- **Cause**: Firebase not initialized or linked to GA.
- **Steps**:
  1. Check console for "Firebase initialized successfully" (added debug prints in `Analytics.gd`).
  2. Ensure Firebase project is linked to GA4 in Firebase Console > Project Settings > Integrations.
  3. Verify data stream in GA > Admin > Data Streams shows events in Realtime.
  4. Test by triggering events and checking Firebase Console > Analytics > Events.

### "(not set)" Values in Custom Dimensions
- **Cause**: Parameter not included in event payload.
- **Steps**:
  1. Confirm parameter name in Custom Definitions matches code (e.g., "type" for LevelData).
  2. Check event payloads in `UserEvents.gd` (e.g., "gender" only in player CRUD).
  3. To fix, add missing params to more events (e.g., include "gender" in session events if needed).
  4. Filter reports to exclude "(not set)" or segment by event name.

### Drop-Off Analysis
- **Cause**: User flow interruptions.
- **Steps**:
  1. Use GA Funnel Exploration for flows like profile creation.
  2. Identify weak steps (e.g., high drop-off at "dob" in wizard).
  3. Check debug events for "Cancelled" sources.
  4. Test changes with GA Experiments.
  - **Funnel Setup with DebugInfo**:
    - Go to GA > Explore > Funnel Exploration.
    - Set Date Range (e.g., Last 30 days).
    - Add Steps: Use Event = "DebugInfo" with filters (e.g., Step 1: `source` = "avatar" and `event` = "Picked"; Step 2: `source` = "gender" and `event` = "Picked").
    - View Abandonment Rate: See % who start but drop at each step (e.g., high "Cancelled" events indicate issues).
    - Breakdown: Add dimension like "screen" to segment by flow (e.g., ProfileWizard vs. general Profile).

### General Tips
- Use GA DebugView/Realtime for live testing.
- Ensure app is built with Firebase enabled (check `export_presets.cfg`).
- For historical data, use BigQuery if needed.</content>
<parameter name="filePath">/home/pdn/dev/abs/gd-math-godot/analytics_summary.md
