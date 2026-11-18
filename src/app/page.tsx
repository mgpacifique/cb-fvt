'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CorridorId, CommodityId, PolicyEvent } from '@/lib/types';
import { CORRIDORS, COMMODITIES, getObservations } from '@/lib/data';
import { FloatingHeaderPill } from '@/components/FloatingHeaderPill';
import { FloatingKpiRow } from '@/components/FloatingKpiRow';
import { FloatingAnalyticsDrawer } from '@/components/FloatingAnalyticsDrawer';
import { PolicyModal } from '@/components/PolicyModal';
import { UserManualModal } from '@/components/UserManualModal';
import { PrintReport } from '@/components/PrintReport';
import { AdminIngestionModal } from '@/components/AdminIngestionModal';
import { AccountModal } from '@/components/auth/AccountModal';

// Dynamically import RealLeafletMap with SSR disabled
const RealLeafletMap = dynamic(
  () => import('@/components/RealLeafletMap').then((mod) => mod.RealLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full bg-neutral-950 flex items-center justify-center text-teal-400 font-mono text-xs">
        <div className="flex items-center space-x-3 liquid-glass px-4 py-2.5 rounded-full border border-teal-500/30">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          <span>Mounting East Africa Spatial Canvas...</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorId>('gatuna-katuna');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityId>('maize');
  const [rollingWindow, setRollingWindow] = useState<'30' | '90'>('90');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedPolicyEvent, setSelectedPolicyEvent] = useState<PolicyEvent | null>(null);
  const [userManualOpen, setUserManualOpen] = useState<boolean>(false);
  const [adminEtlOpen, setAdminEtlOpen] = useState<boolean>(false);
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
  const [liveDatasetNonce, setLiveDatasetNonce] = useState<number>(0);

  // Sync theme with DOM document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time synchronization when admin publishes validated fixtures
  useEffect(() => {
    const handleFixturePublished = () => {
      setLiveDatasetNonce((prev) => prev + 1);
    };

    window.addEventListener('cbfvt_fixture_published', handleFixturePublished);
    window.addEventListener('storage', handleFixturePublished);

    return () => {
      window.removeEventListener('cbfvt_fixture_published', handleFixturePublished);
      window.removeEventListener('storage', handleFixturePublished);
    };
  }, []);

  const observations = getObservations(selectedCorridor, selectedCommodity);
  const currentCorridor = CORRIDORS[selectedCorridor];
  const currentCommodity = COMMODITIES[selectedCommodity];

  // Latest observation
  const latestObs = observations[observations.length - 1];

  // Export handlers
  const handleExportCsv = () => {
    const sortedObs = [...observations].reverse();
    const headers = [
      'Publication Date',
      `Origin (${currentCorridor.originMarket}) USD/MT`,
      `Destination (${currentCorridor.destMarket}) USD/MT`,
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
      `CB-FVT_${currentCorridor.name.replace(/[^a-zA-Z0-9]/g, '_')}_${currentCommodity.name}_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const data = {
      corridor: currentCorridor,
      commodity: currentCommodity,
      rollingWindow,
      latestDivergence: latestObs?.divergencePct,
      observations,
      metadata: {
        system: 'CB-FVT Release 1.0 (East Africa Spatial)',
        specification: 'Manzi Gatabazi Pacifique · African Leadership University',
        sources: ['FEWS NET', 'WFP VAM', 'EAC Trade Helpdesk'],
        exportedAt: new Date().toISOString(),
      },
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `CB-FVT_${currentCorridor.id}_${selectedCommodity}.json`;
    link.click();
  };

  const handlePrintBrief = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* 1. Printable Surface (Active only during browser window.print) */}
      <PrintReport
        corridor={currentCorridor}
        commodityName={currentCommodity.name}
        observations={observations}
        currentDivergence={latestObs?.divergencePct ?? null}
        onClosePrint={() => {}}
      />

      {/* 2. Interactive Spatial Application (Hidden on print) */}
      <div className="no-print absolute inset-0 w-full h-full">
        {/* Layer 1: Content Layer — Full-Bleed Map Canvas */}
        <RealLeafletMap
          fullScreen={true}
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
          commodityName={currentCommodity.name}
          darkMode={darkMode}
        />

        {/* Layer 2: Functional Layer — Floating VisionOS Controls */}
        {/* Floating Top Header Pill */}
        <FloatingHeaderPill
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
          selectedCommodity={selectedCommodity}
          onSelectCommodity={setSelectedCommodity}
          rollingWindow={rollingWindow}
          onSelectRollingWindow={setRollingWindow}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenManual={() => setUserManualOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
          onPrintBrief={handlePrintBrief}
          onExportCsv={handleExportCsv}
          onExportJson={handleExportJson}
          onOpenAdminEtl={() => setAdminEtlOpen(true)}
        />

        {/* Floating Glass KPI Tiles */}
        <FloatingKpiRow
          currentDivergence={latestObs?.divergencePct ?? null}
          corridorName={currentCorridor.name}
          commodityName={currentCommodity.name}
          originPrice={currentCorridor.originPriceUsd}
          destPrice={currentCorridor.destPriceUsd}
        />

        {/* Floating Left/Bottom Analytics Drawer */}
        <FloatingAnalyticsDrawer
          observations={observations}
          rollingWindow={rollingWindow}
          onSelectPolicyEvent={setSelectedPolicyEvent}
          corridorName={currentCorridor.name}
          commodityName={currentCommodity.name}
          originMarket={currentCorridor.originMarket}
          destMarket={currentCorridor.destMarket}
          onPrintBrief={handlePrintBrief}
          corridor={currentCorridor}
          commodityId={selectedCommodity}
        />
      </div>

      {/* 3. Modal Overlays */}
      <PolicyModal
        event={selectedPolicyEvent}
        onClose={() => setSelectedPolicyEvent(null)}
      />

      <UserManualModal
        isOpen={userManualOpen}
        onClose={() => setUserManualOpen(false)}
      />

      {/* Admin ETL Ingestion Console (RBAC Gated) */}
      <AdminIngestionModal
        isOpen={adminEtlOpen}
        onClose={() => setAdminEtlOpen(false)}
        onPublishToWorkspace={() => {
          setLiveDatasetNonce((prev) => prev + 1);
        }}
      />

      {/* Account Management & API Key Drawer */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </div>
  );
}
