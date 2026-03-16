# Complete Setup for Google Analytics Automation Using node-cron

This guide is tailored to this repository layout:
`./.analytics/gd-math-analytics/`

## 1. Prerequisites
- Node.js 14+
- A GA4 property with the required events already tracked
- Google Analytics Data API enabled in GCP
- Service-account JSON key with access to the GA4 property

## 2. Project Setup
From repository root:

```bash
cd .analytics/gd-math-analytics
npm install
```

This installs:
- `@google-analytics/data`
- `node-cron`
- `d3-node`

## 3. Credentials Setup
Place your service-account key in:
`./.analytics/gd-math-analytics/keys/`

Then load credentials in your shell:

```bash
cd .analytics/gd-math-analytics
source setup_credentials.sh
```

Optional explicit key path:

```bash
source setup_credentials.sh keys/your-service-account.json
```

Verify:

```bash
echo "$GOOGLE_APPLICATION_CREDENTIALS"
```

## 4. Manual Pipeline Test
Run the full one-off flow first:

```bash
cd .analytics/gd-math-analytics
source setup_credentials.sh
npm run run-analysis
```

Generated artifacts:
- `data/ga_data.json`
- `data/level_summary.json`
- `data/level_completions.svg`

## 5. Start Scheduled Automation
Default schedule is daily at 09:00 (cron: `0 9 * * *`).

```bash
cd .analytics/gd-math-analytics
source setup_credentials.sh
npm run start-cron
```

### Optional Environment Overrides
- `CRON_SCHEDULE`: custom cron expression
- `RUN_ON_START=true`: execute once immediately on process start
- `ENABLE_FULL_FETCH=true`: also run extended fetches (retention/engagement files)

Example:

```bash
cd .analytics/gd-math-analytics
source setup_credentials.sh
CRON_SCHEDULE="0 6 * * *" RUN_ON_START=true npm run start-cron
```

## 6. Process Management
`node-cron` runs only while the Node process is alive. For persistent execution, run under a process manager.

Example with PM2:

```bash
cd .analytics/gd-math-analytics
source setup_credentials.sh
pm2 start npm --name gd-math-analytics -- run start-cron
pm2 save
```

## 7. Troubleshooting
- `Could not load the default credentials`:
  - Run `source setup_credentials.sh` in the same shell before `npm run ...`
- `Permission denied` from GA API:
  - Ensure the service-account email has GA4 property access
- Empty rows returned:
  - Confirm date ranges, stream filters, and event names in `scripts/fetch.js`
- Nothing runs on schedule:
  - Keep process alive and confirm cron expression in `CRON_SCHEDULE`

## 8. Current Script Wiring
- Scheduler: `scripts/automate.js`
- One-off run: `scripts/run_analysis.js`
- Fetch: `scripts/fetch.js`
- Analyze: `scripts/analyze.js`
- Visualize: `scripts/visualize.js`
