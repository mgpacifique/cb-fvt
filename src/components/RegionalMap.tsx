'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CorridorId } from '../lib/types';
import { CORRIDORS, REGIONAL_COUNTRY_PRICES } from '../lib/data';
import { Navigation, Layers, Map, Compass } from 'lucide-react';

// Dynamic import for Leaflet to ensure SSR safety
const RealLeafletMap = dynamic(
  () => import('./RealLeafletMap').then((mod) => mod.RealLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span>Loading East Africa Geographic Map...</span>
        </div>
      </div>
    ),
  }
);

interface RegionalMapProps {
  selectedCorridor: CorridorId;
  onSelectCorridor: (c: CorridorId) => void;
  commodityName: string;
  darkMode?: boolean;
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  selectedCorridor,
  onSelectCorridor,
  commodityName,
  darkMode = true,
}) => {
  const [mapMode, setMapMode] = useState<'real' | 'schematic'>('real');
  const corridor = CORRIDORS[selectedCorridor];

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm transition-all duration-200">
      {/* Section Header with Map Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800/80 gap-3">
        <div>
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            A Regional View. A Local Signal.
          </div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Corridor Geography & Real Spatial Distribution
          </h2>
        </div>

        {/* Real Map / Schematic Toggle Controls */}
        <div className="flex items-center space-x-3">
          <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80">
            <button
              onClick={() => setMapMode('real')}
              className={`btn-pressable inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-160 ${
                mapMode === 'real'
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 mr-1.5" />
              Real Map (GPS)
            </button>
            <button
              onClick={() => setMapMode('schematic')}
              className={`btn-pressable inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-160 ${
                mapMode === 'schematic'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Schematic
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas Area */}
        <div className="lg:col-span-7">
          {mapMode === 'real' ? (
            <RealLeafletMap
              selectedCorridor={selectedCorridor}
              onSelectCorridor={onSelectCorridor}
              commodityName={commodityName}
              darkMode={darkMode}
            />
          ) : (
            /* Schematic SVG Fallback View */
            <div className="bg-neutral-50 dark:bg-neutral-950/70 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 p-4 relative overflow-hidden">
              <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-2">
                <span>SCHEMATIC PROJECTION</span>
                <div className="flex items-center space-x-3 text-[10px]">
                  <span className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded mr-1"></span> &lt;300 $/t</span>
                  <span className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded mr-1"></span> 301–350</span>
                  <span className="flex items-center"><span className="w-2 h-2 bg-rose-500 rounded mr-1"></span> &gt;350</span>
                </div>
              </div>

              <svg viewBox="0 0 600 380" className="w-full h-auto select-none">
                <path d="M 20 60 L 160 40 L 180 200 L 120 340 L 30 320 Z" fill="currentColor" className="text-neutral-100 dark:text-neutral-900/60 stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
                <path d="M 160 40 L 360 30 L 390 170 L 270 200 L 180 200 Z" fill="currentColor" className="text-neutral-100 dark:text-neutral-900/60 stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
                <path d="M 180 200 L 270 200 L 280 280 L 190 280 Z" fill="currentColor" className="text-neutral-200/70 dark:text-neutral-900/90 stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" />
                <path d="M 360 30 L 560 60 L 540 260 L 390 230 L 390 170 Z" fill="currentColor" className="text-neutral-100 dark:text-neutral-900/60 stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
                <path d="M 190 280 L 280 280 L 390 230 L 540 260 L 520 360 L 210 360 Z" fill="currentColor" className="text-neutral-100 dark:text-neutral-900/60 stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />

                {/* Corridor Vectors */}
                <g onClick={() => onSelectCorridor('gatuna-katuna')} className="cursor-pointer">
                  <line x1="240" y1="170" x2="225" y2="220" stroke={selectedCorridor === 'gatuna-katuna' ? '#0D9488' : '#94A3B8'} strokeWidth={selectedCorridor === 'gatuna-katuna' ? '4' : '2'} strokeDasharray={selectedCorridor === 'gatuna-katuna' ? 'none' : '4 3'} />
                  <circle cx="240" cy="170" r={selectedCorridor === 'gatuna-katuna' ? '6' : '4'} className={selectedCorridor === 'gatuna-katuna' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <circle cx="225" cy="220" r={selectedCorridor === 'gatuna-katuna' ? '6' : '4'} className={selectedCorridor === 'gatuna-katuna' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <text x="215" y="190" className="text-[10px] font-mono font-bold fill-teal-600">Gatuna/Katuna</text>
                </g>

                <g onClick={() => onSelectCorridor('rusumo')} className="cursor-pointer">
                  <line x1="310" y1="300" x2="275" y2="260" stroke={selectedCorridor === 'rusumo' ? '#0D9488' : '#94A3B8'} strokeWidth={selectedCorridor === 'rusumo' ? '4' : '2'} strokeDasharray={selectedCorridor === 'rusumo' ? 'none' : '4 3'} />
                  <circle cx="310" cy="300" r="4" className={selectedCorridor === 'rusumo' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <circle cx="275" cy="260" r="4" className={selectedCorridor === 'rusumo' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <text x="300" y="275" className="text-[10px] font-mono fill-teal-600">Rusumo</text>
                </g>

                <g onClick={() => onSelectCorridor('busia')} className="cursor-pointer">
                  <line x1="375" y1="150" x2="410" y2="160" stroke={selectedCorridor === 'busia' ? '#0D9488' : '#94A3B8'} strokeWidth={selectedCorridor === 'busia' ? '4' : '2'} strokeDasharray={selectedCorridor === 'busia' ? 'none' : '4 3'} />
                  <circle cx="375" cy="150" r="4" className={selectedCorridor === 'busia' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <circle cx="410" cy="160" r="4" className={selectedCorridor === 'busia' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <text x="380" y="178" className="text-[10px] font-mono fill-teal-600">Busia</text>
                </g>

                <g onClick={() => onSelectCorridor('malaba')} className="cursor-pointer">
                  <line x1="375" y1="145" x2="430" y2="140" stroke={selectedCorridor === 'malaba' ? '#0D9488' : '#94A3B8'} strokeWidth={selectedCorridor === 'malaba' ? '4' : '2'} strokeDasharray={selectedCorridor === 'malaba' ? 'none' : '4 3'} />
                  <circle cx="375" cy="145" r="4" className={selectedCorridor === 'malaba' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <circle cx="430" cy="140" r="4" className={selectedCorridor === 'malaba' ? 'fill-teal-600' : 'fill-neutral-400'} />
                  <text x="390" y="130" className="text-[10px] font-mono fill-teal-600">Malaba</text>
                </g>
              </svg>
            </div>
          )}
        </div>

        {/* Selected Corridor Insight Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Selected Corridor
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  corridor.dataCompleteness === 'Complete'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}
              >
                {corridor.dataCompleteness} ({corridor.seriesCount.available}/{corridor.seriesCount.total})
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {corridor.name}
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                {corridor.crossBorderRoute} · ~{corridor.distanceKm} km transit span
              </p>
            </div>

            {/* Paired Price Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <div className="p-2.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[10px] font-mono text-neutral-400">
                  Origin ({corridor.originMarket})
                </div>
                <div className="text-sm sm:text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                  ${corridor.originPriceUsd}
                </div>
                <div className="text-[9px] text-neutral-400">USD / MT</div>
              </div>

              <div className="p-2.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[10px] font-mono text-neutral-400">
                  Dest ({corridor.destMarket})
                </div>
                <div className="text-sm sm:text-base font-mono font-bold text-teal-700 dark:text-teal-400">
                  ${corridor.destPriceUsd}
                </div>
                <div className="text-[9px] text-neutral-400">USD / MT</div>
              </div>

              <div className="p-2.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[10px] font-mono text-neutral-400">Divergence</div>
                <div className="text-sm sm:text-base font-mono font-bold text-amber-600 dark:text-amber-400">
                  +{corridor.currentDivergencePct}%
                </div>
                <div className="text-[9px] text-neutral-400">premium</div>
              </div>
            </div>

            {/* Publication and Missing Data Note */}
            <div className="text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/60 p-2.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                28 Sep 2026:
              </span>{' '}
              Latest paired observation. {corridor.id === 'gatuna-katuna' && 'One destination observation missing on 17 Aug.'}
            </div>

            {/* Transport & Border Friction */}
            <div className="space-y-1">
              <div className="flex items-center text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
                <Navigation className="w-3 h-3 mr-1 text-neutral-400" />
                Transport & Border Friction
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {corridor.frictionNote}
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
            Real GPS coordinate projection · Esri Canvas & OpenStreetMap · Updated weekly
          </div>
        </div>
      </div>
    </div>
  );
};
