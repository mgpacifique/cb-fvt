# Cross-Border Informal Food Flows & Price Volatility Tracker (CB-FVT)
## Agile SCRUM Board & Sprint Delivery Plan

**Project Baseline:** CB-FVT Release 1.0 SRS Document  
**Methodology:** Iterative & Incremental Agile (4 Sprints / 6 Weeks)  
**Target Corridors:** 
1. Gatuna / Katuna (Rwanda – Uganda)
2. Rusumo (Rwanda – Tanzania)
3. Busia / Malaba (Kenya – Uganda)

**Target Commodities:** Dry Maize, Beans, Sorghum, Rice

---

## 1. Scrum Framework & Cadence

| Sprint | Phase Name | Focus Area | SRS Mapping | Duration | Story Points |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | Ingestion & ETL Normalization | FEWS NET / HDX parsers, schema validation, currency & unit normalization | FR 1.1, 1.2, 1.3, NFR 1 | Weeks 1–2 (2 wks) | 21 pts |
| **Sprint 2** | Data Persistence & Calculation Engine | Database schema, Divergence calculation engine, REST APIs & caching | FR 2.1, 2.2, NFR 2 | Week 3 (1 wk) | 18 pts |
| **Sprint 3** | Analytics UI & Visualizations | Next.js layout, dual-axis Chart.js, volume bar charts, filtering & spatial flows | FR 3.1, 3.2, 3.3, FR 5.1 | Weeks 4–5 (2 wks) | 26 pts |
| **Sprint 4** | Policy Events & Release Hardening | Policy markers overlay, impact cards, print report, WCAG, cross-browser, deployment | FR 4.1, 4.2, FR 5.2, NFR 4, 5 | Week 6 (1 wk) | 15 pts |

**Total Estimated Backlog:** 80 Story Points across 4 Sprints.

---

## 2. Epics Overview

- **EPIC-1: Automated Data Ingestion & Transformation (FR 1)**  
  Scheduled extraction, cleansing, coordinate mapping, currency conversion (UGX, RWF, KES, TZS -> USD), and unit standardization into metric tons.
- **EPIC-2: Divergence & Volatility Computation Engine (FR 2)**  
  Paired-market price divergence percentage algorithms, 30-day and 90-day rolling price averages, corridor transit friction modeling.
- **EPIC-3: Responsive Analytical Dashboard (FR 3 & FR 5)**  
  Next.js + Tailwind single-page dashboard, dual-axis Chart.js visualizations, corridor/commodity/date filters, raw data CSV/JSON export.
- **EPIC-4: Geopolitical Policy Overlay & Reporting (FR 4 & NFRs)**  
  Policy event timeline tags, event impact details, printable executive brief, attribution/imputation compliance, security, and performance.

---

## 3. Sprint-by-Sprint Product Backlog & User Stories

### Sprint 1: ETL Pipeline & Data Normalization (Weeks 1–2)
*Goal: Build a resilient automated ingestion pipeline capable of pulling, validating, and normalizing raw trade bulletins into standardized schema.*

| Issue ID | Type | User Story & Description | Acceptance Criteria | Priority | Est. Pts | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FVT-101** | Story | **Ingest Raw FEWS NET & HDX Feeds (FR 1.1)**<br>_As a Data Engineer, I want automated fetchers for FEWS NET and HDX CSV/JSON bulletins, so that we have continuous access to latest price records._ | • Scheduled Node.js batch worker connects over HTTPS with TLS 1.3.<br>• Successfully retrieves CSV and JSON bulletins from remote endpoints.<br>• Handles network timeouts and retry logic (3 retries with exponential backoff). | High | 5 | To Do |
| **FVT-102** | Story | **Payload Cleansing & Validation Engine (FR 1.2)**<br>_As a Data Pipeline, I need to validate incoming payloads, so that malformed records, nulls, and duplicate entries are rejected before processing._ | • Deduplicates entries by `(market_id, commodity_name, recorded_date)`.<br>• Flags and logs unmapped border coordinate tags for review.<br>• Rejects records with null prices or missing mandatory fields. | High | 5 | To Do |
| **FVT-103** | Story | **Multi-Currency Normalization Module (FR 1.3)**<br>_As an Economic Analyst, I want regional currencies (UGX, RWF, KES, TZS) converted to USD, so that price comparisons across borders are economically valid._ | • Currency exchange rate lookup table integrated.<br>• Converts local currency to USD based on the effective trade date.<br>• Maintains historical exchange conversion audit log. | High | 5 | To Do |
| **FVT-104** | Story | **Metric Unit Standardization (FR 1.3)**<br>_As an Analyst, I need prices normalized to USD per Metric Ton (MT), so that various local trade units (bags, kg, tins) are harmonized._ | • Converts local unit measures (e.g., 90kg bags, 50kg sacks, kg) to USD/MT.<br>• Validates output values against domain ranges (detects order-of-magnitude anomalies). | High | 3 | To Do |
| **FVT-105** | Task | **Ingestion Unit Test Suite & Mock Fixtures**<br>_Create comprehensive unit tests covering edge cases in raw bulletins (missing columns, corrupt characters, sudden schema shifts)._ | • Minimum 85% test coverage on ingestion & normalization modules.<br>• Mock fixture suite representing historical EAC trade datasets. | Medium | 3 | To Do |

---

### Sprint 2: Storage Layer, Analytics Engine & REST APIs (Week 3)
*Goal: Construct the PostgreSQL database models, build calculation engines for price divergence and rolling averages, and expose high-performance cached REST endpoints.*

| Issue ID | Type | User Story & Description | Acceptance Criteria | Priority | Est. Pts | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FVT-201** | Story | **Database Schema Definition & Migrations**<br>_As a System Architect, I want the PostgreSQL relational schema created via Prisma, so that trade corridors, markets, prices, and policy events are securely stored._ | • Tables created: `Market`, `Commodity_Price`, `Trade_Corridor`, `Policy_Event`.<br>• Foreign key constraints and composite indexes on `(corridor_id, recorded_date)` established.<br>• Seed script with verified EAC borders (Gatuna/Katuna, Rusumo, Busia/Malaba). | High | 5 | To Do |
| **FVT-202** | Story | **Pair-Market Divergence Calculation Engine (FR 2.1)**<br>_As a Policy Analyst, I want to calculate the percentage price divergence between origin and destination markets, so that market inefficiencies and arbitrage can be identified._ | • Formula implemented: `((P_dest - P_orig) / P_orig) * 100`.<br>• Correctly pairs origin (e.g., Kabale) and destination (e.g., Musanze) for each corridor.<br>• Triggers anomaly flag if spread exceeds 15% threshold. | High | 5 | To Do |
| **FVT-203** | Story | **30-Day and 90-Day Rolling Averages Engine (FR 2.2)**<br>_As an Analyst, I want 30-day and 90-day rolling price averages, so that seasonal noise is smoothed out to reveal macroeconomic trends._ | • SQL/ORM aggregation computes trailing 30-day and 90-day window averages.<br>• Complies with SRS Imputation Rule: missing points are not fabricated without a missed-data flag. | Medium | 3 | To Do |
| **FVT-204** | Story | **Cached REST API Endpoints (NFR 1, NFR 2)**<br>_As a Frontend Developer, I need REST endpoints for corridors, divergence, and history, so that the UI loads in under 800ms._ | • Endpoints: `GET /api/corridors`, `GET /api/divergence?corridor=&commodity=&from=&to=`.<br>• In-memory / HTTP caching layer implemented.<br>• Sub-800ms response time under normal conditions; input sanitization against SQLi/XSS. | High | 5 | To Do |

---

### Sprint 3: Responsive UI & Dynamic Visualizations (Weeks 4–5)
*Goal: Develop the single-page Next.js dashboard with dark/light mode, dynamic filtering controls, dual-axis Chart.js price/volume charts, and CSV/JSON export.*

| Issue ID | Type | User Story & Description | Acceptance Criteria | Priority | Est. Pts | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FVT-301** | Story | **Dashboard Shell & Layout Design (SRS 3.1)**<br>_As a User, I want a responsive SPA layout with Tailwind CSS and Dark/Light mode switch, so that I can use the tool comfortably in varied lighting._ | • Responsive navigation bar and main canvas layout.<br>• Dark/Light mode toggle with persistence in `localStorage`.<br>• Top KPI cards: Current Max Spread (%), Most Volatile Commodity, Monitored Corridors. | High | 5 | To Do |
| **FVT-302** | Story | **Global Filter Controls Bar (FR 3.3)**<br>_As a Trade Officer, I want to filter data by Corridor, Commodity dropdown, and Date-Range slider, so that I can isolate specific market situations._ | • Dropdown for Corridors (Gatuna, Rusumo, Busia) and Commodities (Maize, Beans, Sorghum, Rice).<br>• Interactive date-range slider / date pickers.<br>• Immediate client-side reactive state update (< 300ms chart redraw). | High | 5 | To Do |
| **FVT-303** | Story | **Dual-Axis Interactive Price Trend Chart (FR 3.1)**<br>_As an Economic Analyst, I want dual-axis multi-line charts comparing origin vs. destination prices, so that I can visually inspect pricing spreads over time._ | • Chart.js / React-Chartjs-2 canvas implementation.<br>• Dual Y-axis: Origin Price vs. Destination Price in USD/MT.<br>• Interactive tooltips showing exact values, divergence %, and date.<br>• Visual "Missed Data" indicator for sparse dates without fabrication. | High | 8 | To Do |
| **FVT-304** | Story | **Layered Trade Volume Breakdown Bar Chart (FR 3.2)**<br>_As an Analyst, I want layered bar charts of informal trade tonnage per crop category, so that I understand volume flow alongside price._ | • Stacked/grouped bar chart synchronized with selected date range.<br>• Color-coded by commodity (Maize, Beans, Sorghum, Rice).<br>• Cross-filtering link between volume selection and price chart. | High | 5 | To Do |
| **FVT-305** | Story | **Tabular CSV & JSON Data Export (FR 5.1)**<br>_As a Researcher, I want to export the currently filtered dataset as CSV or JSON, so that I can perform external econometric analysis._ | • Download trigger buttons: "Export CSV" and "Export JSON".<br>• Exports exact filtered records including calculated divergence and timestamps.<br>• Includes source attribution header: "Source: FEWS NET/WFP via CB-FVT". | High | 3 | To Do |

---

### Sprint 4: Policy Event Contextualization, Hardening & Delivery (Week 6)
*Goal: Integrate interactive policy event markers, printable policy briefs, accessibility compliance, end-to-end testing, and production deployment.*

| Issue ID | Type | User Story & Description | Acceptance Criteria | Priority | Est. Pts | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FVT-401** | Story | **Timeline Policy Event Overlays (FR 4.1)**<br>_As a Policy Analyst, I want historical policy event markers plotted directly on price time-series charts, so that sudden anomalies can be tied to regulatory interventions._ | • Interactive vertical markers/pins on time-series for events (border closures, tariff changes, SPS inspections).<br>• Visual categorization by event type with distinct badges/icons. | Medium | 3 | To Do |
| **FVT-402** | Story | **Event Impact Brief Modal / Card (FR 4.2)**<br>_As a User, I want to click any policy marker to view a summary card describing the disruption, so that I get qualitative context._ | • Modal / popover card displaying event title, date, corridor affected, description, and observed price delta.<br>• Close on Esc or backdrop click. | Medium | 3 | To Do |
| **FVT-403** | Story | **Executive Summary Print-Ready Report (FR 5.2)**<br>_As a Trade Facilitator, I want a clean, print-ready PDF/browser view of the active dashboard, so that I can bring one-pagers to stakeholder meetings._ | • Dedicated print CSS stylesheet or PDF export layout.<br>• Formats KPIs, active charts, and attribution metadata cleanly on standard A4/Letter page. | Low | 3 | To Do |
| **FVT-404** | Task | **Accessibility & Cross-Browser Verification (NFR 4)**<br>_Audit and ensure WCAG 2.1 contrast compliance and smooth behavior across Chrome, Firefox, Safari, and Edge (desktop & mobile)._ | • WCAG 2.1 AA contrast verified for both Light and Dark themes.<br>• Verified on desktop browsers and mobile screen viewports.<br>• Keyboard navigation for all filter controls and modal dialogs. | High | 3 | To Do |
| **FVT-405** | Task | **Production Deployment & Swagger API Documentation (SRS 2.6)**<br>_Deploy application to cloud infrastructure (Vercel/Render) and provide OpenAPI 3.0 documentation._ | • CI/CD pipeline builds Next.js production bundle cleanly.<br>• Swagger / OpenAPI 3.0 specification page published at `/api/docs`.<br>• In-app guided user walkthrough modal for first-time visitors. | High | 3 | To Do |

---

## 4. Active Sprint Board (All 4 Sprints & Entire Prototype Specification Delivered)

```
+-----------------------------------------------------------------------------------------------------------------------------+
|                                                      DELIVERED BOARD                                                        |
+------------------------------+---------------------------+---------------------------+--------------------------------------+
|           TO DO              |        IN PROGRESS        |         REVIEW / QA       |                 DONE                 |
+------------------------------+---------------------------+---------------------------+--------------------------------------+
|                              |                           |                           | [FVT-101] Ingest FEWS/HDX (5 pts)    |
|                              |                           |                           | [FVT-102] Cleansing/Validate (5 pts) |
|                              |                           |                           | [FVT-103] Currency Normalize (5 pts) |
|                              |                           |                           | [FVT-104] Metric Ton Norm (3 pts)    |
|                              |                           |                           | [FVT-105] Unit Tests/Mocks (3 pts)   |
|                              |                           |                           | [FVT-201] Schema & Types (5 pts)     |
|                              |                           |                           | [FVT-202] Divergence Engine (5 pts)  |
|                              |                           |                           | [FVT-203] Rolling Averages (3 pts)   |
|                              |                           |                           | [FVT-204] REST API Endpoints (5 pts) |
|                              |                           |                           | [FVT-301] UI Shell & Layout (5 pts)  |
|                              |                           |                           | [FVT-302] Filter Controls (5 pts)    |
|                              |                           |                           | [FVT-303] Dual-Axis Price Chart(8pt) |
|                              |                           |                           | [FVT-304] Stacked Volume Chart (5pt) |
|                              |                           |                           | [FVT-305] CSV & JSON Export (3 pts)  |
|                              |                           |                           | [FVT-401] Policy Timeline Pins (3pt) |
|                              |                           |                           | [FVT-402] Impact Brief Modal (3 pts) |
|                              |                           |                           | [FVT-403] Print Policy Brief (3 pts) |
|                              |                           |                           | [FVT-501] Admin / Data Sources (5pt) |
|                              |                           |                           | [FVT-502] Trends & Volatility (5 pt) |
|                              |                           |                           | [FVT-503] Briefs History Hub (5 pt)  |
|                              |                           |                           | [FVT-504] Policy Detail View (3 pt)  |
|                              |                           |                           | [FVT-505] OpenAPI 3.0 Reference(3pt) |
|                              |                           |                           | [FVT-506] Field Guide & Manual (3pt) |
+------------------------------+---------------------------+---------------------------+--------------------------------------+
```

---

## 5. Agile Quality Gates & Governance

### Definition of Ready (DoR)
A backlog item is ready to enter a sprint only when:
1. User story format defined (`As a... I want... So that...`).
2. Detailed acceptance criteria specified with testable parameters.
3. Dependencies (e.g., source schema, DB models) resolved or scheduled ahead.
4. Estimated in Story Points by the team.

### Definition of Done (DoD)
A story is considered done only when:
1. Code written following modular architecture and TypeScript strict conventions.
2. Unit tests passing with >= 80% coverage on core business logic.
3. NFR 5 Business Rules checked:
   - Data attribution citation (`"Source: FEWS NET/WFP via CB-FVT"`) displayed.
   - Missing data displayed with visual flag; zero artificial interpolation.
4. Peer code review completed and merged to main branch.
5. Passes automated CI linting and build checks without warnings.
