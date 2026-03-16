#!/bin/bash
# Quick Analytics Commands
# ========================
# Essential commands for GA4 data fetching and analysis

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "GD Math Analytics Quick Commands"
echo "===================================="
echo ""

echo "Fetch Latest GA4 Data:"
echo "cd $ROOT"
echo "source setup_credentials.sh && npm run fetch"
echo ""

echo "Run one-off full pipeline:"
echo "cd $ROOT"
echo "source setup_credentials.sh && npm run run-analysis"
echo ""

echo "Start scheduler:"
echo "cd $ROOT"
echo "source setup_credentials.sh && npm run start-cron"
echo ""

echo "Check Data Files:"
echo "ls -la $ROOT/data/"
echo ""

echo "Setup Credentials:"
echo "source $ROOT/setup_credentials.sh"
echo ""

echo "Node-cron Setup Guide:"
echo "cat $ROOT/docs/node_cron_setup.md"
echo ""

echo "All systems ready."
