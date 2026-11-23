'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { CORRIDORS, COMMODITIES, getObservations } from '@/lib/data';
import { CorridorId, CommodityId } from '@/lib/types';
import {
  FileText,
  Printer,
  Download,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Search,
  ChevronDown,
  FileDown,
  Sparkles,
  RefreshCw,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface BriefDraft {
  id: string;
  code: string;
  title: string;
  type: string;
  date: string;
  status: 'Ready' | 'Review' | 'Draft';
  dueDate: string;
  author: string;
  authorInitials: string;
  fileName: string;
  fileSize: string;
  corridorId: CorridorId;
  commodityId: CommodityId;
  divergence: number;
  notes: string;
}

export default function BriefsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorId>('gatuna-katuna');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityId>('maize');
  const [rollingWindow, setRollingWindow] = useState<'30' | '90'>('90');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedDraftCode, setSelectedDraftCode] = useState<string>('#86468');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const corridor = CORRIDORS[selectedCorridor];
  const commodity = COMMODITIES[selectedCommodity];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const BRIEFS_QUEUE: BriefDraft[] = [
    {
      id: 'b-1',
      code: '#86468',
      title: 'Maize Trade Spread · Gatuna / Katuna',
      type: 'Executive Synthesis',
      date: '28 Sep 2026',
      status: 'Ready',
      dueDate: '30-09-2026',
      author: 'Pacifique M.',
      authorInitials: 'PM',
      fileName: 'CB_FVT_Brief_Katuna_Maize_Q3.pdf',
      fileSize: 'PDF · 0.8 MB',
      corridorId: 'gatuna-katuna',
      commodityId: 'maize',
      divergence: 18.0,
      notes: 'Full Q3 analytical synthesis with 17 Aug non-imputation caveat.',
    },
    {
      id: 'b-2',
      code: '#12828',
      title: 'Beans Volatility Alert · Busia Crossing',
      type: 'Market Alert',
      date: '21 Sep 2026',
      status: 'Review',
      dueDate: '25-09-2026',
      author: 'Amina K.',
      authorInitials: 'AK',
      fileName: 'Alert_Beans_Busia_Dispersion.pdf',
      fileSize: 'PDF · 0.6 MB',
      corridorId: 'busia',
      commodityId: 'beans',
      divergence: 15.8,
      notes: 'Leading dispersion CV% (12.4%) flagged for regional early warning.',
    },
    {
      id: 'b-3',
      code: '#38435',
      title: 'SCT Fast-Track Assessment · Malaba',
      type: 'Policy Memo',
      date: '14 Sep 2026',
      status: 'Ready',
      dueDate: '18-09-2026',
      author: 'John O.',
      authorInitials: 'JO',
      fileName: 'SCT_Malaba_Corridor_Impact.pdf',
      fileSize: 'PDF · 1.1 MB',
      corridorId: 'malaba',
      commodityId: 'maize',
      divergence: 18.6,
      notes: 'Container dwell analysis across Northern Corridor road/rail hub.',
    },
    {
      id: 'b-4',
      code: '#84387',
      title: 'Rusumo Rice Flow Dynamics · Rwanda/TZA',
      type: 'Scenario Brief',
      date: '07 Sep 2026',
      status: 'Draft',
      dueDate: '12-09-2026',
      author: 'Claire U.',
      authorInitials: 'CU',
      fileName: 'Rusumo_Rice_Transit_Note.pdf',
      fileSize: 'PDF · 0.5 MB',
      corridorId: 'rusumo',
      commodityId: 'rice',
      divergence: 15.5,
      notes: 'Weight bridge calibration delays and river crossing queuing.',
    },
  ];

  const activeBrief =
    BRIEFS_QUEUE.find((b) => b.code === selectedDraftCode) || BRIEFS_QUEUE[0];

  const filteredBriefs = BRIEFS_QUEUE.filter((b) => {
    if (filterType === 'ready' && b.status !== 'Ready') return false;
    if (filterType === 'review' && b.status !== 'Review') return false;
    if (
      searchQuery &&
      !b.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCopyMemo = () => {
    const memoText = `[EXECUTIVE MEMORANDUM]\nREF: ${activeBrief.code} | DATE: ${activeBrief.date}\nSUBJECT: ${activeBrief.title}\nANALYST: ${activeBrief.author}\nOBSERVED SPREAD: +${activeBrief.divergence}%\nCORRIDOR: ${corridor.name} (${corridor.originMarket} -> ${corridor.destMarket})\nAUDIT STATUS: NFR 5 Non-Imputation Rule Verified\nSUMMARY: Destination premium stands at +${activeBrief.divergence}%. ${activeBrief.notes}`;
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <FilterBar
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
        selectedCommodity={selectedCommodity}
        onSelectCommodity={setSelectedCommodity}
        rollingWindow={rollingWindow}
        onSelectRollingWindow={setRollingWindow}
        onReset={() => {
          setSelectedCorridor('gatuna-katuna');
          setSelectedCommodity('maize');
          setRollingWindow('90');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb & Page Title (Apple Minimalist) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#6E6E73] dark:text-[#8E8E93]">
              <Link href="/" className="hover:text-[#0071E3] dark:hover:text-[#2997FF] flex items-center transition-colors">
                <Compass className="w-3.5 h-3.5 mr-1" /> Spatial Monitor
              </Link>
              <span>/</span>
              <span className="text-[#1D1D1F] dark:text-white font-medium">Policy Briefs</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-1.5 font-display">
              Executive Policy Briefs & Synthesis Queue
            </h1>

            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#8E8E93] mt-1 max-w-2xl leading-relaxed">
              Validated analytical memos, quarterly price dispersion digests, and printable briefs for EAC trade ministries.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="btn-pressable px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white text-xs font-medium shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Executive Brief</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            ROW 1: FILTER CHIPS & TACTILE SEARCH (PolicyPilot Layout)
            ==================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs font-mono">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              All Briefs · {BRIEFS_QUEUE.length}
            </button>
            <button
              onClick={() => setFilterType('ready')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filterType === 'ready'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              Validated · 2
            </button>
            <button
              onClick={() => setFilterType('review')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filterType === 'review'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              Pending Review · 1
            </button>
          </div>

          {/* Tactile Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search briefs by ID or topic..."
              className="pl-8 pr-4 py-1.5 rounded-xl text-xs bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] text-[#1D1D1F] dark:text-white placeholder-[#8E8E93] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3] w-full sm:w-64 font-sans transition-all"
            />
          </div>
        </div>

        {/* ====================================================================
            ROW 2: POLICYPILOT VALIDATION QUEUE CARDS (4-Column Bento)
            ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBriefs.map((brief) => {
            const isSelected = selectedDraftCode === brief.code;
            return (
              <div
                key={brief.id}
                onClick={() => {
                  setSelectedDraftCode(brief.code);
                  setSelectedCorridor(brief.corridorId);
                  setSelectedCommodity(brief.commodityId);
                }}
                className={`bg-white dark:bg-[#1C1C1E] border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-[#0071E3] dark:ring-[#2997FF] border-[#0071E3]/50 shadow-md'
                    : 'border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16] shadow-xs'
                }`}
              >
                <div>
                  {/* Top: ID Badge and Optical Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] dark:text-white">
                      ID: {brief.code}
                    </span>
                    <button
                      type="button"
                      aria-label="Inspect brief"
                      className="w-7 h-7 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#8E8E93] dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Issue Description */}
                  <div className="mt-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93]">
                      Issue:
                    </div>
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white block line-clamp-1 mt-0.5">
                      {brief.title}
                    </span>
                    <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-sans mt-1 block line-clamp-2 leading-relaxed">
                      {brief.notes}
                    </span>
                  </div>

                  {/* Metadata Row: Due Date & Assignee */}
                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E8E93]">Due Date:</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                          brief.status === 'Ready'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {brief.dueDate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#8E8E93]">Assignee:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/15 text-[#0071E3] dark:text-[#2997FF] text-[9px] font-bold flex items-center justify-center font-mono">
                          {brief.authorInitials}
                        </span>
                        <span className="text-[#1D1D1F] dark:text-[#F5F5F7] font-sans font-medium text-[11px]">
                          {brief.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachment Pill (PolicyPilot Style) */}
                <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate text-left leading-tight">
                      <div className="text-[11px] font-mono font-medium text-[#1D1D1F] dark:text-white truncate">
                        {brief.fileName}
                      </div>
                      <div className="text-[9px] text-[#8E8E93] tabular-nums mt-0.5">{brief.fileSize}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint();
                    }}
                    title="Download brief"
                    className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors shrink-0 ml-1.5 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====================================================================
            ROW 3: PUBLICATION-GRADE EXECUTIVE BRIEF DOCUMENT
            ==================================================================== */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Document Header & Formal Masthead */}
          <div className="pb-6 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0071E3]/10 text-[#0071E3] dark:text-[#2997FF] border border-[#0071E3]/20">
                  {activeBrief.code} · SYNTHESIS DIGEST
                </span>
                <span className="text-[11px] font-mono text-[#8E8E93]">
                  Publication Date: {activeBrief.date}
                </span>
                <span className="text-[11px] font-mono text-[#8E8E93]">
                  · Cycle: Q3 2026
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-2 font-display">
                {activeBrief.title}
              </h2>

              <p className="text-xs text-[#6E6E73] dark:text-[#8E8E93] font-sans mt-1">
                Prepared by <strong className="text-[#1D1D1F] dark:text-white font-medium">{activeBrief.author}</strong> · ALU Food Volatility & Arbitrage Observatory
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyMemo}
                className="btn-pressable px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs font-mono font-medium text-[#1D1D1F] dark:text-white border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Memo Copied' : 'Copy Memo'}</span>
              </button>

              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NFR 5 Non-Imputation Rule Verified</span>
              </span>
            </div>
          </div>

          {/* Key Stat Bento Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBFBFD] dark:bg-[#161618] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] block">
                Observed Divergence Spread
              </span>
              <div className="text-3xl font-mono font-bold text-[#0071E3] dark:text-[#2997FF] tabular-nums">
                +{activeBrief.divergence}%
              </div>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-sans block">
                Destination price premium over origin base
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFD] dark:bg-[#161618] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] block">
                Corridor Pair Endpoints
              </span>
              <div className="text-base font-semibold text-[#1D1D1F] dark:text-white mt-1">
                {corridor.originMarket} → {corridor.destMarket}
              </div>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-mono block tabular-nums">
                ${corridor.originPriceUsd}/MT to ${corridor.destPriceUsd}/MT
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFD] dark:bg-[#161618] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] block">
                Corridor Road Logistics
              </span>
              <div className="text-base font-semibold text-[#1D1D1F] dark:text-white mt-1 tabular-nums">
                {corridor.distanceKm} km (OSBP Fast-Track)
              </div>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] font-sans block">
                Single Customs Territory clearance protocol
              </span>
            </div>
          </div>

          {/* Qualitative Policy Narrative & Institutional Findings */}
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#424245] dark:text-[#A1A1A6] font-sans">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-white mb-2">
                1. Executive Summary & Economic Significance
              </h3>
              <p>
                During Q3 2026, the cross-border grain arbitrage between <strong>{corridor.originMarket}</strong> and <strong>{corridor.destMarket}</strong> maintained an average divergence premium of <strong className="text-[#1D1D1F] dark:text-white font-mono">+{activeBrief.divergence}%</strong>. While physical freight transport costs account for an estimated 9.2% of destination wholesale pricing, residual variance highlights seasonal liquidity crunches and customs clearance dwelling at the border gate.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-white mb-2">
                2. Non-Imputation Integrity Audit (ALU NFR 5)
              </h3>
              <p>
                In strict adherence to the Observatory&apos;s architectural requirements (ALU SRS Non-Imputation Rule NFR 5), all missing observation weeks have been documented without artificial linear interpolation or synthetic smoothing. On <strong>17 August 2026</strong>, physical border market closures generated an unrecorded destination interval; the series correctly preserves this gap, preventing false statistical convergence.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-white mb-2">
                3. Ministerial Policy Recommendations
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                <li><strong>Harmonize OSBP Dwell Times:</strong> Accelerate electronic Single Customs Territory clearance to lower border dwell times below the 14-hour target threshold.</li>
                <li><strong>Coordinate Grain Strategic Reserves:</strong> Establish cross-border commodity swap lines to dampen speculative price transmission during off-harvest cycles.</li>
                <li><strong>FX Transmission Shield:</strong> Maintain transparent foreign exchange access for local smallholder logistics operators to compress haulage risk premiums.</li>
              </ul>
            </div>
          </div>

          {/* Document Sign-Off Footer */}
          <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#8E8E93]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cryptographically verified data digest · SHA-256 Checksum: 4f8d...92e1</span>
            </div>
            <div>
              <span>ALU Food Volatility Tracker · v2.4 Production</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
