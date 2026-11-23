'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  Code2,
  ArrowLeft,
  Download,
  Check,
  Copy,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';

export default function ApiReferencePage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/observations');

  const ENDPOINTS = [
    {
      method: 'GET',
      path: '/api/v1/corridors',
      title: 'Corridor Directory',
      description: 'IDs, coordinates, origin/destination markets, and trade directions.',
    },
    {
      method: 'GET',
      path: '/api/v1/observations',
      title: 'Paired Price Observations',
      description: 'Normalized USD/MT wholesale prices, derived divergence, and null quality flags.',
    },
    {
      method: 'GET',
      path: '/api/v1/volumes',
      title: 'Cross-Border Grain Tonnages',
      description: 'Bi-weekly informal crop volumes (Maize, Beans, Rice, Sorghum).',
    },
    {
      method: 'GET',
      path: '/api/v1/policy-events',
      title: 'Policy Interventions',
      description: 'Historical regulatory shock events and empirical pre/post spread impacts.',
    },
    {
      method: 'GET',
      path: '/openapi.json',
      title: 'OpenAPI 3.0 Specification',
      description: 'Complete machine-readable OpenAPI schema definition contract.',
    },
  ];

  const SAMPLE_RESPONSE = {
    corridor: 'gatuna-katuna',
    commodity: 'maize',
    direction: 'UG->RW',
    units: { price: 'USD/t' },
    source: 'CB-FVT EAC Spatial Engine v1.0',
    source_type: 'empirical_fews_wfp',
    published_at: '2026-09-28T09:00:00+03:00',
    ingested_at: '2026-09-29T08:00:00+03:00',
    cadence: 'weekly',
    fx_baseline_date: '2026-07-01',
    data: [
      {
        date: '2026-09-28',
        origin: { market: 'Kabale', country: 'UG', price: 300, quality_flags: [] },
        destination: { market: 'Musanze', country: 'RW', price: 354, quality_flags: [] },
        divergence_pct: 18.0,
        quality_flags: [],
      },
      {
        date: '2026-08-17',
        origin: { market: 'Kabale', country: 'UG', price: 295, quality_flags: [] },
        destination: { market: 'Musanze', country: 'RW', price: null, quality_flags: ['missing_observation'] },
        divergence_pct: null,
        quality_flags: ['destination_missing', 'srs_nfr_5_non_imputed'],
      },
    ],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_RESPONSE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    const spec = {
      openapi: '3.0.3',
      info: {
        title: 'Cross-Border Informal Food Flows & Price Volatility Tracker (CB-FVT) API',
        version: '1.0.0',
        description: 'REST API contract for East Africa cross-border commodity price monitoring and divergence calculations.',
        contact: { name: 'Manzi Gatabazi Pacifique', email: 'analyst@cb-fvt.org' },
      },
      servers: [{ url: 'http://localhost:3000/api', description: 'Local Development Runtime' }],
      paths: {
        '/corridors': {
          get: { summary: 'List all monitored corridors', responses: { '200': { description: 'Corridor directory' } } },
        },
        '/divergence': {
          get: {
            summary: 'Retrieve paired observations and divergence calculations',
            parameters: [
              { name: 'corridor', in: 'query', required: true, schema: { type: 'string', example: 'gatuna-katuna' } },
              { name: 'commodity', in: 'query', required: true, schema: { type: 'string', example: 'maize' } },
            ],
            responses: { '200': { description: 'Observations series with non-imputed nulls' } },
          },
        },
      },
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openapi-cb-fvt.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Navigation Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Spatial Workspace
              </Link>
              <span>/</span>
              <span>Developer Reference</span>
              <span>/</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">OpenAPI 3.0</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              API Reference & Data Contract
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              OpenAPI 3.0 specification for analytical reuse, automated ETL clients, and regional research pipelines across East Africa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSpec}
              className="btn-pressable inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download OpenAPI Spec
            </button>
          </div>
        </div>

        {/* 2-Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Endpoints & Architecture Bento */}
          <div className="lg:col-span-5 space-y-4">
            <div className="apple-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Resource Directory
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-bold">
                  v1.0 Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {ENDPOINTS.map((ep) => {
                  const isSelected = selectedEndpoint === ep.path;
                  return (
                    <button
                      key={ep.path}
                      onClick={() => setSelectedEndpoint(ep.path)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-teal-50/70 dark:bg-teal-950/20 border-teal-500/40 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                            {ep.method}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {ep.path}
                          </span>
                        </div>
                        <ArrowUpRight className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2">
                        {ep.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {ep.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architectural Production Guarantees Card */}
            <div className="apple-card p-6 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Production Readiness Decisions
              </span>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
                  <div className="text-[10px] uppercase text-slate-400">Authentication</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">Bearer Token / JWT Secret</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
                  <div className="text-[10px] uppercase text-slate-400">Rate Limiting</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">60 req/min token bucket per client</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
                  <div className="text-[10px] uppercase text-slate-400">SRS NFR 5 Non-Imputation</div>
                  <div className="font-semibold text-teal-600 dark:text-teal-400 mt-0.5">Missing prices serialize strictly as null, never 0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Endpoint Documentation & Payload Preview */}
          <div className="lg:col-span-7 apple-card p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                  GET
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedEndpoint}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Retrieve origin and destination wholesale prices for a corridor, commodity, and inclusive date interval. Prices are normalized to USD/metric ton. Missing destination prices serialize strictly as null in compliance with SRS NFR 5.
              </p>
            </div>

            {/* Query Parameters Table */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Query Parameters
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="py-2.5">Parameter</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Example</th>
                      <th className="py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px]">
                    <tr>
                      <td className="py-2.5 font-bold text-teal-600 dark:text-teal-400">corridor</td>
                      <td className="py-2.5 text-slate-400">string (required)</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">gatuna-katuna</td>
                      <td className="py-2.5 text-slate-500">Target corridor ID</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-teal-600 dark:text-teal-400">commodity</td>
                      <td className="py-2.5 text-slate-400">string (required)</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">maize</td>
                      <td className="py-2.5 text-slate-500">Staple crop category</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-teal-600 dark:text-teal-400">start</td>
                      <td className="py-2.5 text-slate-400">date (optional)</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">2026-07-01</td>
                      <td className="py-2.5 text-slate-500">YYYY-MM-DD format</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-teal-600 dark:text-teal-400">end</td>
                      <td className="py-2.5 text-slate-400">date (optional)</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">2026-09-30</td>
                      <td className="py-2.5 text-slate-500">YYYY-MM-DD format</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Path Example */}
            <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-black/60 font-mono text-xs text-slate-300 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500">REQUEST · </span>
                <span className="text-teal-400">GET /api/divergence?corridor=gatuna-katuna&commodity=maize</span>
              </div>
            </div>

            {/* Response Example Payload */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase text-[11px]">200 OK · Demonstration Response Payload</span>
                <button
                  onClick={handleCopy}
                  className="btn-pressable inline-flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 dark:bg-black/70 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-72 leading-relaxed">
                {JSON.stringify(SAMPLE_RESPONSE, null, 2)}
              </pre>
            </div>

            {/* Status Codes */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                HTTP Status Codes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">200 OK</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Valid payload synthesized</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="font-bold text-amber-700 dark:text-amber-400">400 Bad Request</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Invalid query parameters</div>
                </div>
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="font-bold text-rose-700 dark:text-rose-400">503 Unavailable</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">ETL worker offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
