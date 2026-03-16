# gd-math-analytics

## Quick Start

From repository root:

```bash
cd .analytics/gd-math-analytics
npm install
source setup_credentials.sh
```

Run one-off analysis and chart generation:

```bash
npm run run-analysis
```

Start the daily scheduler (09:00 by default):

```bash
npm run start-cron
```

Custom schedule example:

```bash
CRON_SCHEDULE="0 6 * * *" RUN_ON_START=true npm run start-cron
```
