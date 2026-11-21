'use client';

import React, { useState } from 'react';
import { PriceObservation, PolicyEvent, CorridorMetadata, CommodityId } from '@/lib/types';
import { CORRIDORS } from '@/lib/data';
import { PriceChart } from './PriceChart';
import { VolumeChart } from './VolumeChart';
import { ObservationRegister } from './ObservationRegister';
import { PolicyShockSimulator } from './PolicyShockSimulator';
import {
  LineChart,
  BarChart3,
  TableProperties,
  Sliders,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface FloatingAnalyticsDrawerProps {
  observations: PriceObservation[];
  rollingWindow: '30' | '90';
  onSelectPolicyEvent: (event: PolicyEvent) => void;
  corridorName: string;
  commodityName: string;
  originMarket: string;
  destMarket: string;
  onPrintBrief: () => void;
  corridor?: CorridorMetadata;
  commodityId?: CommodityId;
}

type MobileSnapPoint = 'collapsed' | 'half' | 'expanded';

export const FloatingAnalyticsDrawer: React.FC<FloatingAnalyticsDrawerProps> = ({
  observations,
  rollingWindow,
  onSelectPolicyEvent,
  corridorName,
  commodityName,
  originMarket,
  destMarket,
  onPrintBrief,
  corridor,
  commodityId,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'prices' | 'volume' | 'table' | 'simulator'>('prices');
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const [mobileSnap, setMobileSnap] = useState<MobileSnapPoint>('half');

  const activeCorridor: CorridorMetadata = corridor || CORRIDORS['gatuna-katuna'];
  const activeCommodityId: CommodityId = commodityId || 'maize';

  const latestObs = observations[observations.length - 1];
  const originPrice = latestObs?.originPriceUsdPerMt ?? 300;
  const destPrice = latestObs?.destPriceUsdPerMt ?? 354;

  const cycleMobileSnap = () => {
    if (mobileSnap === 'collapsed') setMobileSnap('half');
    else if (mobileSnap === 'half') setMobileSnap('expanded');
    else setMobileSnap('collapsed');
  };

  return (
    <>
      {/* ====================================================================
          MOBILE DISPLAY (< 768px): Native-feeling Bottom Sheet with 3 Snap Points
          ==================================================================== */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 liquid-glass rounded-t-3xl border-t border-x border-slate-200/80 dark:border-white/20 shadow-2xl transition-all duration-300 ease-emil-out flex flex-col pointer-events-auto ${
          mobileSnap === 'collapsed'
            ? 'h-[80px]'
            : mobileSnap === 'half'
            ? 'h-[44vh]'
            : 'h-[85vh]'
        }`}
      >
        {/* Touch Grab Handle Pill (Tap to cycle: Collapsed ➔ Half ➔ Expanded) */}
        <div
          onClick={cycleMobileSnap}
          className="w-full pt-2.5 pb-2 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 active:scale-95 transition-all" />
        </div>

        {/* Headline Strip (Always Visible in Collapsed Mode) */}
        <div className="px-4 pb-2 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {originMarket} ${originPrice} → {destMarket} ${destPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-amber-500">
              +{latestObs?.divergencePct ?? '18.0'}%
            </span>
            <button
              onClick={cycleMobileSnap}
              className="p-1 text-slate-400 hover:text-white text-xs font-mono"
            >
              {mobileSnap === 'collapsed' ? '▲' : mobileSnap === 'half' ? '⇕' : '▼'}
            </button>
          </div>
        </div>

        {/* Expanded / Half Content Area */}
        {mobileSnap !== 'collapsed' && (
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Segmented Pill Tabs */}
            <div className="px-4 py-1.5 border-b border-white/10 flex justify-center">
              <div className="inline-flex p-1 rounded-full bg-slate-200/70 dark:bg-black/40 border border-slate-300/60 dark:border-white/10 text-xs font-mono w-full justify-between">
                <button
                  onClick={() => setActiveTab('prices')}
                  className={`flex-1 py-1.5 rounded-full btn-pressable flex items-center justify-center gap-1 min-h-[38px] ${
                    activeTab === 'prices'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Prices</span>
                </button>

                <button
                  onClick={() => setActiveTab('volume')}
                  className={`flex-1 py-1.5 rounded-full btn-pressable flex items-center justify-center gap-1 min-h-[38px] ${
                    activeTab === 'volume'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Volume</span>
                </button>

                <button
                  onClick={() => setActiveTab('table')}
                  className={`flex-1 py-1.5 rounded-full btn-pressable flex items-center justify-center gap-1 min-h-[38px] ${
                    activeTab === 'table'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>

                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`flex-1 py-1.5 rounded-full btn-pressable flex items-center justify-center gap-1 min-h-[38px] ${
                    activeTab === 'simulator'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Sim</span>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto custom-glass-scroll p-3 space-y-3">
              {activeTab === 'prices' && (
                <PriceChart
                  observations={observations}
                  rollingWindow={rollingWindow}
                  onSelectPolicyEvent={onSelectPolicyEvent}
                  corridorName={corridorName}
                  originMarket={originMarket}
                  destMarket={destMarket}
                />
              )}
              {activeTab === 'volume' && <VolumeChart />}
              {activeTab === 'table' && (
                <ObservationRegister
                  observations={observations}
                  corridorName={corridorName}
                  commodityName={commodityName}
                  originMarket={originMarket}
                  destMarket={destMarket}
                  onPrintBrief={onPrintBrief}
                />
              )}
              {activeTab === 'simulator' && (
                <PolicyShockSimulator
                  observations={observations}
                  corridor={activeCorridor}
                  commodityName={commodityName}
                  commodityId={activeCommodityId}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          TABLET & DESKTOP DISPLAY (>= 768px): Floating Expandable Bento Drawer
          - Redesigned for 1440px displays: compact width and balanced height
          ==================================================================== */}
      <div className="hidden md:block fixed bottom-4 left-3 sm:left-6 z-30 pointer-events-none max-w-[calc(100vw-1.5rem)]">
        {/* Collapsed Pill Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto btn-pressable px-4 py-2 rounded-full liquid-glass text-xs font-mono text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/20 shadow-2xl flex items-center gap-2.5 hover:border-teal-500/50 transition-all min-h-[40px]"
          >
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="font-semibold">Analytics Drawer</span>
            <span className="text-teal-700 dark:text-teal-300 font-bold">(+18.0% Spread · 2,420 t)</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400 ml-1" />
          </button>
        )}

        {/* Expanded VisionOS Liquid Glass Analytics Bento */}
        {isOpen && (
          <div
            className={`pointer-events-auto liquid-glass rounded-3xl border border-slate-200/80 dark:border-white/20 shadow-2xl flex flex-col transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              isExpandedFull
                ? 'w-[94vw] max-w-5xl h-[80vh]'
                : 'w-[92vw] sm:w-[580px] md:w-[620px] lg:w-[640px] xl:w-[660px] 2xl:w-[740px] max-h-[44vh] xl:max-h-[46vh]'
            }`}
          >
            {/* Bento Header - Compact & Clean */}
            <div className="px-4 py-2 sm:px-4.5 sm:py-2.5 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 min-h-[44px]">
              {/* Title & Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                    {corridorName}
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 font-medium">
                    {commodityName} ({originMarket} → {destMarket})
                  </span>
                </div>
              </div>

              {/* Segmented Pill Control */}
              <div className="inline-flex p-0.5 rounded-full bg-slate-200/70 dark:bg-black/40 border border-slate-300/60 dark:border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('prices')}
                  className={`px-2.5 py-1 rounded-full btn-pressable flex items-center gap-1.5 transition-all min-h-[32px] ${
                    activeTab === 'prices'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prices</span>
                </button>

                <button
                  onClick={() => setActiveTab('volume')}
                  className={`px-2.5 py-1 rounded-full btn-pressable flex items-center gap-1.5 transition-all min-h-[32px] ${
                    activeTab === 'volume'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Volume</span>
                </button>

                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-2.5 py-1 rounded-full btn-pressable flex items-center gap-1.5 transition-all min-h-[32px] ${
                    activeTab === 'table'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log</span>
                </button>

                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-2.5 py-1 rounded-full btn-pressable flex items-center gap-1.5 transition-all min-h-[32px] ${
                    activeTab === 'simulator'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Simulator</span>
                </button>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpandedFull(!isExpandedFull)}
                  className="btn-pressable p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
                  title={isExpandedFull ? 'Restore Proportional Size' : 'Maximize Analytics View'}
                >
                  {isExpandedFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-pressable p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
                  title="Collapse Analytics Drawer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bento Content Body with Custom Glass Scrollbar */}
            <div className="flex-1 overflow-y-auto custom-glass-scroll p-4 space-y-4">
              {activeTab === 'prices' && (
                <div className="animate-in fade-in duration-150">
                  <PriceChart
                    observations={observations}
                    rollingWindow={rollingWindow}
                    onSelectPolicyEvent={onSelectPolicyEvent}
                    corridorName={corridorName}
                    originMarket={originMarket}
                    destMarket={destMarket}
                  />
                </div>
              )}

              {activeTab === 'volume' && (
                <div className="animate-in fade-in duration-150">
                  <VolumeChart />
                </div>
              )}

              {activeTab === 'table' && (
                <div className="animate-in fade-in duration-150">
                  <ObservationRegister
                    observations={observations}
                    corridorName={corridorName}
                    commodityName={commodityName}
                    originMarket={originMarket}
                    destMarket={destMarket}
                    onPrintBrief={onPrintBrief}
                  />
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="animate-in fade-in duration-150">
                  <PolicyShockSimulator
                    observations={observations}
                    corridor={activeCorridor}
                    commodityName={commodityName}
                    commodityId={activeCommodityId}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
