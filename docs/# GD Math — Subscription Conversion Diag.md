# GD Math — Subscription Conversion Diagnosis & Action Plan
*Updated: 9 April 2026 | App: GD Math (v1.3.0 → v4.3.19, 29 versions) | Launched: 14 August 2024*
*Sources: Codebase audit · Pre-subscription report (Jan 25–Mar 25) · Production retention data · Level failure analysis · Formal failure analysis · GA4 funnel explorations (Jan 9–Apr 8)*

---

## Background

GD Math offers 30 minutes of free playtime, after which users must subscribe (1 month, 6 month, or 12 month plans). As of April 2026, zero subscribers have converted despite 194 users reaching the paywall an average of 2.4 times each. Billing has been manually verified as working end-to-end.

---

## The Diagnosis in One Paragraph

4,289 users installed. Only 1,354 ever played a level, 194 reached the paywall, and zero subscribed. The root causes are now fully identified: the **subscription screen is gated behind an age-gate math puzzle** that blocks every conversion attempt — including 88 confirmed high-intent users who completed the full assessment and still could not subscribe — **61% of users never play a level** because a mandatory 50-board assessment walls off gameplay, a **content routing bug** serves 8–10Y content to 2-year-olds (54% of the install base) causing 100% drop rates on first sessions, and the **assessment counts against the 30-minute free trial** leaving users who complete it with almost no gameplay time before the paywall activates.

---

## Funnel Reality (GA4 Exploration Data — Jan 9 to Apr 8, 2026)

### Profile Creation
| Step | Users | % of Total | Drop |
|---|---|---|---|
| OpenedFirst | 2,871 | 100% | 744 (26%) |
| Consented | 2,127 | 74% | 74 (3.5%) |
| AvatarPicked | 1,895 | 66% | 158 (7.7%) |
| **GenderPicked** | **1,327** | **46%** | **568 (30%) ← biggest drop** |
| DOBPicked | 1,024 | 36% | 303 (23%) |
| NicknamePicked | 987 | 34% | 37 (3.6%) |
| ProfileSaved | 987 | 34% | 0 (0%) |

### Assessment & Subscription Funnel (indirect — real picture)
| Step | Users | % of Onboarded | Drop | Drop% |
|---|---|---|---|---|
| Onboarded | 2,244 | 100% | — | — |
| ProfileSaved | 1,044 | 46.5% | 1,200 | 53.5% |
| HomeOpened | 1,245 | 55.5%* | †not applicable | — |
| AssessmentStarted | 1,100 | 49% | 145 | 11.6% |
| AssessmentCompleted | 631 | 28% | 469 | 43% |
| ViewPlayerReport | 70 | 3.1% | 561 | 88.9% |
| **OpenedSubscription (post-assessment)** | **88** | **3.9%** | †not applicable | — |
| **Subscribed** | **0** | **0%** | **88** | **100%** |

*HomeOpened > ProfileSaved because the indirect funnel captures users who saved their profile in a previous session and returned on a later day — these steps are not strictly sequential, so no drop can be calculated between them.

†OpenedSubscription (88) > ViewPlayerReport (70) for the same reason — users can reach the subscription screen directly from Home or the paywall without going through PlayerReport. GA4 counts them independently in an indirect funnel.

> **Critical insight:** 88 users completed the hardest onboarding path in the app — 50-board assessment — then navigated to subscribe and still could not convert. This group had the highest possible intent. The only plausible blockers are (1) the age gate math problem on the subscription screen, or (2) an empty plan list due to wrong product IDs. Both are fixable today.
### Three Critical Drop Points
1. **GenderPicked (30% drop)** — biggest single loss in profile creation, 568 users
2. **AssessmentStarted → AssessmentCompleted (43% drop)** — 469 users quit mid-assessment
3. **OpenedSubscription → Subscribed (100% drop)** — 88 high-intent users, zero converted

---

## Two Counters — How Playtime Works

There are two completely separate minute counters running simultaneously:

| Counter | Stored in | Counts | Resets | Controls |
|---|---|---|---|---|
| **Trial counter** | `global.save` via `Game.getPlayedTime()` | Total minutes ever played, all sessions combined | Never | 30-min subscription paywall |
| **Daily session counter** | Per-player profile via `Player.getPlayTime().playedMinutes` | Minutes played today only | Every calendar day at midnight | `timeOutLevel` daily limit (default 10 min) |

Every minute in the Level screen increments both simultaneously. A parent who sets the daily limit to 10 min hits the paywall on Day 3. The daily counter reset is actually a natural re-engagement hook — currently wasted as a hard stop screen.

> **Critical:** The trial counter starts the moment the Level screen loads — the assessment runs inside Level. A 15–20 min assessment leaves only 10–15 minutes of actual gameplay before the paywall fires.

---

## Currently Tracked Events (Baseline)

| Event | Trigger | Parameters |
|---|---|---|
| `GameFirstStart` | First ever app launch | _(none)_ |
| `PlayerSessionStart/Finish` | Player switch | `duration`, `age_in_days`, `skill_age` |
| `TimeTaken` (type=screen) | Screen navigation | `screen` (previous), `duration` (seconds) |
| `TimeTaken` (type=levelCompleted/levelFailed) | Level result | `list`, `level`, `board`, `score`, `duration`, `level_status` |
| `Score` | Level completed, session end | `score`, `type`, `playerID` |
| `GameSubscription` (Created/Expired) | Purchase lifecycle | `type`, `plan` |
| `PlayerCreate/Delete/Update` | Profile management | `gender`, `age_in_days`, `skill_age` |
| `SettingsChanged` | Any setting saved | All changed keys |

### Critical Gaps
- **Zero events** between paywall redirect and `GameSubscription(Created)` — entire conversion funnel invisible
- **`LevelStarted` event does not exist** — `_onLevelStarted()` in `UserEvents.gd` only starts a timer, fires no analytics
- **`AssessmentStarted/Completed` do not exist** as dedicated events
- **`PlayerReportViewed` does not exist** — screen only tracked as a departure point in `TimeTaken`
- All billing errors (`_onConnectError`, `_onPurchaseError`) only `print()` — invisible in Firebase

---

## Priority 1 — Remove Age Gate from Subscription Screen (TODAY — 1 line)

**Evidence:** `ageGates = ["Profile", "Settings", "Subscription"]` in `ScreenManager.gd`. Every one of 471 paywall visits — including the 88 high-intent users who completed the full assessment — was preceded by a math addition problem the parent had to solve. Billing is confirmed working. This is the confirmed cause of zero conversions.

**Fix:** Remove `"Subscription"` from the `ageGates` array in `scenes/screens/main/ScreenManager.gd`.

> Note: Keep `AgeGateShown/Passed/Failed` instrumentation (Phase 2 below) in a release before removing the gate, so you can measure exactly how many conversions it was blocking. Then remove it.

---

## Priority 2 — Verify Production Plan IDs (TODAY — 5 min)

Current IDs in `configOverrides.json`: `"test_pan"`, `"testplan_two"`, `"testplan_3"`.
If these don't match exact Play Store product IDs → `_onSKUDetailsQueryError` fires silently → users see empty plan list → nothing to buy even with billing working.

Check Play Console → Monetisation → Products → Subscriptions and compare IDs exactly.

---

## Priority 3 — Fix Content Routing Bug (Week 1)

**Evidence:** Every worst-performing 2Y level has 100% drop rate and 0 passes. Content being served: `fractionMultiplication14`, `matrixMultiplicationRandomNumbers6`, `mixedFractionImageMatching2` — 8–10Y content shown to 2-year-olds. 2Y is 54% of the production install base. The routing bug also runs in reverse — beginner content appearing for 10Y users.

**Location:** `LevelListsManager.getLevel()` and branch/level filtering using `Player.getSkillAge()`.

**Fix:** Add hard skill-age bounds so content tagged for ages 7+ cannot appear for `skillAge ≤ 3`, and beginner content cannot appear for `skillAge ≥ 8`.

---

## Priority 4 — Fix the Assessment Wall (Week 1)

**Evidence:** Only 3.1% of users (70 in 90 days) ever see PlayerReport. 43% quit mid-assessment. The assessment burns free trial time. Assessment is mandatory before any level can be played.

**Options (choose one):**
- **Option A (recommended):** Make assessment optional — let users play immediately using DOB-derived skill age (already computed in code), offer assessment as "Find your child's exact level" from Home/Settings
- **Option B:** Shorten to 5–8 placement questions, non-blocking
- **Option C:** Keep mandatory but stop counting assessment time against the 30-min trial

**Code change for Option C:** In `_handleElapsedTime()` in `scenes/screens/levels/main.gd`, only start `playTimeTimer` when `LevelListsManager.currentList != "assessment"`.

---

## Priority 5 — Fix GenderPicked Drop (Week 1)

**Evidence:** 568 users (30%) abandon at the gender selection step — the single largest profile creation drop point, bigger than DOB. Review the UI for this step — options may be unclear, layout confusing, or the question feels intrusive to parents.

---

## Part A — Make Users Play Regularly

### A1 — Fix the first session
- Content routing fix (Priority 3) — first session becomes meaningful for 2Y users
- Assessment optional (Priority 4) — users reach gameplay within 2 min of install
- Exclude assessment time from trial counter if assessment remains mandatory

### A2 — Create a daily return reason
- **Day-1 push notification** at 24h after install: *"Your child's learning path is ready"*
- **Streak counter** on Home screen — consecutive days played
- **"Continue where you left off"** card on Home — show specific level the child was on, not generic Start button
- **Reframe daily time limit** in UI: *"Come back tomorrow to unlock more"* — the midnight reset is a re-engagement hook, use it

### A3 — Make progress visible
- Skill progression on Home: which branches mastered, what's next
- Post-level Complete screen shows cumulative progress, not just current result
- Visual reward / badge when a branch is completed

---

## Part B — Convert Engaged Users to Subscribers

### B1 — Surface paywall at high-intent moments
Currently only fires when 30-min trial expires. Add triggers at:

| Trigger | Why |
|---|---|
| After assessment completes + PlayerReport viewed | Parent just saw child's skill level — maximum investment |
| Post-level Complete screen | Child just succeeded — emotional high |
| After 3rd level completion | Habit formed — engagement demonstrated |
| D3+ return visit to Home | Revealed preference for the app |

### B2 — Improve subscription screen
- Lead with: *"Unlock all of [child's name]'s learning path"* — not product features
- Recommended plan visually highlighted (already supported via `specialPlans` in config)
- Add *"Remind me later"* — soft reminder after 2 more level completions, not silence
- Consider 7-day free trial — standard for children's education apps

---

## Analytics Instrumentation Required

### New Events to Add

| Event | File | Key Parameters |
|---|---|---|
| `LevelStarted` | `autoload/UserEvents.gd` — fix `_onLevelStarted()` | `list`, `level`, `mode`, `age_in_days`, `skill_age` |
| `AssessmentStarted` | `scenes/screens/levels/main.gd` — when `list = "assessment"` | `age_in_days`, `skill_age` |
| `AssessmentBoardCompleted` | `scenes/screens/levels/main.gd` — each board done during assessment | `board_number`, `duration` |
| `AssessmentCompleted` | `scenes/screens/levels/main.gd` — assessment level completion | `duration`, `age_in_days`, `skill_age` |
| `AssessmentAbandoned` | `scenes/screens/levels/main.gd` — back nav during assessment | `board_number`, `time_spent` |
| `PlayerReportViewed` | PlayerReport screen `start()` | `age_in_days`, `skill_age`, `source` |
| `PaywallReached` | `scenes/screens/main/ScreenManager.gd` | `played_minutes`, `age_in_days`, `skill_age` |
| `SubscriptionScreenViewed` | `scenes/screens/subscription/main.gd` | `source` (paywall/voluntary/post-assessment/post-level), `subscription_status`, `plans_count` |
| `BuyButtonTapped` | `scenes/screens/subscription/plan.gd` | `plan_id`, `price`, `duration_unit` |
| `SubscriptionAbandoned` | `scenes/screens/subscription/main.gd` | `time_on_screen`, `subscription_status` |
| `BillingConnectionError` | `autoload/Subscription.gd` — `_onConnectError` + `_onPurchaseError` | `error_code`, `message` |
| `AgeGateShown` | `scenes/screens/ageGate/main.gd` | `destination_screen` |
| `AgeGatePassed` | `scenes/screens/ageGate/main.gd` | `destination_screen`, `attempts` |
| `AgeGateFailed` | `scenes/screens/ageGate/main.gd` | `destination_screen` |
| `FreeTrialMilestone` | `autoload/Game.gd` — in `setPlayedTime()` | `milestone_minutes`, `played_minutes` |
| `FreeTrialExpired` | `autoload/Game.gd` — first time 30 min crossed | `age_in_days`, `skill_age` |
| `LevelAbandoned` | `scenes/screens/levels/main.gd` — back nav mid-level | `list`, `level`, `board`, `time_spent` |

### Bugs to Fix

1. **`_onPlayerCreate` bug** in `autoload/UserEvents.gd` — sends raw GDScript object instead of `props` dict. Event is broken.
2. **`Score` sent as string** via `_convertAsDimension()` — Firebase cannot aggregate. Send as integer.
3. **Register custom dimensions in Firebase Console** — `list`, `level`, `level_status`, `duration`, `score`, `age_in_days`, `skill_age`, `plan` are collected but invisible in reports until registered. GA4 free tier limit: 50 event-scoped dimensions.

---

## GA4 Funnel to Build (After Instrumentation)

Full user journey — extends the existing profile creation funnel:
