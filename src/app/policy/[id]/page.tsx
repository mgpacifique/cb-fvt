'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { POLICY_EVENTS } from '@/lib/data';
import { ArrowLeft, Calendar, Flag, ShieldCheck, Printer, Download, AlertTriangle, Info } from 'lucide-react';

export default function PolicyDetailPage() {
  const params = useParams();
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const eventCode = (params?.id as string)?.toUpperCase() || 'P1';
  const event = POLICY_EVENTS.find((e) => e.code.toUpperCase() === eventCode) || POLICY_EVENTS[0];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `CB-FVT_PolicyEvent_${event.code}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to monitor
          </Link>
          <span>/</span>
          <span>Policy context</span>
          <span>/</span>
          <span className="text-teal-700 dark:text-teal-400 font-bold">{event.code}</span>
        </div>

        {/* Event Header Banner */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
              {event.code} · SELECTED EVENT
            </span>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              Hypothetical Scenario
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {event.title}
          </h1>

          <p className="text-xs text-neutral-500 font-mono">
            Corridor: Gatuna / Katuna (Rwanda – Uganda) · Effective Date: {event.date}
          </p>
        </div>

        {/* What Changed In This Scenario */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            What Changed In This Scenario?
          </h2>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            An illustrative 30-day pilot extends staple-food clearance hours at the checkpoint. The proposed mechanism is shorter queues and reduced transit delays. This is a designed example, not a verified government announcement.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-[10px] text-neutral-400">Announcement</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">10 Aug 2026</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-[10px] text-neutral-400">Effective</div>
              <div className="font-bold text-teal-700 dark:text-teal-400 mt-0.5">12 Aug 2026</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-[10px] text-neutral-400">Review Due</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{event.reviewDate}</div>
            </div>
          </div>
        </div>

        {/* Observed Alongside The Event: 3-column Window */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Observed Alongside The Event
          </h2>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-[11px] font-mono text-neutral-400">10 Aug · Before</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                +18.2%
              </div>
              <div className="text-[10px] text-neutral-500">Spread</div>
            </div>

            <div className="p-4 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
              <div className="text-[11px] font-mono text-rose-500">17 Aug · Next Release</div>
              <div className="text-base sm:text-lg font-mono font-bold text-rose-600 dark:text-rose-400 mt-2">
                Missed Data
              </div>
              <div className="text-[10px] text-neutral-500">Zero interpolation</div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-[11px] font-mono text-neutral-400">24 Aug · After</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-teal-700 dark:text-teal-400 mt-1">
                +19.9%
              </div>
              <div className="text-[10px] text-neutral-500">Spread</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The spread increased by 1.7 percentage points between the nearest available paired releases. The first post-event destination observation is missing; a causal effect cannot be inferred.
          </div>
        </div>

        {/* Interpret Cautiously (3 Cards) */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            Interpret Cautiously
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
              <div className="font-mono font-bold text-neutral-400">01</div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Seasonality, FX changes, harvest timing and fuel prices can move prices independently of policy.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
              <div className="font-mono font-bold text-neutral-400">02</div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Transport context is qualitative. No fuel/transit-adjusted friction formula has been specified.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
              <div className="font-mono font-bold text-neutral-400">03</div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Verify a real policy notice and compare a longer pre/post period before writing a recommendation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Provenance */}
        <div className="p-5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Event provenance: {event.sourceProvenance}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadJson}
              className="btn-pressable inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> JSON event record
            </button>
            <button
              onClick={handlePrint}
              className="btn-pressable inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Print Policy Brief
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

