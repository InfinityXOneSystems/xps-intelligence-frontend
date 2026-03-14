#!/bin/bash

# Vercel Environment Variables Verification Script
# Usage: ./scripts/verify-vercel-env.sh

set -e

echo "=================================================="
echo "Vercel Environment Variables Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a variable is set
check_var() {
    local var_name=$1
    local is_required=$2
    local is_sensitive=$3
    
    if [ -z "${!var_name}" ]; then
        if [ "$is_required" = "true" ]; then
            echo -e "${RED}✗${NC} ${var_name} - NOT SET (REQUIRED)"
            return 1
        else
            echo -e "${YELLOW}○${NC} ${var_name} - Not set (optional)"
            return 0
        fi
    else
        if [ "$is_sensitive" = "true" ]; then
            echo -e "${GREEN}✓${NC} ${var_name} - Set (${#var_name} characters)"
        else
            echo -e "${GREEN}✓${NC} ${var_name} - ${!var_name}"
        fi
        return 0
    fi
}

echo "Checking REQUIRED environment variables..."
echo "--------------------------------------------------"
REQUIRED_OK=0

check_var "SUPABASE_URL" "true" "false" || REQUIRED_OK=1
check_var "SUPABASE_SERVICE_ROLE_KEY" "true" "true" || REQUIRED_OK=1
check_var "AI_GROQ_API_KEY" "true" "true" || REQUIRED_OK=1

echo ""
echo "Checking FRONTEND build-time variables..."
echo "--------------------------------------------------"
check_var "VITE_API_URL" "false" "false"
check_var "VITE_WS_URL" "false" "false"
check_var "VITE_APP_NAME" "false" "false"
check_var "VITE_APP_VERSION" "false" "false"

echo ""
echo "Checking OPTIONAL integration variables..."
echo "--------------------------------------------------"
check_var "BACKEND_URL" "false" "false"
check_var "GITHUB_TOKEN" "false" "true"
check_var "VERCEL_TOKEN" "false" "true"
check_var "RAILWAY_TOKEN" "false" "true"

echo ""
echo "=================================================="

if [ $REQUIRED_OK -eq 0 ]; then
    echo -e "${GREEN}✓ All required environment variables are set!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure Supabase Vault is installed:"
    echo "   CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;"
    echo ""
    echo "2. Run database migrations (supabase-schema.sql)"
    echo ""
    echo "3. Add your email to xps_admins table"
    echo ""
    echo "4. Deploy to Vercel with: vercel deploy"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some required environment variables are missing!${NC}"
    echo ""
    echo "To set environment variables in Vercel:"
    echo "1. Go to: https://vercel.com/dashboard"
    echo "2. Select your project"
    echo "3. Navigate to Settings → Environment Variables"
    echo "4. Add the missing variables listed above"
    echo ""
    echo "See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions."
    echo ""
    exit 1
fi
