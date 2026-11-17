'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, Route, Info } from 'lucide-react';
import { KPI_BENCHMARKS } from '../lib/data';

interface KpiCardsProps {
  currentDivergence: number | null;
  corridorName: string;
  commodityName: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  currentDivergence,
  corridorName,
  commodityName,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Max Price Divergence */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Max Price Divergence
            </span>
            <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {currentDivergence !== null ? `+${currentDivergence.toFixed(1)}%` : `+${KPI_BENCHMARKS.maxDivergencePct.toFixed(1)}%`}
            </span>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60">
              destination premium
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {commodityName} · {corridorName}
          </div>
          <div className="mt-1 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            Highest latest spread across 4 monitored corridors
          </div>
        </div>

        {/* KPI 2: Most Volatile Commodity */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Most Volatile Commodity
            </span>
            <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              {KPI_BENCHMARKS.mostVolatileCommodity}
            </span>
            <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
              {KPI_BENCHMARKS.volatilityCvPct}% CV
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {KPI_BENCHMARKS.volatilityCvPct}% coefficient of variation
          </div>
          <div className="mt-1 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            {KPI_BENCHMARKS.volatilityContext}
          </div>
        </div>

        {/* KPI 3: Monitored Corridors */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Monitored Corridors
            </span>
            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
              <Route className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              0{KPI_BENCHMARKS.totalMonitoredCorridors}
            </span>
            <span className="text-xs font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/60">
              Active Ingestion
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {KPI_BENCHMARKS.completeSeriesCount} complete · {KPI_BENCHMARKS.partialSeriesCount} partial series
          </div>
          <div className="mt-1 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            Gatuna, Rusumo, Busia, Malaba
          </div>
        </div>
      </div>

      {/* Audit Citation Subtext */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500 px-1 pt-1">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3 h-3 text-neutral-400" />
          <span>Source: CB-FVT demo v1 · KPI snapshot {KPI_BENCHMARKS.asOfTimestamp}</span>
        </div>
        <span className="hidden sm:inline">Paired spreads & 90-day commodity volatility</span>
      </div>
    </div>
  );
};

