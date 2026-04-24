#!/bin/bash
# Analytics Environment Setup
# This script sets up the Google Analytics credentials for the project
#
# For complete setup instructions, see: docs/ga4-setup-guide.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -n "$1" ]; then
	KEY_FILE="$1"
else
	KEY_FILE="$(ls -1 "$SCRIPT_DIR"/keys/*.json 2>/dev/null | head -n 1)"
fi

if [ ! -f "$KEY_FILE" ]; then
	echo "Google Analytics key file not found."
	echo "Place your service account JSON in: $SCRIPT_DIR/keys/"
	echo "Or run: source setup_credentials.sh path/to/service-account.json"
	return 1 2>/dev/null || exit 1
fi

export GOOGLE_APPLICATION_CREDENTIALS="$KEY_FILE"

echo "Google Analytics credentials configured"
echo "Key file: $GOOGLE_APPLICATION_CREDENTIALS"
echo "See GA4_SETUP_GUIDE.md for complete setup instructions"
