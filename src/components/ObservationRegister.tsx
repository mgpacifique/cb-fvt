'use client';

import React from 'react';
import { PriceObservation } from '../lib/types';
import { FileSpreadsheet, FileJson, Printer, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ObservationRegisterProps {
  observations: PriceObservation[];
  corridorName: string;
  commodityName: string;
  originMarket: string;
  destMarket: string;
  onPrintBrief: () => void;
}

export const ObservationRegister: React.FC<ObservationRegisterProps> = ({
  observations,
  corridorName,
  commodityName,
  originMarket,
  destMarket,
  onPrintBrief,
}) => {
  // Sort newest first
  const sortedObs = [...observations].reverse();

  // Handle real CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Publication Date',
      `Origin (${originMarket}) USD/MT`,
      `Destination (${destMarket}) USD/MT`,
      'Divergence Pct',
      'Volume Tons',
      'Data Quality Status',
      'Attribution',
    ];

    const rows = sortedObs.map((obs) => [
      obs.displayDate,
      obs.originPriceUsdPerMt ?? '',
      obs.destPriceUsdPerMt ?? '',
      obs.divergencePct !== null ? `${obs.divergencePct}%` : '',
      obs.volumeTons ?? '',
      obs.status === 'missed' ? 'Missed Data' : 'Available',
      'Source: FEWS NET/WFP via CB-FVT',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CB-FVT_${corridorName.replace(/[^a-zA-Z0-9]/g, '_')}_${commodityName}_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle real JSON Export
  const handleExportJson = () => {
    const exportPayload = {
      metadata: {
        system: 'Cross-Border Informal Food Flows & Price Volatility Tracker (CB-FVT)',
        version: 'Release 1.0',
        corridor: corridorName,
        commodity: commodityName,
        currency: 'USD',
        unit: 'Metric Ton (MT)',
        attribution: 'Source: FEWS NET/WFP via CB-FVT',
        exportedAt: new Date().toISOString(),
      },
      records: sortedObs.map((obs) => ({
        date: obs.date,
        displayDate: obs.displayDate,
        originMarket,
        originPriceUsdPerMt: obs.originPriceUsdPerMt,
        destMarket,
        destPriceUsdPerMt: obs.destPriceUsdPerMt,
        divergencePct: obs.divergencePct,
        volumeTons: obs.volumeTons,
        quality: obs.status,
      })),
    };

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `CB-FVT_${corridorName.replace(/[^a-zA-Z0-9]/g, '_')}_${commodityName}_2026.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="register" className="p-5 sm:p-6 rounded-3xl liquid-glass-inner border border-slate-200/60 dark:border-white/10 transition-all duration-200">
      {/* Header and Export Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/40 dark:border-white/10 gap-3">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Observation Register
          </span>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Weekly Paired Records ({originMarket} → {destMarket})
          </h2>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={handleExportCsv}
            className="btn-pressable inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15"
            title="Download CSV dataset"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
            CSV
          </button>

          <button
            onClick={handleExportJson}
            className="btn-pressable inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15"
            title="Download JSON payload"
          >
            <FileJson className="w-3.5 h-3.5 mr-1.5 text-cyan-600 dark:text-cyan-400" />
            JSON
          </button>

          <button
            onClick={onPrintBrief}
            className="btn-pressable inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-medium bg-teal-600 text-white hover:bg-teal-500 shadow-sm"
            title="Print-ready Executive Brief"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Brief
          </button>
        </div>
      </div>

      {/* Table Component */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-white/10 text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">{originMarket} (Origin)</th>
              <th className="py-2.5 px-3">{destMarket} (Dest)</th>
              <th className="py-2.5 px-3">Spread %</th>
              <th className="py-2.5 px-3">Volume</th>
              <th className="py-2.5 px-3 text-right">Data Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 dark:divide-white/5 font-mono">
            {sortedObs.map((obs) => {
              const isMissed = obs.status === 'missed';
              return (
                <tr
                  key={obs.id}
                  className={`hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors ${
                    isMissed ? 'bg-amber-500/10 dark:bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {obs.displayDate}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    ${obs.originPriceUsdPerMt}/t
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {isMissed ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      `$${obs.destPriceUsdPerMt}/t`
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {isMissed ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        +{obs.divergencePct}%
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {obs.volumeTons} t
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {isMissed ? (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold">
                        <AlertCircle className="w-2.5 h-2.5 mr-1" />
                        Missed Data
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Attribution */}
      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span>Attribution: FEWS NET/WFP via CB-FVT · {sortedObs.length} weekly records</span>
        <span>Strict Non-Imputation (Nulls Preserved)</span>
      </div>
    </div>
  );
};
