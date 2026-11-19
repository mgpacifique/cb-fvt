'use client';

import React, { useState } from 'react';
import { BIWEEKLY_VOLUMES } from '../lib/data';
import { BarChart3 } from 'lucide-react';

export const VolumeChart: React.FC = () => {
  const [activePeriodIndex, setActivePeriodIndex] = useState<number | null>(null);

  const maxTotal = 600; // headroom for max stacked value 500

  return (
    <div className="p-5 sm:p-6 rounded-3xl liquid-glass-inner border border-slate-200/60 dark:border-white/10 transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/40 dark:border-white/10 gap-3">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Informal Trade Volumes & Commodity Breakdown
          </span>
          <div className="flex items-baseline space-x-2.5 mt-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Fortnightly Corridor Tonnage
            </h2>
            <span className="text-sm font-mono font-bold text-teal-700 dark:text-teal-400">
              2,420 t
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              (01 Jul … 30 Sep 2026)
            </span>
          </div>
        </div>

        {/* Crop Color Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-600" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Maize</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-600" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Beans</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Rice</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-purple-600" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Sorghum</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart Visual */}
      <div className="mt-6">
        <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-4 px-2">
          {BIWEEKLY_VOLUMES.map((rec, i) => {
            const isHovered = activePeriodIndex === i;
            const maizeHeight = (rec.maize / maxTotal) * 100;
            const beansHeight = (rec.beans / maxTotal) * 100;
            const riceHeight = (rec.rice / maxTotal) * 100;
            const sorghumHeight = (rec.sorghum / maxTotal) * 100;

            return (
              <div
                key={rec.period}
                className="flex-1 flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setActivePeriodIndex(i)}
                onMouseLeave={() => setActivePeriodIndex(null)}
              >
                {/* Volume Stack Pill */}
                <div className="w-full max-w-[48px] flex flex-col-reverse rounded-t-lg overflow-hidden bg-slate-200/50 dark:bg-white/5 transition-all">
                  <div
                    style={{ height: `${maizeHeight}%` }}
                    className={`bg-teal-600 transition-opacity ${
                      isHovered ? 'opacity-100' : 'opacity-90'
                    }`}
                    title={`Maize: ${rec.maize} t`}
                  />
                  <div
                    style={{ height: `${beansHeight}%` }}
                    className={`bg-amber-600 transition-opacity ${
                      isHovered ? 'opacity-100' : 'opacity-90'
                    }`}
                    title={`Beans: ${rec.beans} t`}
                  />
                  <div
                    style={{ height: `${riceHeight}%` }}
                    className={`bg-indigo-600 transition-opacity ${
                      isHovered ? 'opacity-100' : 'opacity-90'
                    }`}
                    title={`Rice: ${rec.rice} t`}
                  />
                  <div
                    style={{ height: `${sorghumHeight}%` }}
                    className={`bg-purple-600 transition-opacity ${
                      isHovered ? 'opacity-100' : 'opacity-90'
                    }`}
                    title={`Sorghum: ${rec.sorghum} t`}
                  />
                </div>

                {/* Period Label */}
                <span className="mt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                  {rec.period}
                </span>

                {/* Total Tonnage Label */}
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {rec.total}t
                </span>
              </div>
            );
          })}
        </div>

        {/* Hover Breakdown Detail */}
        {activePeriodIndex !== null && (
          <div className="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="font-semibold text-slate-900 dark:text-white">
              {BIWEEKLY_VOLUMES[activePeriodIndex].period} Breakdown:
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-teal-700 dark:text-teal-400">
                Maize: {BIWEEKLY_VOLUMES[activePeriodIndex].maize} t
              </span>
              <span className="text-amber-700 dark:text-amber-400">
                Beans: {BIWEEKLY_VOLUMES[activePeriodIndex].beans} t
              </span>
              <span className="text-indigo-700 dark:text-indigo-400">
                Rice: {BIWEEKLY_VOLUMES[activePeriodIndex].rice} t
              </span>
              <span className="text-purple-700 dark:text-purple-400">
                Sorghum: {BIWEEKLY_VOLUMES[activePeriodIndex].sorghum} t
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Informal cross-border trade survey · Fortnightly sampling methodology</span>
        <span>Peak corridor flow: Sep B (500 t)</span>
      </div>
    </div>
  );
};
