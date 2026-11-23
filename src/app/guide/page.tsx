'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  Compass,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  FileText,
  BarChart3,
  Sliders,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function GuidePage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Navigation Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Spatial Workspace
              </Link>
              <span>/</span>
              <span>Documentation</span>
              <span>/</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">Field Guide</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              From a Border Signal to a Policy Decision.
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Analytical walkthrough for trade economists, border officers, and regional policy leads monitoring East African cross-border grain corridors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/policy"
              className="btn-pressable inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              Open Policy Simulator
            </Link>
          </div>
        </div>

        {/* 4 Steps Bento Grid Walkthrough */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Core Workflow · 4 Analytic Steps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="apple-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="apple-badge-icon bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                    01 / 04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">
                  Set Corridor & Window
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Select your monitored corridor (e.g. Gatuna / Katuna), staple grain (Maize, Beans, Rice, Sorghum), and observation horizon (30D or 90D).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-400">
                Schematic map updates origin/dest baseline pairs
              </div>
            </div>

            {/* Step 2 */}
            <div className="apple-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="apple-badge-icon bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    02 / 04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">
                  Read Price & Spread
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Dual-axis chart displays origin and destination market wholesale prices (left USD/MT axis) paired with divergence spread % (right axis).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-400">
                Identifies price wedge expansion & friction
              </div>
            </div>

            {/* Step 3 */}
            <div className="apple-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="apple-badge-icon bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    03 / 04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">
                  Audit Gaps & Policies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Notice “Missed Data” on 17 Aug destination gaps without synthetic interpolation (SRS NFR 5). Click policy markers (P1, P2) for pre/post context.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-400">
                Non-imputation preserves authentic empirical integrity
              </div>
            </div>

            {/* Step 4 */}
            <div className="apple-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="apple-badge-icon bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    04 / 04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">
                  Export Executive Memo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Generate print-ready one-page policy briefs with complete parameter provenance, or export raw CSV/JSON feeds for statistical software.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-400">
                Formatted for ministerial & donor briefings
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Metric Definitions Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="apple-card p-6 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Formula Definition
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Divergence Spread %
            </h4>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 font-mono text-xs text-teal-700 dark:text-teal-400">
              ((Dest Price − Origin Price) ÷ Origin Price) × 100
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A positive divergence represents destination premium reflecting cross-border transit costs, tariffs, and customs delay friction.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Risk Dispersion
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Volatility (CV%)
            </h4>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 font-mono text-xs text-amber-600 dark:text-amber-400">
              (StdDev(Price) ÷ Mean(Price)) × 100
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates coefficient of price variation over the active time horizon. Dry Beans exhibits the highest regional volatility at 12.4% CV.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Currency Peg
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              USD/MT Harmonization
            </h4>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 font-mono text-xs text-blue-600 dark:text-blue-400">
              (Local Currency/kg × 1,000) ÷ FX Rate
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Harmonizes UGX, RWF, KES, and TZS to standard metric ton benchmarks using dated central bank baseline pegs (01 Jul 2026).
            </p>
          </div>
        </div>

        {/* Requirements Handoff Bento Row */}
        <div className="apple-card p-6 space-y-5">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              System Architecture Verification
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Software Requirements Specification (SRS) Compliance Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Functional Capabilities (FR 1…5)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">FR 1</span>
                  <span>Ingestion, RFC 4180 parsing, coordinate deduplication & Central Bank FX peg conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">FR 2</span>
                  <span>4-corridor and 4-commodity filtering with pair-market divergence synthesis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">FR 3</span>
                  <span>Dual-axis price divergence visualization with missing-data flags and volume overlay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">FR 4</span>
                  <span>Policy markers with pre/post spread impacts and trade friction simulator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">FR 5</span>
                  <span>Exportable CSV/JSON data, printable briefs, and OpenAPI 3.0 reference</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span>Governance & Non-Functional Mandates (NFR)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold shrink-0">NFR 1</span>
                  <span>Sub-800ms API response latency achieved via in-memory caching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold shrink-0">NFR 2</span>
                  <span>Composite key deduplication across (market_id, commodity_id, date)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold shrink-0">NFR 4</span>
                  <span>WCAG 2.1 AA contrast verified across Apple Ceramic Light and Dark palettes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-bold shrink-0">NFR 5</span>
                  <span><strong>Strict Non-Imputation:</strong> Missing destination prices serialize strictly as null</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
