# Subscription Analytics Guide for GD-Math

## Table of Contents
1. [Top Metrics to Measure](#top-metrics-to-measure)
2. [Time Allocation](#time-allocation)
3. [Actions to Increase Subscriptions](#actions-to-increase-subscriptions)
4. [Tools & Tips](#tools--tips)

## Top Metrics to Measure
Focus on subscription health, user behavior, and revenue. These are GA4-friendly and can be automated with minimal setup.
Focus on subscription health, user behavior, and revenue. These are GA4-friendly and can be automated with minimal setup.

- **Churn Rate** (Priority #1: 20-30% of your time)
  - **Definition**: Percentage of subscribers who cancel/unsubscribe in a given period (e.g., monthly churn = cancellations / total subscribers at start of month).
  - **Why measure?**: Directly impacts revenue; high churn kills subscriptions. Target: <5-7% monthly for subscription apps.
  - **How to measure in GA4**: Track "unsubscribe" events or revenue drops. Use cohort analysis to see retention curves.
  - **Time estimate**: 8-10 hours (setup events, build dashboards).

- **Monthly Recurring Revenue (MRR) & Net Revenue Retention** (Priority #2: 15-20% of time)
  - **Definition**: MRR = Total monthly subscription revenue. Net retention = (MRR from existing customers + expansions - contractions) / starting MRR.
  - **Why measure?**: Shows if subscriptions are growing or shrinking. Net retention >100% means expansions > churn.
  - **How to measure**: GA4 e-commerce tracking for purchases/upgrades. Calculate in spreadsheets or simple scripts.
  - **Time estimate**: 6-8 hours (integrate with GA4, automate calculations).

- **Conversion Rate: Free Trial to Paid** (Priority #3: 10-15% of time)
  - **Definition**: Percentage of trial users who convert to paid subscriptions.
  - **Why measure?**: Identifies acquisition bottlenecks. Target: 10-20% for educational apps like yours.
  - **How to measure in GA4**: Funnel analysis from "trial_start" to "purchase" events.
  - **Time estimate**: 4-6 hours (set up funnels, analyze drop-offs).

- **Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)** (Priority #4: 10% of time)
  - **Definition**: LTV = Average revenue per user over their lifetime. CAC = Total marketing spend / new subscribers acquired.
  - **Why measure?**: LTV > 3x CAC ensures profitability. Low ratio means unsustainable growth.
  - **How to measure**: LTV from cohort revenue data; CAC from marketing attribution in GA4.
  - **Time estimate**: 4 hours (simple cohort analysis).

- **User Engagement (DAU/MAU Ratio & Session Duration)** (Priority #5: 10% of time)
  - **Definition**: DAU/MAU = Daily active users / Monthly active users (as a ratio). Session duration = Average time per session.
  - **Why measure?**: Engaged users are more likely to subscribe/renew. Low ratios indicate disengagement.
  - **How to measure in GA4**: Built-in metrics; filter for subscribed users.
  - **Time estimate**: 2-4 hours (dashboards and weekly reports).

- **Bonus: Feature Usage & Upgrade Rates** (If time allows)
  - Track which features (e.g., math modules) drive subscriptions. Upgrade rates from basic to premium plans.

## Time Allocation
- **Week 1 (10 hours)**: Set up GA4 events for subscriptions (unsubscribe, purchase, trial_start). Build basic dashboards.
- **Week 2 (10 hours)**: Calculate churn, MRR, and conversion funnels. Run initial cohort analysis.
- **Ongoing (20 hours)**: Weekly reviews (2-3 hours/week) + monthly deep dives (4-6 hours/month). Automate reports to save time.
- **Tip**: Use GA4's free Looker Studio integration for dashboards (no coding needed). Avoid custom scripts unless necessary.

## Actions to Increase Subscriptions
Tie actions directly to the metrics above. Focus on quick wins with low effort.
- **Reduce Churn (Based on Churn Rate)**:
  - Identify churn triggers (e.g., via exit surveys in GA4). Send personalized re-engagement emails (e.g., "We miss you—try this new feature").
  - Offer win-back discounts or free months for high-value users.
  - Action: Implement automated email sequences (use tools like Mailchimp; 2-4 hours setup).

- **Boost Conversions (Based on Trial-to-Paid Rate)**:
  - Optimize onboarding: Use GA4 funnels to see where trials drop off. Add in-app tutorials or progress bars.
  - A/B test pricing or features (e.g., free premium trial week).
  - Action: Run 1-2 A/B tests per month (4-6 hours total).

- **Improve Retention & LTV (Based on Engagement & Retention Metrics)**:
  - Personalize content based on usage (e.g., recommend math topics users struggle with).
  - Launch loyalty programs: Reward long-term subscribers with exclusive content.
  - Action: Analyze feature usage data to prioritize development (2-4 hours/month).

- **Grow Revenue (Based on MRR & CAC)**:
  - Target high-LTV users with upsell campaigns (e.g., premium add-ons).
  - Optimize marketing: Focus on channels with lowest CAC (e.g., app store reviews, social proof).
  - Action: Run targeted ads or referral programs (integrate with GA4 attribution; 4-6 hours).

- **General Quick Wins**:
  - Fix bugs/features causing disengagement (monitor crash reports in GA4).
  - Collect feedback: Add simple in-app surveys to understand pain points.
  - Cross-promote: Partner with educational platforms for referrals.

## Tools & Tips
- **Tools**: Stick to GA4 (free, powerful for subscriptions). Supplement with Google Sheets for calculations or free tiers of Mixpanel/Amplitude if needed.
- **Automation**: Set up weekly email reports from GA4 to avoid manual checks.
- **Efficiency Tips**: Start with 1-2 metrics per month. Involve your team—assign 1 person for analytics. Measure impact: Track if actions increase MRR by 5-10% quarterly.
- **Red Flags to Watch**: Churn >10%, LTV/CAC <2, or DAU/MAU <0.3—prioritize fixes here.

This plan focuses on high-impact, low-effort changes. Start with churn and conversions—they often yield 20-50% subscription growth with minimal time.
