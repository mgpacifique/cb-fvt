# CB-FVT: East Africa Cross-Border Food Flows & Price Volatility Tracking Engine

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24_Alpine-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Container-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Academic: ALU](https://img.shields.io/badge/Institution-African_Leadership_University-red?style=flat-square)](https://www.alueducation.com/)

**CB-FVT** is an empirical spatial intelligence and econometric observatory designed to monitor cross-border grain arbitrage, price transmission, and market friction across East African Community (EAC) trade corridors.

The platform continuously analyzes wholesale price disparities across paired border markets, models counterfactual policy shocks, and delivers verifiable analytical digests to trade ministries, central banks, and regional logistics stakeholders.

---

## Table of Contents

- [Core Capabilities](#core-capabilities)
- [Architecture & Two-Server Isolation](#architecture--two-server-isolation)
- [Data Integrity & ALU NFR 5 Non-Imputation](#data-integrity--alu-nfr-5-non-imputation)
- [Monitored Corridors & Commodities](#monitored-corridors--commodities)
- [Repository Structure](#repository-structure)
- [Quick Start: Docker (Recommended)](#quick-start-docker-recommended)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Production Cloud Deployment & SSL (Option 3 Guide)](#production-cloud-deployment--ssl-option-3-guide)
- [REST API Reference](#rest-api-reference)
- [Security & Access Control](#security--access-control)
- [Contributing & Academic Citation](#contributing--academic-citation)

---

## Core Capabilities

### 1. Spatial Flow & Price Transmission Monitor (`/`)
- **GIS Cartography Engine:** Interactive Leaflet map displaying real-time trade corridors, One-Stop Border Posts (OSBP), and market hubs.
- **Directional Spread Vectors:** Visualizes destination price premiums (e.g., Kigali vs. Kabale, Nairobi vs. Tororo) with distance-adjusted haulage costs.
- **Dynamic Corridor Switching:** Instantaneous recalculation of transport margins, corridor transit days, and route-specific friction points.

### 2. Trends & Volatility Studio (`/trends`)
- **Time-Series Volatility Analytics:** Rolling 30-day and 90-day moving averages tracking price divergence across seasons.
- **Relative Dispersion Index (CV%):** Standardized coefficient of variation benchmarking regional staple price dispersion against historical norms.
- **Tabular Data Views:** High-density, high-contrast numerical inspection with sortable corridor indicators.

### 3. Policy Shock Simulator (`/policy`)
- **Econometric Counterfactual Engine:** Tactile policy lever simulation allowing analysts to project price and welfare outcomes under custom shocks:
  - **Border Dwell Hours:** Simulates demurrage and logistics idle penalties ($1.15/MT-hour).
  - **Sanitary & Phytosanitary (SPS) NTB Fees:** Assesses administrative testing fees.
  - **Fuel Surcharges:** Evaluates global oil price pass-through to road transit.
  - **Tariff & Custom Levies:** Computes Single Customs Territory (SCT) tariff deviations.
  - **Export Quota Constriction:** Models non-linear scarcity shocks on destination consumer prices.
- **Scenario Presets:** Instant testing of standardized EAC scenarios (e.g., *Full SCT Electronic Clearance*, *Sudden Border Closure*, *Fuel Subsidy Removal*).
- **Executive Policy Memo Generator:** One-click copyable policy memo with calculated consumer welfare deltas.

### 4. Executive Briefs & Synthesis Queue (`/briefs`)
- **Validation Queue Cards:** Structured card layout tracking analytical briefs by reference ID, priority, and due dates.
- **Publication-Ready Summaries:** Clean, print-ready formal memorandums tailored for EAC ministerial briefings.
- **Integrity Badges:** Direct verification stamps indicating strict compliance with non-imputation auditing.

---

## Architecture & Two-Server Isolation

To guarantee system resilience, strict data governance, and role-based access control, CB-FVT enforces a **hard architectural separation** between the public analytical observer and the administrative control plane:

```
                          ┌───────────────────────────┐
                          │    Public Internet        │
                          └─────────────┬─────────────┘
                                        │
                         Reverse Proxy (Nginx / Caddy)
                                        │
            ┌───────────────────────────┴───────────────────────────┐
            │                                                       │
  Port 3000 (Public Access)                               Port 4000 (Restricted Admin)
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│  CB-FVT Spatial Application          │        │  CB-FVT Dedicated Control Plane      │
│  (cbfvt-frontend)                    │        │  (cbfvt-admin)                       │
│                                      │        │                                      │
│  • Public Observer Mode (Zero-Login) │        │  • Strict Scrypt Authentication      │
│  • Spatial GIS Corridor Map          │        │  • Dynamic Admin User CRUD           │
│  • Trends & Historical Charts        │        │  • Self-Serve 6-Digit Password Reset │
│  • Policy Shock Simulator Engine     │        │  • Manual Data Ingestion / CSV ETL   │
│  • Printable Executive Briefs        │        │  • Persistent SQLite / Prisma Volume │
└──────────────────────────────────────┘        └──────────────────┬───────────────────┘
                                                                   │
                                                        Mounted Docker Volume
                                                        (cbfvt_persistent_data)
```

1. **Analyst Application (`port 3000`):**
   - Next.js 14 App Router standalone production build.
   - Publicly accessible by default; analysts inspect models without credentials.
   - Administrative menus and privileged management routes are strictly decoupled.
2. **Dedicated Admin Control Plane (`port 4000`):**
   - Independent Node 24 runtime with persistent SQLite data layer.
   - Protected by encrypted sessions, scrypt password hashing, and token-based API verification.
   - Complete admin lifecycle: user invitation, privilege elevation, observation ingestion, and audit trail.

---

## Data Integrity & ALU NFR 5 Non-Imputation

A foundational tenet of the CB-FVT platform is compliance with **African Leadership University (ALU) SRS Non-Imputation Rule NFR 5**:

> **Rule NFR 5:** *Missing empirical observations must be explicitly preserved as null values and displayed with visible temporal gaps. Under no circumstances may missing market prices be fabricated, synthetic smoothed, or filled using linear interpolation.*

In real-world cross-border trade, missing data represents critical empirical events—such as border strikes, market closures, or system downtime. Synthetic interpolation masks these structural shocks and misleads policy authorities. CB-FVT models preserve missing intervals (such as the August 17 border closure) as explicit analytical pauses across all charts and simulation series.

---

## Monitored Corridors & Commodities

| Corridor Key | Origin Market | Destination Market | Distance | Primary Border Post | Focus Commodity |
|:---|:---|:---|:---:|:---|:---|
| `gatuna-katuna` | Kabale (Uganda) | Kigali (Rwanda) | 82 km | Gatuna / Katuna OSBP | White Maize |
| `busia` | Tororo (Uganda) | Kisumu (Kenya) | 118 km | Busia One-Stop Border | Dry Beans |
| `malaba` | Eldoret (Kenya) | Kampala (Uganda) | 240 km | Malaba Border Post | White Maize |
| `rusumo` | Kahama (Tanzania) | Kigali (Rwanda) | 315 km | Rusumo International Bridge | Rice |

---

## Repository Structure

```
cb-fvt/
├── Dockerfile.frontend        # Multi-stage standalone Next.js container (Port 3000)
├── Dockerfile.admin           # Node 24 Alpine dedicated admin container (Port 4000)
├── docker-compose.yml         # Production multi-container orchestration
├── next.config.js             # Standalone output configuration
├── package.json               # Monorepo dependencies and execution scripts
├── tsconfig.json              # TypeScript compilation specifications
├── scripts/
│   └── deploy.sh              # Automated zero-downtime deployment script
├── server/
│   ├── adminServer.ts         # Standalone HTTP control plane & web gateway (Port 4000)
│   └── package.json           # Scoped ESM declaration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/users/   # Dynamic admin user CRUD endpoints
│   │   │   └── auth/          # Auth, session, and 6-digit password reset handlers
│   │   ├── briefs/            # Executive briefs & synthesis queue
│   │   ├── policy/            # Policy shock scenario matrix & simulator
│   │   ├── trends/            # Time-series volatility & CV% studio
│   │   ├── layout.tsx         # Root layout with SF Pro & font definitions
│   │   └── page.tsx           # Primary GIS spatial monitor
│   ├── components/
│   │   ├── FilterBar.tsx      # Global corridor & commodity selector
│   │   ├── Header.tsx         # Clean navigation & status indicators
│   │   ├── MapView.tsx        # Leaflet GIS cartography component
│   │   ├── PolicyShockSimulator.tsx # Econometric simulation module
│   │   └── PriceChart.tsx     # High-contrast time-series chart
│   └── lib/
│       ├── auth/
│       │   ├── serverAuth.ts  # Route protection & Bearer verification
│       │   └── userStore.ts   # Scrypt-hashed user data store
│       ├── data.ts            # Historical time-series observations & corridor registry
│       ├── simulation/        # Counterfactual simulation engine & presets
│       └── types.ts           # Core domain TypeScript interfaces
└── public/                    # Static assets and icons
```

---

## Quick Start: Docker (Recommended)

Ensure you have [Docker Desktop](https://www.docker.com/) installed and running.

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/cb-fvt.git
cd cb-fvt
```

### 2. Launch with One Command
Execute the automated deployment pipeline script:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

Or invoke Docker Compose directly:
```bash
docker compose up -d --build
```

### 3. Access Services
- **Public Spatial Application:** [http://localhost:3000](http://localhost:3000)
- **Admin Control Plane:** [http://localhost:4000](http://localhost:4000)
- **Default Super Admin:** `p.gatabazi@alustudent.com` (password: `manzi@uzzy`)

---

## Local Development Setup

If running without Docker for rapid feature development:

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Launch Services
Run both the public Next.js frontend and the dedicated admin server concurrently:
```bash
npm run dev:all
```

Or run them individually in separate terminal sessions:
```bash
# Terminal 1: Public Frontend (Port 3000)
npm run dev

# Terminal 2: Dedicated Admin Control Plane (Port 4000)
npm run dev:admin
```

---

## Environment Configuration

Create a `.env.production` file in the root directory (refer to `.env.example`):

```bash
# Port Configuration
PORT=3000
ADMIN_PORT=4000

# Base URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:4000

# Security Secrets
JWT_SECRET=replace_with_a_secure_random_64_char_string
ADMIN_API_KEY=replace_with_internal_communication_secret

# Database & Persistent Storage
DATABASE_URL=file:/app/data/cbfvt.db
DATA_DIR=/app/data
```

---

## Production Cloud Deployment & SSL (Option 3 Guide)

To deploy CB-FVT to a live public cloud server (e.g., **DigitalOcean Droplet, AWS EC2, Hetzner, or Linode**) with a custom domain and automated Let's Encrypt SSL certificates, follow this step-by-step production guide:

### Step 1: Provision a Cloud Server
1. Create an **Ubuntu 24.04 LTS** virtual machine (minimum 2 vCPU, 2 GB RAM recommended).
2. Configure DNS records on your domain registrar:
   - `A` Record: `fvt.yourdomain.com` → Point to your Server IPv4
   - `A` Record: `admin.fvt.yourdomain.com` → Point to your Server IPv4

### Step 2: Install Docker & Docker Compose
SSH into your server:
```bash
ssh root@your-server-ip

# Update system packages
apt update && apt upgrade -y

# Install Docker engine
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify Docker installation
docker --version
docker compose version
```

### Step 3: Clone Repository & Configure Environment
```bash
git clone https://github.com/your-username/cb-fvt.git /opt/cb-fvt
cd /opt/cb-fvt

# Prepare environment file
cp .env.example .env.production
nano .env.production
```
*Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_ADMIN_URL` to your production domain names.*

### Step 4: Build & Launch Containers
```bash
docker compose -f docker-compose.yml up -d --build
```
Verify both containers are running healthy:
```bash
docker compose ps
```

### Step 5: Configure Reverse Proxy (Nginx + SSL)
Install Nginx and Certbot:
```bash
apt install -y nginx certbot python3-certbot-nginx
```

Create an Nginx server block for both domains:
```bash
nano /etc/nginx/sites-available/cbfvt.conf
```

Add the following configuration:
```nginx
# 1. Public Spatial Monitor
server {
    server_name fvt.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Dedicated Admin Control Plane
server {
    server_name admin.fvt.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and reload Nginx:
```bash
ln -s /etc/nginx/sites-available/cbfvt.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 6: Obtain Free Let's Encrypt SSL Certificates
Run Certbot to automatically provision and bind HTTPS:
```bash
certbot --nginx -d fvt.yourdomain.com -d admin.fvt.yourdomain.com
```
Certbot will configure SSL renewal crons automatically. Your application is now live under HTTPS!

---

## REST API Reference

### Authentication Endpoints
- `POST /api/auth/login` — Authenticates admin credentials, returns JWT bearer cookie.
- `GET /api/auth/session` — Verifies active admin session.
- `POST /api/auth/logout` — Terminates active session.
- `POST /api/auth/forgot-password` — Generates a time-bound 6-digit verification code.
- `POST /api/auth/reset-password` — Validates verification code and applies updated password.

### Admin User Management
- `GET /api/admin/users` — Lists all registered admin operators.
- `POST /api/admin/users` — Creates a new admin account with assigned role (`admin` | `super_admin`).
- `DELETE /api/admin/users/:id` — Removes an admin user (primary super admin is protected).

### Simulation & Observations
- `GET /api/observations?corridor=:id&commodity=:id` — Retrieves verified observation series.
- `POST /api/simulation` — Computes counterfactual econometric spread deltas.

---

## Security & Access Control

- **Cryptographic Hashing:** Passwords are never stored in plaintext; they are hashed using Node.js `crypto.scryptSync` with unique cryptographic salts.
- **Role-Based Isolation:** Observers browse the spatial map without credentials. Elevated capabilities (manual price injection, ETL ingestion, user management) require authenticated `super_admin` or `admin` session tokens.
- **Persistent Data Protection:** All administrative users, audits, and custom datasets reside in a Docker volume (`cbfvt_persistent_data`), surviving container teardowns and version upgrades.

---

## Contributing & Academic Citation

This project is developed as part of applied research in empirical trade analytics at **African Leadership University (ALU)**.

### Citation
```bibtex
@software{cbfvt_2026,
  author = {Pacifique Gatabazi},
  title = {CB-FVT: Cross-Border Food Flows & Price Volatility Tracking Engine},
  institution = {African Leadership University},
  year = {2026},
  url = {https://github.com/your-username/cb-fvt}
}
```

### License
This project is open-source software licensed under the [MIT License](LICENSE).
