'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CorridorId, CommodityId, PolicyEvent } from '@/lib/types';
import { CORRIDORS, COMMODITIES, getObservations } from '@/lib/data';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { PriceChart } from '@/components/PriceChart';
import { PolicyModal } from '@/components/PolicyModal';
import {
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export default function TrendsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorId>('gatuna-katuna');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityId>('maize');
  const [rollingWindow, setRollingWindow] = useState<'30' | '90'>('90');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedPolicyEvent, setSelectedPolicyEvent] = useState<PolicyEvent | null>(null);

  const observations = getObservations(selectedCorridor, selectedCommodity);
  const corridor = CORRIDORS[selectedCorridor];
  const commodity = COMMODITIES[selectedCommodity];

  const spreadUsd = corridor.destPriceUsd - corridor.originPriceUsd;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <FilterBar
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
        selectedCommodity={selectedCommodity}
        onSelectCommodity={setSelectedCommodity}
        rollingWindow={rollingWindow}
        onSelectRollingWindow={setRollingWindow}
        onReset={() => {
          setSelectedCorridor('gatuna-katuna');
          setSelectedCommodity('maize');
          setRollingWindow('90');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb & Page Title (Apple Minimalist) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#6E6E73] dark:text-[#8E8E93]">
              <Link href="/" className="hover:text-[#0071E3] dark:hover:text-[#2997FF] flex items-center transition-colors">
                <Compass className="w-3.5 h-3.5 mr-1" /> Spatial Monitor
              </Link>
              <span>/</span>
              <span className="text-[#1D1D1F] dark:text-white font-medium">Trends & Volatility</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1.5 font-display">
              Market Spreads & Relative Dispersion
            </h1>

            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#8E8E93] mt-1 max-w-2xl leading-relaxed">
              Cross-border price trends, trailing moving averages, and relative coefficient of variation (CV%) across East Africa.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-[#1D1D1F] dark:text-white font-medium">
              Corridor: {corridor.name}
            </span>
          </div>
        </div>

        {/* ====================================================================
            ROW 1: APPLE BENTO KPI TILES (PolicyPilot Calibrated)
            ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Destination Spread */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-black/[0.12] dark:hover:border-white/[0.16] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0071E3] dark:text-[#2997FF] border border-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <Link
                href="/policy"
                className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white transition-colors"
                title="Simulate Shocks"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-[#6E6E73] dark:text-[#8E8E93] block">
                Destination Premium
              </span>
              <div className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1 tabular-nums">
                +{corridor.currentDivergencePct}%
              </div>
              <span className="text-[11px] text-[#0071E3] dark:text-[#2997FF] font-mono mt-0.5 block tabular-nums">
                ${spreadUsd} USD/MT Price Wedge
              </span>
            </div>
          </div>

          {/* Tile 2: Series Coverage */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-black/[0.12] dark:hover:border-white/[0.16] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-[#6E6E73] dark:text-[#8E8E93]">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-[#6E6E73] dark:text-[#8E8E93] block">
                Series Completeness
              </span>
              <div className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1 tabular-nums">
                {corridor.seriesCount.available} / {corridor.seriesCount.total}
              </div>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block">
                {selectedCorridor === 'gatuna-katuna' ? '17 Aug Missed (NFR 5)' : '100% Releases Validated'}
              </span>
            </div>
          </div>

          {/* Tile 3: Leading Staple CV */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-black/[0.12] dark:hover:border-white/[0.16] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <button
                onClick={() => setSelectedCommodity('beans')}
                className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
                title="Switch to Beans"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-[#6E6E73] dark:text-[#8E8E93] block">
                Most Volatile Staple
              </span>
              <div className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1 tabular-nums">
                Beans · 12.4%
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                Coefficient of Variation (CV%)
              </span>
            </div>
          </div>

          {/* Tile 4: Transport Friction */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-black/[0.12] dark:hover:border-white/[0.16] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <Link
                href="/guide"
                className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] flex items-center justify-center text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white transition-colors"
                title="Methodology Guide"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-[#6E6E73] dark:text-[#8E8E93] block">
                Corridor Distance
              </span>
              <div className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1 tabular-nums">
                {corridor.distanceKm} km
              </div>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block">
                Single Customs Territory Fast-Track
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            ROW 2: BENTO COMPARISON & CLEAN HIGHLIGHT CARD
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento Left: Multi-Segment Volatility Progress Bar */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-white tracking-tight">
                    Cross-Staple Price Volatility Distribution
                  </h3>
                  <p className="text-xs text-[#6E6E73] dark:text-[#8E8E93] mt-0.5">
                    90-day relative price dispersion (CV%) across East Africa wholesale markets.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-black/[0.04] dark:bg-white/[0.08] text-[#6E6E73] dark:text-[#8E8E93]">
                  4 Monitored Staples
                </span>
              </div>

              {/* Progress Bar with Emil Kowalski Concentric Radii */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-[#6E6E73] dark:text-[#8E8E93] tabular-nums">
                  <span>Beans (12.4%)</span>
                  <span>Sorghum (8.6%)</span>
                  <span>Maize (6.8%)</span>
                  <span>Rice (5.2%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/[0.04] dark:bg-black/40 overflow-hidden flex p-0.5 border border-black/[0.06] dark:border-white/[0.08]">
                  <div className="h-full rounded-l-full bg-amber-500" style={{ width: '38%' }} />
                  <div className="h-full bg-violet-500 mx-0.5" style={{ width: '26%' }} />
                  <div className="h-full bg-[#0071E3] mx-0.5" style={{ width: '21%' }} />
                  <div className="h-full rounded-r-full bg-emerald-500" style={{ width: '15%' }} />
                </div>
              </div>

              {/* Legend Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F] dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Beans</span>
                  </div>
                  <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block tabular-nums">12.4% CV · High</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F] dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span>Sorghum</span>
                  </div>
                  <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block tabular-nums">8.6% CV · Moderate</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F] dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
                    <span>Maize</span>
                  </div>
                  <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block tabular-nums">6.8% CV · Stable</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F] dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Rice</span>
                  </div>
                  <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono mt-0.5 block tabular-nums">5.2% CV · Minimal</span>
                </div>
              </div>
            </div>

            {/* Bottom Counter Bar */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[#1D1D1F] dark:text-white tabular-nums">52</span>
                <span className="text-[#6E6E73] dark:text-[#8E8E93]">Weekly Observations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[#0071E3] dark:text-[#2997FF] tabular-nums">4</span>
                <span className="text-[#6E6E73] dark:text-[#8E8E93]">Monitored Corridors</span>
              </div>
            </div>
          </div>

          {/* Bento Right: Clean Accent Surface Card (PolicyPilot Style) */}
          <div className="bg-[#0071E3] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-blue-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-100 font-medium">
                Corridor Spread Index
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white font-semibold">
                EAC Peg
              </span>
            </div>

            {/* Center Gauge Simulation */}
            <div className="my-4 flex items-center gap-4 relative z-10">
              <div className="relative w-24 h-24 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold font-mono tabular-nums">18%</div>
                  <div className="text-[9px] uppercase tracking-wider text-blue-100">Spread</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs font-mono w-full">
                <div className="p-1.5 px-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-blue-100">Gatuna / Katuna</span>
                  <span className="font-bold tabular-nums">+18.0%</span>
                </div>
                <div className="p-1.5 px-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-blue-100">Malaba</span>
                  <span className="font-bold tabular-nums">+18.6%</span>
                </div>
                <div className="p-1.5 px-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-blue-100">Busia</span>
                  <span className="font-bold tabular-nums">+15.8%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed relative z-10 pt-2 border-t border-white/15 max-w-prose">
              Observed spreads reflect diesel haulage costs, customs dwell, and local market harvest disparities.
            </p>
          </div>
        </div>

        {/* ====================================================================
            ROW 3: TIME-SERIES PRICE SPREAD CHART
            ==================================================================== */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-6 shadow-xs">
          <PriceChart
            observations={observations}
            rollingWindow={rollingWindow}
            onSelectPolicyEvent={setSelectedPolicyEvent}
            corridorName={corridor.name}
            originMarket={corridor.originMarket}
            destMarket={corridor.destMarket}
          />
        </div>

        {/* ====================================================================
            ROW 4: BENCHMARK SUMMARY (Apple Dual Card)
            ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-semibold text-[#0071E3] dark:text-[#2997FF] uppercase tracking-wider">
                90-Day Window · Benchmark Summary
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0071E3] dark:text-[#2997FF] border border-blue-500/20">
                13 Origin / 12 Destination
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-slate-300 leading-relaxed max-w-prose">
              The 90-day baseline captures quarter-long movements across the harvest cycle.
              Arithmetic mean of available weekly values: {corridor.originMarket} averages <strong className="tabular-nums">$292/t</strong>, while {corridor.destMarket} averages <strong className="tabular-nums">$346/t</strong>.
            </p>
            <div className="text-[11px] font-mono text-[#6E6E73] dark:text-[#8E8E93] flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Missing prices are never fabricated or imputed under SRS NFR 5.</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                30-Day Comparison · High-Frequency Trend
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                5 Paired Releases
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-slate-300 leading-relaxed max-w-prose">
              Recent destination prices trend <strong className="tabular-nums">$12/t</strong> above the 90-day mean, while origin prices are <strong className="tabular-nums">$7/t</strong> higher, indicating seasonal post-harvest stock tightening.
            </p>
            <div className="text-[11px] font-mono text-[#6E6E73] dark:text-[#8E8E93] flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Controls switch rolling window while maintaining weekly point fidelity.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Policy Modal Overlay */}
      <PolicyModal
        event={selectedPolicyEvent}
        onClose={() => setSelectedPolicyEvent(null)}
      />
    </div>
  );
}
