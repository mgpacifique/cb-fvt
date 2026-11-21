'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, BarChart2 } from 'lucide-react';
import { KPI_BENCHMARKS } from '@/lib/data';

interface FloatingKpiRowProps {
  currentDivergence: number | null;
  corridorName: string;
  commodityName: string;
  originPrice?: number;
  destPrice?: number;
}

export const FloatingKpiRow: React.FC<FloatingKpiRowProps> = ({
  currentDivergence,
  originPrice = 300,
  destPrice = 354,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const divergenceVal = currentDivergence ?? KPI_BENCHMARKS.maxDivergencePct;
  const spreadUsd = destPrice - originPrice;

  return (
    <div className="fixed top-15 sm:top-16 inset-x-0 z-30 px-3 sm:px-6 pointer-events-none transition-all duration-200">
      <div className="max-w-6xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col items-end">
        {/* Collapse / Expand Toggle Button (Desktop & Tablet) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="pointer-events-auto btn-pressable mb-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hidden sm:flex items-center gap-1.5 shadow-sm border border-slate-200/80 dark:border-white/10"
          title={collapsed ? 'Show KPI Metrics' : 'Minimize Metrics for Expansive Spatial Map'}
        >
          <BarChart2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          <span>{collapsed ? 'Show Metrics' : 'Hide Metrics'}</span>
          {collapsed ? <ChevronDown className="w-3 h-3 text-teal-600 dark:text-teal-400" /> : <ChevronUp className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
        </button>

        {/* ====================================================================
            MOBILE VIEW (< 768px): Compact Scrollable Ticker (Hero Stats Strip)
            ==================================================================== */}
        <div className="sm:hidden pointer-events-auto w-full overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 min-w-max px-1">
            <div className="px-3 py-1.5 rounded-full liquid-glass border border-slate-200/80 dark:border-white/15 flex items-center gap-2 shadow-sm text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400">Spread:</span>
              <span className="font-bold text-amber-500">+{divergenceVal.toFixed(1)}%</span>
              <span className="text-[10px] text-emerald-500">(+${spreadUsd}/t)</span>
            </div>

            <div className="px-3 py-1.5 rounded-full liquid-glass border border-slate-200/80 dark:border-white/15 flex items-center gap-2 shadow-sm text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400">Vol:</span>
              <span className="font-bold text-slate-900 dark:text-white">2,420 t</span>
            </div>

            <div className="px-3 py-1.5 rounded-full liquid-glass border border-slate-200/80 dark:border-white/15 flex items-center gap-2 shadow-sm text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400">Risk:</span>
              <span className="font-bold text-amber-400">Beans 12.4%</span>
            </div>

            <div className="px-3 py-1.5 rounded-full liquid-glass border border-slate-200/80 dark:border-white/15 flex items-center gap-2 shadow-sm text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400">Coverage:</span>
              <span className="font-bold text-emerald-400">12/13</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            COLLAPSED DESKTOP VIEW: Sleek Floating Single-Line Glass Ticker
            ==================================================================== */}
        {collapsed && (
          <div className="hidden sm:flex pointer-events-auto items-center gap-4 px-4 py-1.5 rounded-full liquid-glass border border-slate-200/80 dark:border-white/15 shadow-md text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase">Spread:</span>
              <span className="font-bold text-amber-500">+{divergenceVal.toFixed(1)}%</span>
              <span className="text-[10px] text-emerald-500">(+${spreadUsd}/t)</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase">Vol:</span>
              <span className="font-bold text-slate-900 dark:text-white">2,420 t</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase">Risk:</span>
              <span className="font-bold text-amber-400">Beans 12.4% CV</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase">Quality:</span>
              <span className="font-bold text-emerald-400">12/13 (92.3%)</span>
            </div>
          </div>
        )}

        {/* ====================================================================
            TABLET & DESKTOP VIEW (>= 768px): Compact Apple Bento HUD Tiles
            - Redesigned for 1440px displays: compact padding, ~80px height
            ==================================================================== */}
        {!collapsed && (
          <div className="hidden sm:flex lg:grid lg:grid-cols-4 pointer-events-auto w-full overflow-x-auto snap-x no-scrollbar gap-2.5 xl:gap-3">
            {/* Tile 1: Price Divergence */}
            <div className="min-w-[220px] lg:min-w-0 flex-1 snap-start p-3 px-3.5 sm:p-3.5 sm:px-4 rounded-2xl liquid-glass-tile border border-slate-200/80 dark:border-white/15 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Price Divergence
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  Above 15% alert
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-slate-900 dark:text-white">
                  +{divergenceVal.toFixed(1)}%
                </span>
                <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  (+${spreadUsd}/t)
                </span>
              </div>

              <p className="mt-1 text-[10px] font-sans text-slate-500 dark:text-slate-400 truncate">
                Origin ${originPrice}/t → Dest ${destPrice}/t benchmark
              </p>
            </div>

            {/* Tile 2: Total Trade Volume */}
            <div className="min-w-[220px] lg:min-w-0 flex-1 snap-start p-3 px-3.5 sm:p-3.5 sm:px-4 rounded-2xl liquid-glass-tile border border-slate-200/80 dark:border-white/15 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Total Trade Volume
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30">
                  Jul–Sep 2026
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-slate-900 dark:text-white">
                  2,420 t
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  cumulative
                </span>
              </div>

              <p className="mt-1 text-[10px] font-sans text-slate-500 dark:text-slate-400 truncate">
                September: 960 t surge · Maize 480 t (50%)
              </p>
            </div>

            {/* Tile 3: Volatility Alert */}
            <div className="min-w-[220px] lg:min-w-0 flex-1 snap-start p-3 px-3.5 sm:p-3.5 sm:px-4 rounded-2xl liquid-glass-tile border border-slate-200/80 dark:border-white/15 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Volatility Alert
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-amber-600 dark:text-amber-400">
                  12.4% CV
                </span>
                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  Beans
                </span>
              </div>

              <p className="mt-1 text-[10px] font-sans text-slate-500 dark:text-slate-400 truncate">
                90-day leader · Maize 6.8% · Sorghum 8.6%
              </p>
            </div>

            {/* Tile 4: Data Quality & Coverage */}
            <div className="min-w-[220px] lg:min-w-0 flex-1 snap-start p-3 px-3.5 sm:p-3.5 sm:px-4 rounded-2xl liquid-glass-tile border border-slate-200/80 dark:border-white/15 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Data Quality & Coverage
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-slate-900 dark:text-white">
                  12 / 13
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  (92.3%)
                </span>
              </div>

              <p className="mt-1 text-[10px] font-sans text-slate-500 dark:text-slate-400 truncate">
                17 Aug gap explicit · NFR 5 non-imputed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
