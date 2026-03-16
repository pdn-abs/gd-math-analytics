# Google Analytics 4 Setup Guide for GD Math Project
# ==================================================
# Complete setup instructions for GA4 data fetching and analysis
# Last updated: March 10, 2026

## 📋 Prerequisites
- Google Analytics 4 property set up for GD Math app
- Google Cloud Platform project access
- Node.js installed (v14+)
- GD Math GA4 Property ID: 441470574

## 🔐 Step 1: Google Cloud Console Setup

### 1.1 Enable Google Analytics Data API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (gd-math-71c48)
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google Analytics Data API"
5. Click "Enable"

### 1.2 Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Service Account Details:
   - Name: `gd-math-analytics`
   - Description: `Service account for GD Math GA4 data fetching`
   - ID: `gd-math-analytics` (auto-generated)
4. Click "Create and Continue"
5. Skip role assignment for now
6. Click "Done"

### 1.3 Download Service Account Key
1. In the Service Accounts list, find `gd-math-analytics@gd-math-71c48.iam.gserviceaccount.com`
2. Click the account name
3. Go to "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create" - this downloads the key file
7. **IMPORTANT**: Store this file securely - it contains private keys

## 🔑 Step 2: Google Analytics 4 Property Access

### 2.1 Add Service Account to GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GD Math property (ID: 441470574)
3. Click the gear icon (Admin) in bottom left
4. In the Property column, click "Property Access Management"
5. Click the "+" button to add users
6. Enter the service account email: `firebase-adminsdk-9gddl@gd-math-71c48.iam.gserviceaccount.com`
7. Set role to "Viewer" or "Editor"
8. Click "Add"

## 🗂️ Step 3: Project Organization

### 3.1 Move Credentials to Project
```bash
# Create keys directory
mkdir -p .analytics/keys

# Move the downloaded key file
mv ~/Downloads/gd-math-71c48-XXXXX.json .analytics/keys/

# Rename for consistency (optional)
mv .analytics/keys/gd-math-71c48-XXXXX.json .analytics/keys/gd-math-71c48-service-account.json
```

### 3.2 Security Setup
```bash
# Create .gitignore for analytics folder
echo "keys/" > .analytics/.gitignore

# Verify .gitignore is working
git status  # Should not show keys/ folder
```

## ⚙️ Step 4: Environment Configuration

### 4.1 Create Credentials Setup Script
The `setup_credentials.sh` script is already created in `.analytics/setup_credentials.sh`

### 4.2 Set Environment Variables
```bash
# Method 1: Source the setup script
cd .analytics
source setup_credentials.sh

# Method 2: Manual export
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/keys/gd-math-71c48-service-account.json"
```

## 📊 Step 5: Data Fetching

### 5.1 Run Data Collection
```bash
# Navigate to analytics directory
cd .analytics

# Set up credentials
source setup_credentials.sh

# Run data fetch
cd scripts
node fetch.js
```

### 5.2 Verify Data Collection
```bash
# Check that data files were created/updated
ls -la ../data/
# Should show recent timestamps for:
# - ga_data.json
# - level_engagement.json
# - retention.json
# - pre_drops_level_engagement.json
# - monthly_daily_retention.json
```

## 📈 Step 6: Analysis & Reporting

### 6.1 View Insights
```bash
# Read the analysis report
cat docs/analytics_insights_on_impact_of_drops.md
```

### 6.2 Key Metrics Tracked
- **Retention Rates**: Day 1, Day 2, Day 3+ for post-Drops users
- **Level Engagement**: Started, Completed, Dropped, Failed rates
- **Monthly Trends**: Comparative analysis across time periods
- **Drops Impact**: Pre vs post-feature launch comparison

## 🔄 Step 7: Automation (Optional)

### 7.1 Cron Job Setup
```bash
# Add to crontab for daily data updates
crontab -e

# Add this line for daily 6 AM updates:
# 0 6 * * * cd /home/pdn/dev/abs/gd-math-godot/.analytics && source setup_credentials.sh && cd scripts && node fetch.js
```

### 7.2 Node-cron Integration
See `docs/node_cron_setup.md` for automated scheduling within Node.js

## 🚨 Security Best Practices

### 8.1 Key Management
- ✅ Never commit service account keys to git
- ✅ Use `.gitignore` to exclude credentials
- ✅ Store keys in dedicated `keys/` folder
- ✅ Limit service account permissions to minimum required

### 8.2 Access Control
- ✅ Regularly rotate service account keys
- ✅ Monitor service account usage in GCP
- ✅ Use separate service accounts for different environments

### 8.3 Data Protection
- ✅ Analytics data contains user behavior information
- ✅ Store data files securely
- ✅ Consider encryption for sensitive data

## 🐛 Troubleshooting

### Common Issues
1. **"Could not load the default credentials"**
   - Solution: Run `source .analytics/setup_credentials.sh`

2. **"Permission denied" in GA4**
   - Solution: Verify service account email is added to GA4 property

3. **Empty data responses**
   - Solution: Check date ranges and stream filters in fetch.js

4. **API quota exceeded**
   - Solution: Implement rate limiting or reduce request frequency

## 📞 Support
- GA4 Property ID: 441470574
- Service Account: firebase-adminsdk-9gddl@gd-math-71c48.iam.gserviceaccount.com
- Project: gd-math-71c48

## 📝 Change Log
- 2026-03-10: Initial setup guide created
- 2026-03-10: Credentials organized in .analytics/keys/
- 2026-03-10: Added security measures and .gitignore</content>
<parameter name="filePath">/home/pdn/dev/abs/gd-math-godot/.analytics/GA4_SETUP_GUIDE.md
