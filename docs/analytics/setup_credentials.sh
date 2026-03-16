#!/bin/bash
# Analytics Environment Setup
# This script sets up the Google Analytics credentials for the project
#
# For complete setup instructions, see: GA4_SETUP_GUIDE.md

DIR="analytics"
export GOOGLE_APPLICATION_CREDENTIALS="$DIR/keys/gd-math-71c48-7553a3a1322b.json"

chmod 600 "$DIR/keys"/*.json 2>/dev/null || true

echo "✅ Google Analytics credentials configured"
echo "Key file: $GOOGLE_APPLICATION_CREDENTIALS"
echo "📖 See GA4_SETUP_GUIDE.md for complete setup instructions"
