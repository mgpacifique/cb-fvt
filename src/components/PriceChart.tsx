'use client';

import React, { useState } from 'react';
import { PriceObservation, PolicyEvent } from '../lib/types';
import { AlertCircle, Flag, Info } from 'lucide-react';

interface PriceChartProps {
  observations: PriceObservation[];
  rollingWindow: '30' | '90';
  onSelectPolicyEvent: (event: PolicyEvent) => void;
  corridorName: string;
  originMarket: string;
  destMarket: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  observations,
  rollingWindow,
  onSelectPolicyEvent,
  corridorName,
  originMarket,
  destMarket,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  // Layout parameters for SVG coordinates
  const svgWidth = 720;
  const svgHeight = 200;
  const paddingLeft = 44;
  const paddingRight = 44;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Scales
  const minPrice = 240;
  const maxPrice = 380;
  const minDiv = 0;
  const maxDiv = 30;

  const getX = (index: number) => {
    return paddingLeft + (index / (observations.length - 1)) * chartWidth;
  };

  const getYPrice = (price: number | null) => {
    if (price === null) return null;
    const clamped = Math.max(minPrice, Math.min(maxPrice, price));
    return paddingTop + chartHeight - ((clamped - minPrice) / (maxPrice - minPrice)) * chartHeight;
  };

  const getYDiv = (div: number | null) => {
    if (div === null) return null;
    const clamped = Math.max(minDiv, Math.min(maxDiv, div));
    return paddingTop + chartHeight - ((clamped - minDiv) / (maxDiv - minDiv)) * chartHeight;
  };

  // Build segmented paths to handle missing data without artificial interpolation
  const buildPath = (values: (number | null)[], isDiv = false) => {
    let path = '';
    let inSegment = false;

    values.forEach((val, i) => {
      const y = isDiv ? getYDiv(val) : getYPrice(val);
      if (y !== null) {
        const x = getX(i);
        if (!inSegment) {
          path += `M ${x.toFixed(1)} ${y.toFixed(1)} `;
          inSegment = true;
        } else {
          path += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
        }
      } else {
        inSegment = false;
      }
    });

    return path;
  };

  const originPath = buildPath(observations.map((o) => o.originPriceUsdPerMt));
  const destPath = buildPath(observations.map((o) => o.destPriceUsdPerMt));
  const divPath = buildPath(observations.map((o) => o.divergencePct), true);
  const rollingPath = buildPath(
    observations.map((o) =>
      rollingWindow === '30' ? o.rolling30UsdPerMt : o.rolling90UsdPerMt
    )
  );

  const activeObs = hoveredIndex !== null ? observations[hoveredIndex] : observations[observations.length - 1];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass-inner border border-slate-200/60 dark:border-white/10 transition-all duration-200">
      {/* Header with Clean Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200/40 dark:border-white/10 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Prices & Divergence Dynamics
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              1 missed observation
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Paired Time-Series (01 Jul … 30 Sep 2026)
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {originMarket}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {destMarket}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 border-t-2 border-dashed border-amber-500" />
            <span className="text-amber-700 dark:text-amber-400 font-medium">
              Divergence %
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 border-t-2 border-slate-400 dark:border-slate-600" />
            <span className="text-slate-400 dark:text-slate-500">
              {rollingWindow}D Rolling
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area: Clean without heavy background gridlines */}
      <div className="mt-4 relative select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Subtle baseline axis lines only */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="1"
          />

          {/* Left Axis Ticks (Price in USD) */}
          {[260, 300, 340, 380].map((p) => {
            const y = getYPrice(p)!;
            return (
              <g key={`tick-price-${p}`}>
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  ${p}
                </text>
              </g>
            );
          })}

          {/* Right Axis Ticks (Divergence %) */}
          {[0, 10, 20, 30].map((d) => {
            const y = getYDiv(d)!;
            return (
              <text
                key={`tick-div-${d}`}
                x={svgWidth - paddingRight + 8}
                y={y + 3}
                textAnchor="start"
                className="text-[10px] font-mono fill-amber-600/90 dark:fill-amber-400/90"
              >
                {d}%
              </text>
            );
          })}

          {/* Y Axis Header Labels */}
          <text
            x={paddingLeft - 8}
            y={paddingTop - 10}
            textAnchor="end"
            className="text-[9px] font-mono font-medium fill-slate-400 uppercase"
          >
            USD/t
          </text>
          <text
            x={svgWidth - paddingRight + 8}
            y={paddingTop - 10}
            textAnchor="start"
            className="text-[9px] font-mono font-medium fill-amber-600 dark:fill-amber-400 uppercase"
          >
            Spread %
          </text>

          {/* Rolling Average Line */}
          <path
            d={rollingPath}
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Divergence % Line (Dashed Amber) */}
          <path
            d={divPath}
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* Origin Line (Cyan) */}
          <path
            d={originPath}
            fill="none"
            stroke="#0891B2"
            strokeWidth="2.5"
          />

          {/* Destination Line (Emerald) */}
          <path
            d={destPath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
          />

          {/* Data Points, 12 Aug P1 Clearance Pilot & 17 Aug Missing Data Flag */}
          {observations.map((obs, i) => {
            const x = getX(i);
            const yOrigin = getYPrice(obs.originPriceUsdPerMt);
            const yDest = getYPrice(obs.destPriceUsdPerMt);
            const yDiv = getYDiv(obs.divergencePct);
            const isHovered = hoveredIndex === i;

            return (
              <g key={`data-pt-${obs.date}`}>
                {/* 12 Aug P1 Clearance Pilot Vertical Event Marker */}
                {obs.policyEvent && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => onSelectPolicyEvent(obs.policyEvent!)}
                  >
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <rect
                      x={x - 42}
                      y={paddingTop - 18}
                      width="84"
                      height="16"
                      rx="8"
                      fill="#059669"
                      className="transition-transform group-hover:scale-105"
                    />
                    <text
                      x={x}
                      y={paddingTop - 6}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-white"
                    >
                      12 Aug P1 Pilot
                    </text>
                  </g>
                )}

                {/* Origin Points (Cyan) */}
                {yOrigin !== null && (
                  <circle
                    cx={x}
                    cy={yOrigin}
                    r={isHovered ? 5 : 3}
                    fill="#0891B2"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                )}

                {/* Destination Points (Emerald) */}
                {yDest !== null && (
                  <circle
                    cx={x}
                    cy={yDest}
                    r={isHovered ? 5 : 3}
                    fill="#059669"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                )}

                {/* Divergence Point (Amber Diamond) */}
                {yDiv !== null && (
                  <rect
                    x={x - 2.5}
                    y={yDiv - 2.5}
                    width="5"
                    height="5"
                    transform={`rotate(45 ${x} ${yDiv})`}
                    fill="#D97706"
                  />
                )}

                {/* 17 Aug Explicit Missed Data Amber Indicator (No Synthetic Imputation) */}
                {obs.status === 'missed' && (
                  <g>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="#D97706"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                    <rect
                      x={x - 38}
                      y={svgHeight / 2 - 10}
                      width="76"
                      height="20"
                      rx="10"
                      className="fill-amber-500/20 stroke-amber-500/40"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={svgHeight / 2 + 3}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-amber-700 dark:fill-amber-300"
                    >
                      17 Aug Missed
                    </text>
                  </g>
                )}

                {/* Interactive Click/Scrub Hitbox */}
                <rect
                  x={x - 15}
                  y={paddingTop}
                  width="30"
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X Axis Date Labels */}
                {(i === 0 || i === 6 || i === observations.length - 1 || obs.policyEvent) && (
                  <text
                    x={x}
                    y={svgHeight - paddingBottom + 16}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-500"
                  >
                    {obs.displayDate.slice(0, 6)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Scrub Card (Emil Kowalski Tactile Instant Feedback) */}
        {activeObs && (
          <div className="mt-3 p-3 rounded-2xl bg-white/70 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {activeObs.displayDate}:
              </span>
              {activeObs.status === 'missed' ? (
                <span className="text-amber-700 dark:text-amber-400 font-mono font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>17 Aug destination series missed (Zero artificial imputation)</span>
                </span>
              ) : (
                <div className="flex items-center space-x-3 font-mono">
                  <span className="text-cyan-700 dark:text-cyan-400">
                    ${activeObs.originPriceUsdPerMt} USD/t (Origin)
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    ${activeObs.destPriceUsdPerMt} USD/t (Dest)
                  </span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">
                    +{activeObs.divergencePct}% spread
                  </span>
                </div>
              )}
            </div>

            {activeObs.policyEvent && (
              <button
                onClick={() => onSelectPolicyEvent(activeObs.policyEvent!)}
                className="btn-pressable inline-flex items-center text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
              >
                <Flag className="w-3 h-3 mr-1" />
                {activeObs.policyEvent.code}: {activeObs.policyEvent.title}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Discrete Bottom Bar with Info Popover instead of cluttered footnote */}
      <div className="mt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Source: WFP VAM & FEWS NET · 12/13 verified paired points</span>

        <div className="relative">
          <button
            onMouseEnter={() => setShowFormulaTooltip(true)}
            onMouseLeave={() => setShowFormulaTooltip(false)}
            onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Divergence Formula"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>

          {showFormulaTooltip && (
            <div className="absolute right-0 bottom-full mb-1.5 w-64 p-2.5 rounded-xl liquid-glass text-[10px] font-mono text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/15 shadow-xl popover-enter z-20">
              <span className="font-semibold block text-teal-600 dark:text-teal-400 mb-0.5">Divergence Formula</span>
              <code className="text-slate-900 dark:text-white font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">
                ((P_dest - P_orig) / P_orig) × 100
              </code>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Measures spatial trade friction and destination premium across the crossing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
