# Retention by Skill Age — Production Cohorts
**Period**: Jan 25 – Mar 25, 2026
**Source**: GA4 cohort export (Production track only — builds 65, 68, 72; skill ages 2–10)
**Updated**: Apr 6, 2026 — corrected CSVs

---

## D0 / D1 / D7 / D30 Retention

| Skill Age | D0 Cohort | D0 Retention | D1 Cohort | D1 Retention | D7 Cohort | D7 Retention | D30 Cohort | D30 Retention |
|:---------:|:---------:|:------------:|:---------:|:------------:|:---------:|:------------:|:----------:|:-------------:|
| SA2       | 336       | 96.1%        | 257       | 19.8%        | 50        | 16.0%        | 50         | 10.0%         |
| SA3       | 81        | 98.8%        | 27        | 51.9%        | 10        | 50.0%        | 3 ⚠        | 33.3% ⚠       |
| SA4       | 66        | 97.0%        | 38        | 36.8%        | 2 ⚠       | 50.0% ⚠      | 7 ⚠        | 28.6% ⚠       |
| SA5       | 41        | 92.7%        | 10        | 60.0%        | 3 ⚠       | 66.7% ⚠      | —          | —             |
| SA6       | 27        | 96.3%        | 11        | 45.5%        | 7 ⚠       | 57.1% ⚠      | —          | —             |
| SA7       | 18        | 100%         | 3 ⚠       | 66.7% ⚠      | —         | —            | —          | —             |
| SA8       | 12        | 100%         | 3 ⚠       | 66.7% ⚠      | 1 ⚠       | 100% ⚠       | —          | —             |
| SA9       | 4 ⚠       | 100% ⚠       | 2 ⚠       | 100% ⚠       | —         | —            | —          | —             |
| SA10      | 90        | 95.6%        | 20        | 35.0%        | 1 ⚠       | 100% ⚠       | —          | —             |

> ⚠ Cohort size < 10 — rate is unreliable.
> — Data unavailable: cohort too small or users acquired too recently for this measurement window.

---

## Notes

- **"Cohort" column** = users acquired early enough in the window to have the Dx measurement available. Shrinks at D7/D30 because later-window acquirees don't yet have the full follow-up period.
- **D0 is 93–100% across all skill ages** — nearly all installs open the app on day zero, confirming strong initial intent.
- **SA2 dominates** the sample (257 D1-eligible users) and is the only group with a reliable D7 and D30 figure.
- **D30 reliable data**: SA2 only (n=50, 10.0%). SA3/SA4 D30 present but cohort < 10.
- **D7 reliable data**: SA2 (n=50, 16.0%) and SA3 (n=10, 50.0% — borderline). All others are too small.
- **SA3–6 show strong D1 retention** (37–60%) but very small cohorts make D7/D30 directional only.
- **Internal testing users excluded** — builds 71 (v4.3.18) and 73 (v4.3.20) are filtered out.
