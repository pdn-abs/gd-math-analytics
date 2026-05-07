# Segment Tracking Discrepancy Resolution

## Table of Contents
- [The Problem](#the-problem)
- [Primary Reasons for Discrepancy](#primary-reasons-for-discrepancy)
  - [1. The Retry Overlap (Sum > Started)](#1-the-retry-overlap-sum-started)
  - [2. Force-Closes and Crashes (Sum < Started)](#2-force-closes-and-crashes-sum-started)
  - [3. GA4 Sampling & Known Undercounting](#3-ga4-sampling-known-undercounting)
- [How to Overcome This Discrepancy](#how-to-overcome-this-discrepancy)
  - [1. Implement 'Attempt IDs' (Godot / Code Fix)](#1-implement-attempt-ids-godot-code-fix)
  - [2. Calculate "Implicit Drops" (BigQuery / SQL Fix)](#2-calculate-implicit-drops-bigquery-sql-fix)
  - [3. Handle App Suspensions in Godot (Code Fix)](#3-handle-app-suspensions-in-godot-code-fix)
  - [4. Switch from "Unique Users" to "Total Events" in CSV Analysis](#4-switch-from-unique-users-to-total-events-in-csv-analysis)

---


## The Problem
In analytics CSV exports tracking user segments, the total number of unique users for `segmentCompleted` plus `segmentDropped` frequently does not perfectly match the `segmentStarted` unique user count.

## Primary Reasons for Discrepancy

### 1. The Retry Overlap (Sum > Started)
Analytics platforms count **unique users per event**. If a single user starts a level, gets frustrated and quits (`segmentDropped`), and then comes back later to try again and succeeds (`segmentCompleted`), they are counted as 1 distinct user in "Started", 1 in "Dropped", and 1 in "Completed". This adds 2 to the sum of the outcome events, but only 1 to the "Started" count.

### 2. Force-Closes and Crashes (Sum < Started)
A user starts the level (`segmentStarted` fires), but then they force-close the app, their device battery dies, or the app crashes. The session ends abruptly, meaning the game was never cleanly exited. Consequently, neither `segmentDropped` nor `segmentCompleted` is ever sent to the server.

### 3. GA4 Sampling & Known Undercounting
There is a known tracking discrepancy where `segmentDropped` is fundamentally under-reported in some API exports due to aggressive sampling by Google Analytics 4 API, which misses smaller event payloads.

---

## How to Overcome This Discrepancy

To achieve mathematically perfect funnel tracking where `Started == Completed + Dropped`, tracking must transition from "independent user actions" to **"session-scoped attempts"**.

### 1. Implement 'Attempt IDs' (Godot / Code Fix)
* **The Fix:** Generate a unique `attempt_id` (a UUID) the moment `segmentStarted` fires and store it in memory. Pass this exact same `attempt_id` as a custom parameter when firing `segmentCompleted` or `segmentDropped`.
* **Result:** In BigQuery, you can group exactly by `attempt_id`. Every single attempt will have exactly 1 Start and a maximum of 1 End (Complete or Drop), eliminating user-overlap skew.

### 2. Calculate "Implicit Drops" (BigQuery / SQL Fix)
To account for users who force-kill the app or let their battery die:
* **The Fix:** When writing SQL, don't rely solely on the explicit `segmentDropped` event. Use a `LEFT JOIN` or Window Function: If an `attempt_id` (or user session) has a `segmentStarted` event, but *no* `segmentCompleted` or `segmentDropped` event within the next 12-24 hours, classify that as an **Implicit Drop** (or "Force Close").
* **Result:** `Started = Completed + Explicit Dropped + Implicit Dropped`.

### 3. Handle App Suspensions in Godot (Code Fix)
Catch users closing the app before a drop event can fire natively.
* **The Fix:** In Godot's Main loop, listen for `NOTIFICATION_WM_CLOSE_REQUEST` (desktop) or `NOTIFICATION_APPLICATION_PAUSED` (mobile). When these trigger, check if a segment is currently active. If so, immediately flush a `segmentDropped` (or a specific `segmentAbandonedAppClosed`) event before the OS suspends the app.

### 4. Switch from "Unique Users" to "Total Events" in CSV Analysis
If you cannot implement 'Attempt IDs' immediately, adjust your analytical perspective.
* **The Fix:** Stop looking at the "Total Users" column for math validation. Look at the **Raw Event Count** column instead. A user can only be "1 unique person," but 1 user can produce *5 Starts*, *4 Drops*, and *1 Complete*. Counting the raw events will always give you a closer mathematical alignment than unique user identifiers.
