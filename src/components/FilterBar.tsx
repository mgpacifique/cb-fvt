'use client';

import React from 'react';
import { CorridorId, CommodityId } from '@/lib/types';
import { CORRIDORS, COMMODITIES } from '@/lib/data';
import { RotateCcw, MapPin, Wheat, Clock, Check } from 'lucide-react';

interface FilterBarProps {
  selectedCorridor: CorridorId;
  onSelectCorridor: (c: CorridorId) => void;
  selectedCommodity: CommodityId;
  onSelectCommodity: (comm: CommodityId) => void;
  rollingWindow: '30' | '90';
  onSelectRollingWindow: (w: '30' | '90') => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCorridor,
  onSelectCorridor,
  selectedCommodity,
  onSelectCommodity,
  rollingWindow,
  onSelectRollingWindow,
  onReset,
}) => {
  return (
    <div className="w-full bg-slate-100/60 dark:bg-white/5 border-b border-slate-200/60 dark:border-white/10 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Corridor Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold shrink-0 flex items-center gap-1 mr-1">
              <MapPin className="w-3 h-3 text-teal-500" />
              <span>Corridor</span>
            </span>
            <div className="inline-flex p-1 rounded-full bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10 shadow-xs shrink-0">
              {(Object.keys(CORRIDORS) as CorridorId[]).map((cId) => {
                const isSelected = selectedCorridor === cId;
                const c = CORRIDORS[cId];
                return (
                  <button
                    key={cId}
                    onClick={() => onSelectCorridor(cId)}
                    className={`btn-pressable px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-teal-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{c.name.split('/')[0].trim()}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commodity & Window Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Commodity Pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold shrink-0 flex items-center gap-1">
                <Wheat className="w-3 h-3 text-amber-500" />
                <span>Crop</span>
              </span>
              <div className="inline-flex p-1 rounded-full bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10 shadow-xs">
                {(Object.keys(COMMODITIES) as CommodityId[]).map((commId) => {
                  const isSelected = selectedCommodity === commId;
                  return (
                    <button
                      key={commId}
                      onClick={() => onSelectCommodity(commId)}
                      className={`btn-pressable px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      {COMMODITIES[commId].name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rolling Window Pill */}
            <div className="inline-flex p-1 rounded-full bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <button
                onClick={() => onSelectRollingWindow('30')}
                className={`btn-pressable px-2.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  rollingWindow === '30'
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                30D MA
              </button>
              <button
                onClick={() => onSelectRollingWindow('90')}
                className={`btn-pressable px-2.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  rollingWindow === '90'
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                90D MA
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="btn-pressable p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs transition-colors"
              title="Reset Filters to Default Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
