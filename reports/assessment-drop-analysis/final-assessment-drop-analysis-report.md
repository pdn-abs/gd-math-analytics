# **Comprehensive Report: Analysis of User Drop-Off in Assessment Levels**

**Date:** April 23, 2026
**Subject:** An in-depth analysis of user drop-off during assessment levels, identifying root causes and providing actionable recommendations.

### **Table of Contents**
1.  [Executive Summary](#1-executive-summary)
2.  [The Overall Picture: A Leaky Funnel](#2-the-overall-picture-a-leaky-funnel)
3.  [Root Cause Analysis: Why Are Users Dropping Off?](#3-root-cause-analysis-why-are-users-dropping-off)
4.  [Detailed Analysis by SkillAge](#4-detailed-analysis-by-skillage)
5.  [Key Data Tables](#5-key-data-tables)
6.  [Priority Action Matrix](#6-priority-action-matrix)

---

### **1. Executive Summary**

This report provides a detailed analysis of a significant user drop-off occurring during the initial assessment phase of the application. Our investigation reveals that the primary driver of user drop-off is a systemic **age-profiling issue**, creating severe difficulty mismatches at **both ends of the SkillAge spectrum.**

Our findings point to three root causes:

1.  **The "Default Age" Problem (SkillAge 2):** Users who don't enter a date of birth are defaulted to **SkillAge 2**. This funnels a large volume of older children into toddler-level content, causing them to quit early out of boredom.
    -   **Evidence:** SkillAge 2 has **981 starters**, nearly double any other group. Dropped users average only **3.5 wrong moves**, indicating disengagement, not difficulty.

2.  **The "Parent's Age" Problem (SkillAge 10):** Parents of very young children (e.g., age 2) who enter their own age cause their child to be assessed at **SkillAge 10**. This forces toddlers into impossible tasks.
    -   **Evidence:** The level `matrixMultiplicationRandomNumbers3AL` shows a staggering **25.5 wrong moves per user**. Most drops occur during the timed speedrun, suggesting a parent can get their child through the untimed training but gives up when the task becomes impossible under pressure.

3.  **Genuine Content Hurdles (SkillAge 5 & 8):** For correctly-profiled users, there are still clear points of failure.
    -   **Evidence:** SkillAge 5 shows a **42% drop rate** from a **comprehension barrier** (users struggle for **110+ seconds** before quitting). SkillAge 8 is a **"difficulty wall,"** with the lowest success rate (**61%**) and highest error rate (**9.1 wrong moves/user**) for any correctly-profiled group.

This report will break down the data supporting these findings and conclude with a priority matrix to guide immediate action.

---

### **2. The Overall Picture: A Leaky Funnel**

The data clearly shows a significant funnel issue. Across all assessment levels, we see **7,154 segment starts** but only **4,674 completions**, with **1,311 drop-off events**. This indicates that a substantial number of users are lost during this critical onboarding phase.

The core of the problem is that our system is not matching users with content appropriate for their actual cognitive level, leading to frustration, boredom, and ultimately, churn.

---

### **3. Root Cause Analysis: Why Are Users Dropping Off?**

The primary issue is a systemic failure in user age profiling, which manifests in two opposite ways.

#### **Cause 1: Systemic Age-Profiling Failure**

**Sub-Cause 1a: The "Default Age" Problem (SkillAge 2)**

When a user does not enter a date of birth, they are defaulted to SkillAge 2. This creates a poor experience for what is likely a large segment of our user base.

**Evidence:**
-   **Disproportionate User Volume:** SkillAge 2 has **981 starters**. This is not an organic distribution; it is nearly double the **527 starters** in SkillAge 3, pointing to a systemic issue funneling users into this bucket.
-   **High Drop Rate with Low Struggle:** The flagship SkillAge 2 level, `simpleIdentificationVegetablesSet2AL`, has a **43% drop rate**. However, the **3.5 wrong moves per user** is extremely low. This combination is the classic signature of user disengagement, not difficulty.

**Impact:** The high drop rates in SkillAge 2 are not a reflection of the quality of those levels for their intended audience, but a direct result of a flawed onboarding process that sends the wrong users to them.

**Sub-Cause 1b: The "Parent's Age" Problem (SkillAge 10)**

This is the inverse of the default age problem. When a parent enters their own age for their young child, the child is placed in levels designed for a 10-year-old.

**Evidence:**
-   **Astronomical Wrong Moves:** The level `matrixMultiplicationRandomNumbers3AL` averages **25.5 wrong moves per user**. This is not plausible for a 10-year-old and strongly suggests a much younger child making random inputs.
-   **Drops during Speedrun:** SkillAge 10 is the only group where most drops (**65%**) occur during the timed Speedrun. This points to a parent patiently guiding their child through the untimed training but giving up when the time pressure makes the impossible task truly unwinnable.

**Impact:** This issue completely corrupts our understanding of high-level difficulty. We cannot properly assess these levels because the data is being generated by users who are cognitively incapable of performing the tasks.

#### **Cause 2: Genuine Content Hurdles**

For users who *are* correctly profiled, there are still two clear areas of difficulty.

**Sub-Cause 2a: Content Difficulty Wall (SkillAge 8)**

**Evidence:**
-   SkillAge 8 has the **worst metrics across the board** for any plausibly-correctly profiled group: the highest drop rate (**46%**), the highest wrong moves per user (**9.1**), and the lowest success rate (**61%**). The level `numbersFrom500To999AL` is the primary offender, with only **5 of 30 starters completing it (a 17% completion rate)**.

**Impact:** This level is a frustrating gatekeeper, preventing correctly-profiled users from progressing.

**Sub-Cause 2b: Comprehension Gaps (SkillAge 5)**

**Evidence:**
-   The drop rate jumps to **42%**. However, the success rate for users who get past the initial hurdle is a high **83%**. This disparity proves that the level is learnable but poorly introduced.
-   Users who drop from `mergeNumberUpTo9WithBAsTwoAL` struggle for an average of **110 seconds**, clear data-driven evidence of user frustration.

**Impact:** We are losing users who are capable of completing the content simply because we are not teaching it effectively.

---

### **4. Detailed Analysis by SkillAge**

This table breaks down the `When`, `Where`, and `Why` for user drop-offs, aggregated for each SkillAge, providing a clear view of how challenges evolve.

| SkillAge | When Users Drop (Phase) | Where Users Drop (Avg. Board) | Why Users Drop (Root Cause & Evidence) |
| :--- | :--- | :--- | :--- |
| **2** | **Training (100%)** | Board 3.7 | **User-Level Mismatch:** The content is not the problem. A very low **2.6 wrong moves/user** and high **89% success rate** for completers proves the levels are easy. The **31% drop rate** is driven by a large volume of mismatched older users, defaulted to this age, who quit out of boredom. |
| **3 & 4**| **Training (90-100%)**| Board 3.9 - 4.1 | **Mixed - Primarily User Mismatch:** The pattern is similar to SkillAge 2, with moderate drop rates and manageable wrong moves (**~5.0/user**). This suggests the "default age" problem is still the main factor. |
| **5** | **Training (69%)** | Board 4.4 | **Comprehension Barrier:** The drop rate spikes to **42%**, but the success rate for those who finish remains a high **83%**. This disparity indicates that users who understand the instructions succeed, but many fail at that initial step and quit out of frustration. |
| **6 & 7**| **Training (100%)**| Board 2.8 - 3.1 | **Content Difficulty (Users Persist):** Wrong moves per user are notably high (e.g., **7.5** for SA 6), but drop rates are moderate. Users are engaged and trying, but they are genuinely struggling with the more complex content. |
| **8** | **Training (100%)** | Board 3.0 | **Content is Too Hard (The "Wall"):** This SkillAge has the **worst metrics on all fronts**: the highest drop rate (**46%**), the lowest success rate (**61%**), and the most wrong moves (**9.1/user**). This is a clear content difficulty problem. |
| **9** | **Training (100%)** | Board 2.2 | **Moderate Difficulty:** Performance recovers after the "wall" at SkillAge 8. The drop rate (**27%**) is back to a moderate level, suggesting the content is challenging but manageable. |
| **10**| **Speedrun (65%)** | Board 4.6 | **Extreme Audience Mismatch:** The data signature (extremely high **9.0 wrong moves/user** and drops occurring mostly in the **Speedrun - 65%**) strongly suggests a parent is helping a much younger child. They can slowly get through the untimed Training, but give up when the timed Speedrun makes the task impossible. |

---

### **5. Key Data Tables**

#### **Table 1: Performance by SkillAge**
*This table highlights the profiling issues at SkillAge 2 and 10, and the content hurdles at SkillAge 5 and 8.*

| SkillAge | Total Started | Drop% | WM / User | Success% | Primary Drop Phase |
|:---:|---:|---:|---:|---:|:---:|
| 2 | 981 | 31% | 2.6 | 89% | Training (100%) |
| 3 | 527 | 27% | 5.1 | 79% | Training (90%) |
| 4 | 240 | 37% | 5.0 | 78% | Training (100%) |
| **5** | **208** | **42%** | **6.6** | **83%** | **Training (69%)** |
| 6 | 178 | 27% | 7.5 | 75% | Training (100%) |
| 7 | 78 | 38% | 4.9 | 78% | Training (100%) |
| **8** | **41** | **46%** | **9.1** | **61%** | **Training (100%)** |
| 9 | 56 | 27% | 6.3 | 78% | Training (100%) |
| **10**| **202**| **37%**| **9.0**| **75%**| **Speedrun (65%)** |

#### **Table 2: Top 5 Most Problematic Levels**
*This table combines the different root causes to identify the levels most urgently in need of a review.*

| Level ID | SkillAge | Primary Reason for Drop-Off | Drop Rate | Wrong Moves / User |
|:---|:---:|:---|---:|---:|
| `simpleIdentificationVegetablesSet2AL` | 2 | User-Level Mismatch | 43% | 3.5 |
| `matrixMultiplicationRandomNumbers3AL` | 10 | User-Level Mismatch | 38% | 25.5 |
| `numbersFrom500To999AL` | 8 | Content Too Hard | 47% | 10.6 |
| `mergeNumberUpTo9WithBAsTwoAL` | 5 | Comprehension Barrier | 51% | 10.0 |
| `stackVegetablesAndFruitsOverall2AL` | 3 | Content Too Hard | 53% | 9.8 |

---

### **6. Priority Action Matrix**

| Priority | Action Item | Root Cause Addressed | Key Levels Affected |
|:---:|:---|:---|:---|
| 🔴 **Critical** | **Fix the DOB Entry Flow:** Redesign the player profile creation process to ensure accurate age entry. This is the highest-impact fix available. | **User-Level Mismatch (Both ends)** | All SkillAge 2 and SkillAge 10 levels |
| 🟠 **High** | **Redesign "The Wall" (SkillAge 8):** Fundamentally redesign the content and difficulty curve of SkillAge 8 levels. | Content Too Hard | `numbersFrom500To999AL` |
| 🟠 **High** | **Improve Concept Introduction (SkillAge 5):** Add guided examples or tutorial boards for the most confusing level mechanics. | Comprehension Barrier | `mergeNumberUpTo9WithBAsTwoAL` |
| 🟡 **Medium**| **Re-evaluate High-SkillAge Content:** After the DOB flow is fixed, re-evaluate the performance of SkillAge 10 levels with clean data. | Content Too Hard | `matrixMultiplicationRandomNumbers3AL` |
| 🟡 **Medium**| **Audit for "Early Quits":** Review other levels with high drop rates but low wrong-move counts, as they may also be affected by the user-level mismatch problem. | User-Level Mismatch | `smallBigFrom1To99NumbersAL`, `matchNumberCount1to72AL` |

By addressing the systemic issue of user profiling first and then redesigning the key content "walls," we can significantly improve our assessment completion rates and provide a more engaging and effective experience for all users.
