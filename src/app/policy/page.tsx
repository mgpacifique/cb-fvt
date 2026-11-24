'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { CORRIDORS, COMMODITIES, getObservations } from '@/lib/data';
import { CorridorId, CommodityId } from '@/lib/types';
import { PolicyShockSimulator } from '@/components/PolicyShockSimulator';
import { POLICY_SCENARIOS, runPolicySimulation } from '@/lib/simulation/engine';
import {
  Compass,
  Sliders,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Scale,
} from 'lucide-react';

export default function PolicySimulatorPage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorId>('gatuna-katuna');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityId>('maize');

  const corridor = CORRIDORS[selectedCorridor];
  const commodity = COMMODITIES[selectedCommodity];
  const observations = getObservations(selectedCorridor, selectedCommodity);

  // Compute matrix comparison for all presets
  const scenarioMatrix = useMemo(() => {
    return POLICY_SCENARIOS.map((preset) => {
      const sim = runPolicySimulation(
        observations,
        corridor,
        commodity.name,
        selectedCommodity,
        preset.parameters
      );
      return {
        preset,
        sim,
      };
    });
  }, [observations, corridor, commodity.name, selectedCommodity]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Navigation Breadcrumb & Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#6E6E73] dark:text-[#8E8E93]">
              <Link href="/" className="hover:text-[#0071E3] dark:hover:text-[#2997FF] flex items-center transition-colors">
                <Compass className="w-3.5 h-3.5 mr-1" /> Spatial Workspace
              </Link>
              <span>/</span>
              <span>Policy Interventions</span>
              <span>/</span>
              <span className="text-[#1D1D1F] dark:text-white font-medium">What-If Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1.5 font-display">
              Policy Shock Simulator
            </h1>

            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#8E8E93] mt-1 max-w-2xl leading-relaxed">
              Model counterfactual border interventions, non-tariff barrier adjustments, and fuel surcharges.
              Evaluates trade facilitation welfare gains vs. protectionist friction under SRS Non-Imputation rules.
            </p>
          </div>

          {/* Quick Corridor & Commodity Selectors */}
          <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value as CorridorId)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[#1D1D1F] dark:text-white cursor-pointer"
            >
              {Object.values(CORRIDORS).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.crossBorderRoute})
                </option>
              ))}
            </select>

            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value as CommodityId)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0071E3] text-white border border-[#0071E3] cursor-pointer shadow-xs"
            >
              {(Object.keys(COMMODITIES) as CommodityId[]).map((cId) => (
                <option key={cId} value={cId}>
                  {COMMODITIES[cId].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Corridor Context Pill */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[#6E6E73] dark:text-[#8E8E93] text-[10px] uppercase block tracking-wider font-semibold">Corridor</span>
              <span className="font-semibold text-[#1D1D1F] dark:text-white">{corridor.name}</span>
            </div>
            <div>
              <span className="text-[#6E6E73] dark:text-[#8E8E93] text-[10px] uppercase block tracking-wider font-semibold">Origin Market</span>
              <span className="text-[#1D1D1F] dark:text-slate-300 tabular-nums">
                {corridor.originMarket} (${corridor.originPriceUsd}/t)
              </span>
            </div>
            <div>
              <span className="text-[#6E6E73] dark:text-[#8E8E93] text-[10px] uppercase block tracking-wider font-semibold">Destination Market</span>
              <span className="text-[#1D1D1F] dark:text-slate-300 tabular-nums">
                {corridor.destMarket} (${corridor.destPriceUsd}/t)
              </span>
            </div>
            <div>
              <span className="text-[#6E6E73] dark:text-[#8E8E93] text-[10px] uppercase block tracking-wider font-semibold">Baseline Divergence</span>
              <span className="font-bold text-[#0071E3] dark:text-[#2997FF] tabular-nums">
                +{corridor.currentDivergencePct}%
              </span>
            </div>
            <div>
              <span className="text-[#6E6E73] dark:text-[#8E8E93] text-[10px] uppercase block tracking-wider font-semibold">Distance</span>
              <span className="text-[#1D1D1F] dark:text-slate-300 tabular-nums">{corridor.distanceKm} km</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NFR 5 Non-Imputation Active</span>
            </span>
          </div>
        </div>

        {/* Main Interactive Policy Shock Simulator Component */}
        <PolicyShockSimulator
          observations={observations}
          corridor={corridor}
          commodityName={commodity.name}
          commodityId={selectedCommodity}
        />

        {/* 5-Scenario Comparison Matrix Table (PolicyPilot Style) */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0071E3] dark:text-[#2997FF]">
                  Scenario Matrix
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-[#0071E3] dark:text-[#2997FF] border border-blue-500/20">
                  5 Presets Active
                </span>
              </div>
              <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-white mt-0.5">
                Comparative Policy Shock Evaluation on {corridor.name}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-[#6E6E73] dark:text-[#8E8E93] text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-3 px-3">Policy Scenario</th>
                  <th className="py-3 px-3">Classification</th>
                  <th className="py-3 px-3">Simulated Spread</th>
                  <th className="py-3 px-3">Divergence Delta</th>
                  <th className="py-3 px-3">Dest Market Price</th>
                  <th className="py-3 px-3">Consumer Welfare</th>
                  <th className="py-3 px-3 text-right">Projected Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {scenarioMatrix.map(({ preset, sim }) => {
                  return (
                    <tr
                      key={preset.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#1D1D1F] dark:text-white">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5 line-clamp-1 max-w-prose">
                          {preset.impactSummary}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium uppercase ${
                            preset.category === 'facilitation'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : preset.category === 'friction'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : preset.category === 'disruption'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-slate-500/10 text-[#6E6E73] dark:text-[#8E8E93] border border-slate-500/20'
                          }`}
                        >
                          {preset.badge}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-semibold text-[#1D1D1F] dark:text-white tabular-nums">
                        +{sim.simulatedDivergence}%
                      </td>

                      <td className="py-3.5 px-3 font-mono tabular-nums">
                        <span
                          className={`font-semibold ${
                            sim.divergenceDelta < 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : sim.divergenceDelta > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-[#6E6E73]'
                          }`}
                        >
                          {sim.divergenceDelta >= 0 ? '+' : ''}{sim.divergenceDelta} pp
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono tabular-nums">
                        ${sim.simulatedDestPrice}/MT
                      </td>

                      <td className="py-3.5 px-3 font-mono tabular-nums">
                        <span
                          className={`font-semibold ${
                            sim.consumerWelfarePerMt >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {sim.consumerWelfarePerMt >= 0 ? `+$${sim.consumerWelfarePerMt}` : `-$${Math.abs(sim.consumerWelfarePerMt)}`}/MT
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-right tabular-nums">
                        {sim.projectedVolume} MT
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
