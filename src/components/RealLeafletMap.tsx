'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CorridorId } from '@/lib/types';
import { CORRIDORS, REGIONAL_COUNTRY_PRICES } from '@/lib/data';
import L from 'leaflet';

interface RealLeafletMapProps {
  selectedCorridor: CorridorId;
  onSelectCorridor: (c: CorridorId) => void;
  commodityName: string;
  darkMode?: boolean;
  fullScreen?: boolean;
}

// Real geographic coordinate definitions for East Africa cross-border corridors
interface CorridorGeo {
  id: CorridorId;
  name: string;
  origin: { name: string; country: string; lat: number; lng: number };
  destination: { name: string; country: string; lat: number; lng: number };
  borderPost: { name: string; lat: number; lng: number };
  route: [number, number][]; // lat, lng points along the actual transit route
}

const CORRIDOR_GEOGRAPHY: Record<CorridorId, CorridorGeo> = {
  'gatuna-katuna': {
    id: 'gatuna-katuna',
    name: 'Gatuna / Katuna',
    origin: { name: 'Kabale', country: 'Uganda', lat: -1.2486, lng: 29.9889 },
    destination: { name: 'Musanze', country: 'Rwanda', lat: -1.4998, lng: 29.6349 },
    borderPost: { name: 'Gatuna/Katuna OSBP', lat: -1.4325, lng: 30.0131 },
    route: [
      [-1.2486, 29.9889], // Kabale
      [-1.3350, 30.0020], // Descending south
      [-1.4325, 30.0131], // Gatuna / Katuna Border
      [-1.4550, 29.8900], // RN4 Highway
      [-1.4998, 29.6349], // Musanze
    ],
  },
  rusumo: {
    id: 'rusumo',
    name: 'Rusumo',
    origin: { name: 'Ngara', country: 'Tanzania', lat: -2.5122, lng: 30.6558 },
    destination: { name: 'Kirehe', country: 'Rwanda', lat: -2.2678, lng: 30.6517 },
    borderPost: { name: 'Rusumo Falls OSBP', lat: -2.3831, lng: 30.7836 },
    route: [
      [-2.5122, 30.6558], // Ngara
      [-2.4300, 30.7200], // B3 road toward river
      [-2.3831, 30.7836], // Rusumo Bridge Border
      [-2.3200, 30.7100], // RN3 Rwanda Highway
      [-2.2678, 30.6517], // Kirehe
    ],
  },
  busia: {
    id: 'busia',
    name: 'Busia',
    origin: { name: 'Tororo', country: 'Uganda', lat: 0.6928, lng: 34.1811 },
    destination: { name: 'Busia (KE)', country: 'Kenya', lat: 0.4608, lng: 34.1115 },
    borderPost: { name: 'Busia One-Stop Border Post', lat: 0.4667, lng: 34.1167 },
    route: [
      [0.6928, 34.1811], // Tororo
      [0.5800, 34.1400], // Tororo-Busia road
      [0.4667, 34.1167], // Busia Border
      [0.4608, 34.1115], // Busia Market Kenya
    ],
  },
  malaba: {
    id: 'malaba',
    name: 'Malaba',
    origin: { name: 'Tororo', country: 'Uganda', lat: 0.6928, lng: 34.1811 },
    destination: { name: 'Eldoret', country: 'Kenya', lat: 0.5143, lng: 35.2698 },
    borderPost: { name: 'Malaba Railway & Road OSBP', lat: 0.6333, lng: 34.2833 },
    route: [
      [0.6928, 34.1811], // Tororo
      [0.6333, 34.2833], // Malaba Border Post
      [0.5800, 34.6000], // Webuye Highway
      [0.5143, 35.2698], // Eldoret Grain Hub
    ],
  },
};

// Regional capital/city reference benchmarks
const REGIONAL_MARKETS = [
  { name: 'Goma (DRC)', country: 'DRC', lat: -1.6792, lng: 29.2285, price: 390 },
  { name: 'Kampala', country: 'Uganda', lat: 0.3476, lng: 32.5825, price: 300 },
  { name: 'Kigali', country: 'Rwanda', lat: -1.9441, lng: 30.0619, price: 354 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, price: 330 },
  { name: 'Mwanza', country: 'Tanzania', lat: -2.5164, lng: 32.9000, price: 290 },
];

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  selectedCorridor,
  onSelectCorridor,
  commodityName,
  darkMode = true,
  fullScreen = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap style: 'canvas' (Esri Dark/Light), 'osm' (OpenStreetMap standard), 'satellite' (Esri Imagery)
  const [basemapStyle, setBasemapStyle] = useState<'canvas' | 'osm' | 'satellite'>('canvas');

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // East Africa Center: ~0.8S, 32.0E, zoom level 7
      const map = L.map(mapContainerRef.current, {
        center: [-0.8, 32.0],
        zoom: 7,
        minZoom: 5,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Compact attribution
      L.control
        .attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>')
        .addTo(map);

      // Resize listener for responsive layout / fullScreen transition
      const handleResize = () => {
        if (mapInstanceRef.current && mapContainerRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
          } catch {
            // Container unmounted or detached safely
          }
        }
      };
      window.addEventListener('resize', handleResize);
      const timer = setTimeout(handleResize, 250);

      mapInstanceRef.current = map;
      tileLayerRef.current = L.layerGroup().addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch {
            // Container already cleaned up
          }
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update Basemap Tiles (100% Free, NO API KEY REQUIRED, NO WATERMARKS)
  useEffect(() => {
    const tileGroup = tileLayerRef.current;
    if (!tileGroup) return;

    tileGroup.clearLayers();

    if (basemapStyle === 'canvas') {
      if (darkMode) {
        // ESRI World Dark Gray Base + Labels Overlay
        const darkBase = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 16, subdomains: ['server', 'services'] }
        );
        const darkLabels = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 16, subdomains: ['server', 'services'], opacity: 0.9 }
        );
        tileGroup.addLayer(darkBase);
        tileGroup.addLayer(darkLabels);
      } else {
        // ESRI World Light Gray Base + Labels Overlay
        const lightBase = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 16, subdomains: ['server', 'services'] }
        );
        const lightLabels = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 16, subdomains: ['server', 'services'], opacity: 0.9 }
        );
        tileGroup.addLayer(lightBase);
        tileGroup.addLayer(lightLabels);
      }
    } else if (basemapStyle === 'osm') {
      // Official OpenStreetMap Standard Tiles
      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      });
      tileGroup.addLayer(osm);
    } else if (basemapStyle === 'satellite') {
      // ESRI High-Resolution World Imagery
      const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );
      tileGroup.addLayer(satellite);
    }
  }, [basemapStyle, darkMode]);

  // Update Vector Overlays & Fly-To when Selected Corridor changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupRef.current) return;

    // Clear previous vectors
    layerGroupRef.current.clearLayers();

    // 1. Render all corridors
    (Object.keys(CORRIDOR_GEOGRAPHY) as CorridorId[]).forEach((cId) => {
      const geo = CORRIDOR_GEOGRAPHY[cId];
      const isSelected = selectedCorridor === cId;
      const corridorInfo = CORRIDORS[cId];

      if (isSelected) {
        // 1. Triple-Layer Illuminated Trajectory (VisionOS Liquid Halo Effect)
        // Layer A: Wide atmospheric diffused halo
        const outerHalo = L.polyline(geo.route, {
          color: '#14B8A6',
          weight: 18,
          opacity: 0.22,
          lineCap: 'round',
          lineJoin: 'round',
        });
        layerGroupRef.current?.addLayer(outerHalo);

        // Layer B: Focused glowing photon beam
        const glowLine = L.polyline(geo.route, {
          color: '#2DD4BF',
          weight: 8,
          opacity: 0.55,
          lineCap: 'round',
          lineJoin: 'round',
        });
        layerGroupRef.current?.addLayer(glowLine);

        // Layer C: Core crisp trajectory line
        const mainLine = L.polyline(geo.route, {
          color: '#F0FDFA',
          weight: 3.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        mainLine.bindTooltip(
          `<strong>${geo.name} Active Corridor</strong><br/><span style="color:#14B8A6">Divergence: +${corridorInfo.currentDivergencePct}%</span>`,
          { sticky: true }
        );
        layerGroupRef.current?.addLayer(mainLine);

        // Origin Marker (Cyan Pulse Node)
        const originIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></span>
              <span class="absolute w-5 h-5 rounded-full bg-cyan-400/50"></span>
              <span class="relative w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-lg"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const originMarker = L.marker([geo.origin.lat, geo.origin.lng], { icon: originIcon });
        originMarker.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <div class="font-bold text-cyan-700 dark:text-cyan-400">ORIGIN: ${geo.origin.name} (${geo.origin.country})</div>
            <div class="font-mono text-sm font-bold text-neutral-900 dark:text-white mt-0.5">$${corridorInfo.originPriceUsd} / MT</div>
            <div class="text-[10px] text-neutral-500">${commodityName} weekly benchmark</div>
          </div>
        `);
        layerGroupRef.current?.addLayer(originMarker);

        // Destination Marker (Teal Pulse Node)
        const destIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-9 h-9 rounded-full bg-teal-400/35 animate-ping"></span>
              <span class="absolute w-6 h-6 rounded-full bg-teal-500/50"></span>
              <span class="relative w-4 h-4 rounded-full bg-teal-300 border-2 border-white shadow-xl"></span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const destMarker = L.marker([geo.destination.lat, geo.destination.lng], { icon: destIcon });
        destMarker.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <div class="font-bold text-teal-700 dark:text-teal-400">DESTINATION: ${geo.destination.name} (${geo.destination.country})</div>
            <div class="font-mono text-sm font-bold text-teal-700 dark:text-teal-300 mt-0.5">$${corridorInfo.destPriceUsd} / MT</div>
            <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400">Divergence: +${corridorInfo.currentDivergencePct}% premium</div>
          </div>
        `);
        layerGroupRef.current?.addLayer(destMarker);

        // Border Checkpoint Post (Custom VisionOS Glass Badge)
        const borderIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div class="px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-mono font-semibold border border-teal-400/60 shadow-lg whitespace-nowrap flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>${geo.borderPost.name}</span>
            </div>
          `,
          iconSize: [140, 24],
          iconAnchor: [70, 12],
        });

        const borderMarker = L.marker([geo.borderPost.lat, geo.borderPost.lng], { icon: borderIcon });
        borderMarker.bindPopup(`
          <div class="p-1.5 font-sans text-xs">
            <div class="font-bold text-neutral-900 dark:text-white">${geo.borderPost.name}</div>
            <div class="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1">${corridorInfo.frictionNote}</div>
            <div class="text-[10px] font-mono text-teal-600 dark:text-teal-400 mt-1">Policy: P1 Fast-Track Customs Active</div>
          </div>
        `);
        layerGroupRef.current?.addLayer(borderMarker);

        // Smoothly zoom/fly to selected corridor bounds
        const bounds = L.latLngBounds(geo.route);
        map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 9, duration: 1.0 });
      } else {
        // Inactive corridors: subtle clickable dashed line
        const inactiveLine = L.polyline(geo.route, {
          color: darkMode ? '#64748B' : '#94A3B8',
          weight: 2,
          dashArray: '4, 6',
          opacity: 0.45,
        });

        inactiveLine.on('click', () => onSelectCorridor(cId));
        inactiveLine.bindTooltip(
          `Click to select: <strong>${geo.name}</strong> (+${corridorInfo.currentDivergencePct}%)`,
          { sticky: true }
        );

        layerGroupRef.current?.addLayer(inactiveLine);
      }
    });

    // 2. Add Regional Benchmark Hubs (dimmed baseline tags for non-active countries)
    REGIONAL_MARKETS.forEach((m) => {
      const isOriginOrDest = Object.values(CORRIDOR_GEOGRAPHY).some(
        (c) => c.origin.name === m.name || c.destination.name === m.name
      );
      if (isOriginOrDest) return;

      const hubIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div class="px-2 py-0.5 rounded-full bg-neutral-900/75 dark:bg-black/60 backdrop-blur-md text-neutral-400 text-[9px] font-mono border border-neutral-700/40 shadow-sm whitespace-nowrap opacity-75 hover:opacity-100 transition-opacity">
            <span class="text-neutral-500 mr-1">${m.country}:</span>${m.name} · $${m.price}/t
          </div>
        `,
        iconSize: [110, 18],
        iconAnchor: [55, 9],
      });

      const hubMarker = L.marker([m.lat, m.lng], { icon: hubIcon });
      layerGroupRef.current?.addLayer(hubMarker);
    });
  }, [selectedCorridor, onSelectCorridor, commodityName, darkMode]);

  const handleRecenterEastAfrica = () => {
    mapInstanceRef.current?.flyTo([-0.8, 32.0], 7, { duration: 1.0 });
  };

  return (
    <div
      className={
        fullScreen
          ? 'absolute inset-0 w-full h-full z-0 overflow-hidden bg-neutral-950 select-none'
          : 'relative w-full h-[400px] sm:h-[420px] rounded-lg overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80'
      }
    >
      {/* Leaflet Mount Surface */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-neutral-950" />

      {/* When NOT fullScreen: show small top badge */}
      {!fullScreen && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <div className="px-3 py-1.5 rounded-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-mono shadow-sm space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                Active Corridor: {CORRIDORS[selectedCorridor].name}
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center space-x-3">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Origin</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-teal-500 mr-1"></span> Dest</span>
              <span className="flex items-center"><span className="w-3 border-t border-dashed border-neutral-400 mr-1"></span> Other Corridors</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Control Pill: Tile Layer Switcher & Recenter */}
      <div
        className={
          fullScreen
            ? 'absolute bottom-6 right-6 z-20 flex items-center gap-2 pointer-events-auto'
            : 'absolute top-3 right-3 z-10 flex items-center gap-2'
        }
      >
        {/* Layer style toggle */}
        <div className="inline-flex p-1 rounded-full liquid-glass text-[11px] font-mono shadow-lg">
          <button
            onClick={() => setBasemapStyle('canvas')}
            className={`px-3 py-1 rounded-full btn-pressable transition-all ${
              basemapStyle === 'canvas'
                ? 'bg-teal-500/25 text-teal-300 font-semibold border border-teal-400/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Clean thematic canvas (No API key, zero watermarks)"
          >
            Canvas
          </button>
          <button
            onClick={() => setBasemapStyle('osm')}
            className={`px-3 py-1 rounded-full btn-pressable transition-all ${
              basemapStyle === 'osm'
                ? 'bg-teal-500/25 text-teal-300 font-semibold border border-teal-400/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="OpenStreetMap Standard Street & Topography Map"
          >
            OSM
          </button>
          <button
            onClick={() => setBasemapStyle('satellite')}
            className={`px-3 py-1 rounded-full btn-pressable transition-all ${
              basemapStyle === 'satellite'
                ? 'bg-teal-500/25 text-teal-300 font-semibold border border-teal-400/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="High-Resolution Satellite Imagery"
          >
            Satellite
          </button>
        </div>

        {/* Recenter button */}
        <button
          onClick={handleRecenterEastAfrica}
          className="btn-pressable px-3 py-1.5 rounded-full text-[11px] font-mono font-medium liquid-glass text-neutral-200 border border-white/10 shadow-lg hover:border-teal-400/40 hover:text-white flex items-center gap-1.5"
          title="Reset to East Africa regional overview"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <span>Recenter</span>
        </button>
      </div>

      {/* Discreet bottom status line */}
      <div className={fullScreen ? 'absolute bottom-6 left-6 z-10 hidden md:block' : 'absolute bottom-2 left-2 z-10 hidden sm:block'}>
        <div className="px-3 py-1 rounded-full liquid-glass text-[10px] font-mono text-neutral-400/80 border border-white/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Zero-Watermark Public GIS · Real East Africa GPS Grid</span>
        </div>
      </div>
    </div>
  );
};
