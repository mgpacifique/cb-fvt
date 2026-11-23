'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoginForm } from '@/components/auth/LoginForm';

// Dynamically import map for background blur
const RealLeafletMap = dynamic(
  () => import('@/components/RealLeafletMap').then((mod) => mod.RealLeafletMap),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950 overflow-hidden select-none">
      {/* Background Spatial Layer with Heavy Blur */}
      <div className="absolute inset-0 w-full h-full opacity-35 filter blur-xs pointer-events-none">
        <RealLeafletMap
          fullScreen={true}
          selectedCorridor="gatuna-katuna"
          onSelectCorridor={() => {}}
          commodityName="Maize"
          darkMode={true}
        />
      </div>

      {/* Darkened Vignette Overlay */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md pointer-events-none" />

      {/* Floating Centered Liquid Glass Modal */}
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-white text-center font-mono text-xs">Loading authentication form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

