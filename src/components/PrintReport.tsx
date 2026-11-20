'use client';

import React from 'react';
import { PriceObservation, CorridorMetadata } from '../lib/types';

interface PrintReportProps {
  corridor: CorridorMetadata;
  commodityName: string;
  observations: PriceObservation[];
  currentDivergence: number | null;
  onClosePrint: () => void;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  corridor,
  commodityName,
  observations,
  currentDivergence,
  onClosePrint,
}) => {
  return (
    <div className="print-only hidden print:block bg-white text-black p-8 max-w-4xl mx-auto font-sans">
      {/* Top Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-600">
            CB-FVT Executive Brief · Release 1.0
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black mt-1">
            Cross-Border Food Flows & Price Volatility Report
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Corridor: {corridor.name} ({corridor.crossBorderRoute}) · Commodity: {commodityName}
          </p>
        </div>
        <div className="text-right font-mono text-xs text-neutral-600">
          <div>Report Date: 28 Sep 2026</div>
          <div>Status: Analytical Snapshot</div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 border border-neutral-300 p-4 rounded">
        <div>
          <div className="text-xs uppercase font-mono text-neutral-500">Latest Divergence</div>
          <div className="text-2xl font-bold font-mono text-black">
            {currentDivergence !== null ? `+${currentDivergence.toFixed(1)}%` : '—'}
          </div>
          <div className="text-[11px] text-neutral-600">Destination Premium</div>
        </div>
        <div>
          <div className="text-xs uppercase font-mono text-neutral-500">Origin ({corridor.originMarket})</div>
          <div className="text-2xl font-bold font-mono text-black">${corridor.originPriceUsd}/t</div>
          <div className="text-[11px] text-neutral-600">USD per Metric Ton</div>
        </div>
        <div>
          <div className="text-xs uppercase font-mono text-neutral-500">Dest ({corridor.destMarket})</div>
          <div className="text-2xl font-bold font-mono text-black">${corridor.destPriceUsd}/t</div>
          <div className="text-[11px] text-neutral-600">USD per Metric Ton</div>
        </div>
      </div>

      {/* Qualitative Context & Friction Analysis */}
      <div className="mb-6 space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black font-mono">
          Corridor Transit & Policy Friction
        </h2>
        <p className="text-xs text-neutral-800 leading-relaxed">
          {corridor.frictionNote} Distance spans approximately {corridor.distanceKm} km. Observed spread reflects fuel, customs fast-track transit velocity, and local market supply disparities.
        </p>
      </div>

      {/* Observations Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black font-mono mb-2">
          Weekly Historical Price Register
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-black font-mono">
              <th className="py-1">Publication</th>
              <th className="py-1">{corridor.originMarket} ($/t)</th>
              <th className="py-1">{corridor.destMarket} ($/t)</th>
              <th className="py-1">Divergence</th>
              <th className="py-1">Volume (t)</th>
              <th className="py-1 text-right">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 font-mono">
            {[...observations].reverse().slice(0, 8).map((obs) => (
              <tr key={obs.id}>
                <td className="py-1">{obs.displayDate}</td>
                <td className="py-1">${obs.originPriceUsdPerMt}</td>
                <td className="py-1">{obs.destPriceUsdPerMt ? `$${obs.destPriceUsdPerMt}` : '—'}</td>
                <td className="py-1">{obs.divergencePct ? `+${obs.divergencePct}%` : '—'}</td>
                <td className="py-1">{obs.volumeTons} t</td>
                <td className="py-1 text-right">{obs.status === 'missed' ? 'Missed Data' : 'Available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Attribution */}
      <div className="border-t border-black pt-3 flex justify-between items-center text-[10px] font-mono text-neutral-600">
        <span>Source: FEWS NET/WFP via CB-FVT Release 1.0</span>
        <span>Specification: Manzi Gatabazi Pacifique · African Leadership University</span>
      </div>
    </div>
  );
};

