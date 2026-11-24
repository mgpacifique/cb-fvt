#!/usr/bin/env bash
# ==============================================================================
# CB-FVT Production Deployment Automation Script
# Cross-Border Food Flows & Price Volatility Tracking Engine
# ==============================================================================

set -e

# ANSI Color Tokens
GREEN='\033[0;32m'
BLUE='\033[0;34m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}        CB-FVT Production Container Deployment Pipeline           ${NC}"
echo -e "${BLUE}==================================================================${NC}"

# 1. Check Docker binary
DOCKER_BIN=""
if command -v docker &> /dev/null; then
    DOCKER_BIN="docker"
elif [ -f "/Applications/Docker.app/Contents/Resources/bin/docker" ]; then
    DOCKER_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"
else
    echo -e "${RED}[ERROR] Docker is not installed or not in PATH.${NC}"
    echo -e "${AMBER}Please start Docker Desktop from /Applications/Docker.app and retry.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker engine located: ${DOCKER_BIN}${NC}"

# 2. Check if Docker daemon is running
if ! $DOCKER_BIN info &> /dev/null; then
    echo -e "${AMBER}[WARNING] Docker daemon is not running.${NC}"
    echo -e "Attempting to launch Docker Desktop..."
    open -a Docker || true
    echo "Waiting for Docker daemon to become responsive (up to 30s)..."
    for i in {1..30}; do
        if $DOCKER_BIN info &> /dev/null; then
            echo -e "${GREEN}✓ Docker daemon is active!${NC}"
            break
        fi
        sleep 1
    done
fi

if ! $DOCKER_BIN info &> /dev/null; then
    echo -e "${RED}[ERROR] Docker daemon could not be reached. Please launch Docker Desktop manually and retry.${NC}"
    exit 1
fi

# 3. Environment configuration check
if [ ! -f ".env.production" ]; then
    echo -e "${AMBER}[!] .env.production not found. Initializing from .env.production.example...${NC}"
    cp .env.production.example .env.production
    echo -e "${GREEN}✓ Created .env.production${NC}"
fi

# 4. Build and deploy containers
echo -e "${BLUE}Building container images (Multi-Stage Next.js + Node 24 Admin)...${NC}"
$DOCKER_BIN compose build

echo -e "${BLUE}Starting services in detached mode...${NC}"
$DOCKER_BIN compose up -d

# 5. Service health verification
echo -e "${BLUE}Verifying container health status...${NC}"
sleep 3

$DOCKER_BIN compose ps

echo -e "${GREEN}==================================================================${NC}"
echo -e "${GREEN}             CB-FVT Deployment Completed Successfully!            ${NC}"
echo -e "${GREEN}==================================================================${NC}"
echo -e "• Public Spatial Application:  ${BLUE}http://localhost:3000${NC} (Zero-Login / Public Observer)"
echo -e "• Dedicated Admin Server:      ${BLUE}http://localhost:4000${NC} (Secured / Master: p.gatabazi@alustudent.com)"
echo -e "• Persistent Data Volume:      ${AMBER}cbfvt_persistent_data${NC} (Preserves SQLite & Admin Users)"
echo -e "=================================================================="
