'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { mockGlacialLakes } from '@/lib/mock/seed-data';
import {
  mockInundationCorridorGeoJson,
  mockHazardZonesGeoJson,
  mockSensorPoints,
} from '@/lib/mock/geo-data';
import { MapLayerControls, MapLayerState } from './MapLayerControls';
import { MapCoordinateHud } from './MapCoordinateHud';
import { MapLegend } from './MapLegend';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/i18n';

export const LiveRiskMap: React.FC = () => {
  const { t, language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    inundationLine?: L.GeoJSON;
    inundationPoly?: L.GeoJSON;
    hazardBuffers?: L.GeoJSON;
    lakeMarkers?: L.Marker[];
    sensorMarkers?: L.Marker[];
  }>({ lakeMarkers: [], sensorMarkers: [] });

  const [mapStatus, setMapStatus] = useState<'READY' | 'FALLBACK_2D' | 'LOADING'>('LOADING');
  const [initError, setInitError] = useState<string | null>(null);

  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; altM: number }>({
    lat: 27.9158,
    lng: 88.2045,
    altM: 5240,
  });

  const [layerState, setLayerState] = useState<MapLayerState>({
    terrain: true,
    sar: true,
    inundation: true,
    hazardBuffers: true,
    sensors: true,
    optical: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLakeId, setSelectedLakeId] = useState<string>('lake-014');

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? mockGlacialLakes
        .filter(
          (l) =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.region.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((l) => ({ id: l.id, name: l.name, code: l.code, riskLevel: l.riskLevel }))
    : [];

  const initLeafletMap = useCallback(async () => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    try {
      const L = await import('leaflet');
      const containerEl = mapContainerRef.current;
      if (!containerEl) return;

      // Clean up previous instance and container leaflet id
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // Ignore removal errors
        }
        mapInstanceRef.current = null;
      }

      if ((containerEl as unknown as { _leaflet_id?: unknown })._leaflet_id) {
        delete (containerEl as unknown as { _leaflet_id?: unknown })._leaflet_id;
      }

      // Initialize Leaflet Map centered on Eastern Himalayas / Teesta Basin
      const map = L.map(containerEl, {
        center: [28.0, 87.8],
        zoom: 8,
        minZoom: 5,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: true,
        touchZoom: true,
        dragging: true,
      });

      mapInstanceRef.current = map;

      // Custom Zoom Control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark Matter Tile Layer (CARTO Dark) with OSM fallback
      const tileLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; CARTO &copy; OpenStreetMap',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      tileLayer.on('tileerror', () => {
        try {
          if (mapInstanceRef.current) {
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap',
              maxZoom: 19,
              opacity: 0.8,
            }).addTo(mapInstanceRef.current);
          }
        } catch {
          // Vector layers remain fully visible
        }
      });

      // Track cursor position
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        const estAlt = Math.round(4800 + (Math.sin(e.latlng.lat * 10) * 1200 + Math.cos(e.latlng.lng * 10) * 1000));
        setCursorCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          altM: Math.max(1200, estAlt),
        });
      });

      // Inundation Corridors GeoJSON
      try {
        if (mockInundationCorridorGeoJson && mockInundationCorridorGeoJson.features) {
          const inundationLine = L.geoJSON(mockInundationCorridorGeoJson.features[0] as unknown as GeoJSON.GeoJsonObject, {
            style: {
              color: '#ff6b6b',
              weight: 3.5,
              dashArray: '6, 6',
              opacity: 0.9,
            },
          }).addTo(map);

          const inundationPoly = L.geoJSON(mockInundationCorridorGeoJson.features[1] as unknown as GeoJSON.GeoJsonObject, {
            style: {
              fillColor: '#ff6b6b',
              fillOpacity: 0.22,
              color: '#ff6b6b',
              weight: 1.5,
              dashArray: '4, 4',
              opacity: 0.7,
            },
          }).addTo(map);

          layersRef.current.inundationLine = inundationLine;
          layersRef.current.inundationPoly = inundationPoly;
        }
      } catch (geoErr) {
        console.warn('[GLOF Map] GeoJSON Inundation layer warning:', geoErr);
      }

      // Hazard Buffer Zones GeoJSON
      try {
        if (mockHazardZonesGeoJson) {
          const hazardBuffers = L.geoJSON(mockHazardZonesGeoJson as unknown as GeoJSON.GeoJsonObject, {
            style: (feature) => ({
              fillColor: feature?.properties?.color || '#ff6b6b',
              fillOpacity: 0.15,
              color: feature?.properties?.color || '#ff6b6b',
              weight: 1.2,
              dashArray: '3, 3',
            }),
          }).addTo(map);

          layersRef.current.hazardBuffers = hazardBuffers;
        }
      } catch (hazardErr) {
        console.warn('[GLOF Map] Hazard buffer layer warning:', hazardErr);
      }

      // Glacial Lake Markers
      const lakeMarkers: L.Marker[] = [];
      mockGlacialLakes.forEach((lake) => {
        const isCritical = lake.riskLevel === 'L4';
        const isWarning = lake.riskLevel === 'L3';
        const isWatch = lake.riskLevel === 'L2';

        const colorClass = isCritical
          ? 'bg-critical'
          : isWarning
          ? 'bg-warning'
          : isWatch
          ? 'bg-secondary'
          : 'bg-advisory';

        const pingClass = isCritical ? 'pulse-ping' : isWarning ? 'pulse-dot' : '';

        const customHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
            <div class="w-7 h-7 rounded-full ${colorClass}/20 flex items-center justify-center border border-${colorClass}">
              <div class="w-3 h-3 rounded-full ${colorClass} ${pingClass}"></div>
            </div>
            <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#0c141c]/90 px-1.5 py-0.5 rounded border border-[#232b33] text-[9px] font-mono text-[#dbe3ee] font-bold shadow-md">
              ${lake.code}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-lake-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const popupContent = `
          <div class="p-3 bg-[#12171d] text-[#dbe3ee] font-mono text-[11px] min-w-[220px] rounded">
            <div class="flex justify-between items-center border-b border-[#232b33] pb-1.5 mb-2">
              <span class="font-bold text-[#5de6ff]">${lake.code}</span>
              <span class="font-bold px-1.5 py-0.5 rounded text-[9px] ${
                isCritical
                  ? 'bg-[#ff6b6b]/20 text-[#ff6b6b] border border-[#ff6b6b]/40'
                  : 'bg-[#5de6ff]/20 text-[#5de6ff] border border-[#5de6ff]/40'
              }">${lake.riskStatus}</span>
            </div>
            <div class="font-sans font-bold text-[13px] text-[#dbe3ee] mb-1.5">${lake.name}</div>
            <div class="space-y-1 text-[10px] text-[#c4c5d7] mb-3">
              <div class="flex justify-between"><span>Basin:</span> <span class="text-[#dbe3ee]">${lake.basin}</span></div>
              <div class="flex justify-between"><span>Est. Volume:</span> <span class="text-[#dbe3ee] font-bold">${lake.estimatedVolumeMCM} MCM</span></div>
              <div class="flex justify-between"><span>Freeboard:</span> <span class="${isCritical ? 'text-[#ff6b6b] font-bold' : 'text-[#dbe3ee]'}">${lake.freeboardM} m</span></div>
              <div class="flex justify-between"><span>Risk Score:</span> <span class="${isCritical ? 'text-[#ff6b6b] font-bold' : 'text-[#5de6ff]'}">${lake.riskScore.toFixed(3)}</span></div>
              <div class="flex justify-between"><span>Area Expansion:</span> <span class="text-[#b8c4ff]">+${lake.areaExpansionPct}%</span></div>
            </div>
            <a href="/lakes/${lake.slug}" class="block text-center py-1.5 bg-[#4c6ef5]/20 hover:bg-[#4c6ef5]/30 text-[#b8c4ff] hover:text-[#5de6ff] border border-[#4c6ef5]/50 rounded text-[10px] font-bold uppercase transition-colors">
              VIEW SITE TELEMETRY →
            </a>
          </div>
        `;

        const marker = L.marker([lake.coordinates.lat, lake.coordinates.lng], { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 280 })
          .addTo(map);

        lakeMarkers.push(marker);
      });

      // Sensor Stations
      const sensorMarkers: L.Marker[] = [];
      mockSensorPoints.forEach((sensor) => {
        const sensorHtml = `
          <div class="flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="w-3.5 h-3.5 bg-[#182028] border border-[#b8c4ff] text-[#b8c4ff] rounded-[2px] flex items-center justify-center shadow-md">
              <span class="text-[9px] font-bold">S</span>
            </div>
            <span class="font-mono text-[8px] text-[#b8c4ff] bg-[#0c141c]/90 px-1 border border-[#232b33] rounded mt-0.5">${sensor.code}</span>
          </div>
        `;

        const sensorIcon = L.divIcon({
          html: sensorHtml,
          className: 'custom-sensor-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const sensorPopup = `
          <div class="p-2.5 bg-[#12171d] text-[#dbe3ee] font-mono text-[10px] min-w-[180px] rounded">
            <div class="text-[#b8c4ff] font-bold border-b border-[#232b33] pb-1 mb-1.5">${sensor.code} // IoT NODE</div>
            <div>${sensor.name}</div>
            <div class="text-[#5de6ff] mt-1">STATUS: ONLINE · UPLINK OK</div>
          </div>
        `;

        const marker = L.marker([sensor.lat, sensor.lng], { icon: sensorIcon })
          .bindPopup(sensorPopup)
          .addTo(map);

        sensorMarkers.push(marker);
      });

      layersRef.current.lakeMarkers = lakeMarkers;
      layersRef.current.sensorMarkers = sensorMarkers;

      // Force layout invalidation after DOM render across multiple frames
      const invalidationDelays = [50, 150, 300, 600, 1200];
      invalidationDelays.forEach((delay) => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });

      // Attach ResizeObserver for continuous responsive redraws
      if (typeof window !== 'undefined' && 'ResizeObserver' in window && containerEl) {
        const resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        });
        resizeObserver.observe(containerEl);
        (containerEl as unknown as { __resizeObserver?: ResizeObserver }).__resizeObserver = resizeObserver;
      }

      setMapStatus('READY');
    } catch (err: unknown) {
      console.warn('[GLOF Map] Leaflet GIS load fallback:', err);
      setInitError(err instanceof Error ? err.message : 'GIS engine initialization error');
      setMapStatus('FALLBACK_2D');
    }
  }, []);

  useEffect(() => {
    // Initialize Leaflet map immediately on client mount
    initLeafletMap();

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);

    // Fallback safety timeout (2 seconds max)
    const timeoutId = setTimeout(() => {
      setMapStatus((curr) => (curr === 'LOADING' ? 'READY' : curr));
    }, 2000);

    const containerEl = mapContainerRef.current;
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
      if (containerEl) {
        const container = containerEl as unknown as { __resizeObserver?: ResizeObserver };
        if (container.__resizeObserver) {
          container.__resizeObserver.disconnect();
        }
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [initLeafletMap]);

  // Handle Layer Toggles
  const handleToggleLayer = (key: keyof MapLayerState) => {
    setLayerState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const map = mapInstanceRef.current;
      if (!map) return next;

      if (key === 'inundation') {
        if (next.inundation) {
          layersRef.current.inundationLine?.addTo(map);
          layersRef.current.inundationPoly?.addTo(map);
        } else {
          layersRef.current.inundationLine?.remove();
          layersRef.current.inundationPoly?.remove();
        }
      }

      if (key === 'hazardBuffers') {
        if (next.hazardBuffers) {
          layersRef.current.hazardBuffers?.addTo(map);
        } else {
          layersRef.current.hazardBuffers?.remove();
        }
      }

      if (key === 'sensors') {
        if (next.sensors) {
          layersRef.current.sensorMarkers?.forEach((m) => m.addTo(map));
        } else {
          layersRef.current.sensorMarkers?.forEach((m) => m.remove());
        }
      }

      return next;
    });
  };

  // Fly to Lake
  const handleSelectLake = (lakeId: string) => {
    setSelectedLakeId(lakeId);
    const target = mockGlacialLakes.find((l) => l.id === lakeId);
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 11, {
        duration: 1.5,
      });
    }
  };

  // Quick Preset Jumps
  const handleFocusPreset = (coords: [number, number], zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0c141c] overflow-hidden select-none">
      {/* 2D Operational Vector Fallback if Tile Server / Leaflet Unreachable */}
      {mapStatus === 'FALLBACK_2D' && (
        <div className="absolute inset-0 z-10 flex flex-col bg-[#0c141c] p-4 text-on-surface overflow-auto">
          <div className="bg-surface-container-high hud-border p-3 rounded mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-warning font-mono text-[11px] font-bold">
              <Icon name="warning" size="xs" />
              <span>OFFLINE / 2D OPERATIONAL VECTOR GIS MODE ACTIVE {initError ? `(${initError})` : ''}</span>
            </div>
            <Button
              onClick={() => {
                setMapStatus('LOADING');
                initLeafletMap();
              }}
              variant="outline"
              size="sm"
              className="text-[10px]"
            >
              <Icon name="refresh" size="xs" />
              RETRY GIS BASERASTER
            </Button>
          </div>

          {/* 2D Vector Grid Display */}
          <div className="flex-1 min-h-[360px] bg-surface-container-lowest hud-border rounded relative p-4 flex flex-col justify-between">
            <div className="font-mono text-[10px] text-outline flex justify-between">
              <span>REGION: EASTERN &amp; WESTERN HIMALAYAN CRYOSPHERE</span>
              <span>GRID: EPSG:4326</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              {mockGlacialLakes.map((lake) => {
                const isCritical = lake.riskLevel === 'L4';
                return (
                  <Link
                    key={lake.id}
                    href={`/lakes/${lake.slug}`}
                    className="p-3 bg-surface-container-low hover:bg-surface-container hud-border rounded flex flex-col gap-1 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] font-bold text-secondary">{lake.code}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isCritical ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'}`}>
                        {lake.riskStatus}
                      </span>
                    </div>
                    <div className="font-sans text-[12px] font-bold text-on-surface group-hover:text-secondary transition-colors">
                      {lake.name}
                    </div>
                    <div className="font-mono text-[9px] text-outline flex justify-between mt-1">
                      <span>LAT: {lake.coordinates.lat.toFixed(3)}°N</span>
                      <span>LNG: {lake.coordinates.lng.toFixed(3)}°E</span>
                    </div>
                    <div className="font-mono text-[9px] text-primary mt-0.5">
                      VOL: {lake.estimatedVolumeMCM} MCM · FREEBOARD: {lake.freeboardM}m
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="font-mono text-[9px] text-outline flex justify-between pt-2 hud-border-t">
              <span>ISRO BHUVAN + IMD DISASTER MANAGEMENT LINK ACTIVE</span>
              <span>GEO-VECTOR ENGINE v4.2</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Leaflet Map Viewport */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 w-full h-full bg-[#0c141c]"
        style={{ width: '100%', height: '100%', minHeight: '380px' }}
      />

      {/* Top Left: Layer Controls & Presets */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-auto max-w-[calc(100vw-24px)] sm:max-w-none">
        <MapLayerControls
          layers={layerState}
          onToggleLayer={handleToggleLayer}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectLake={handleSelectLake}
          searchResults={searchResults}
        />
      </div>

      {/* Top Center: Preset Basin Selectors */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 hidden lg:flex items-center gap-1.5 bg-surface-container-high/95 backdrop-blur-md hud-border px-3 py-1.5 rounded-[4px] shadow-xl pointer-events-auto">
        <span className="font-mono text-[9px] text-outline uppercase font-bold mr-1">
          {language === 'hi' ? 'बेसिन नेविगेशन:' : 'BASIN JUMP:'}
        </span>
        <button
          type="button"
          onClick={() => handleFocusPreset([27.9158, 88.2045], 11)}
          className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-highest hud-border font-mono text-[10px] text-secondary font-bold transition-colors"
        >
          SOUTH LHONAK
        </button>
        <button
          type="button"
          onClick={() => handleFocusPreset([27.9, 86.9], 10)}
          className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-highest hud-border font-mono text-[10px] text-primary font-bold transition-colors"
        >
          IMJA TSHO
        </button>
        <button
          type="button"
          onClick={() => handleFocusPreset([32.5, 77.2], 10)}
          className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-highest hud-border font-mono text-[10px] text-outline hover:text-on-surface transition-colors"
        >
          GHEPANG GATH
        </button>
      </div>

      {/* Bottom Left: Map Legend */}
      <div className="absolute bottom-16 sm:bottom-6 left-3 sm:left-4 z-20 hidden md:block pointer-events-auto">
        <MapLegend />
      </div>

      {/* Bottom Right: Real-time Cursor Coordinates & Elevation HUD */}
      <div className="absolute bottom-16 sm:bottom-6 right-3 sm:right-4 z-20 pointer-events-auto">
        <MapCoordinateHud
          lat={cursorCoords.lat}
          lng={cursorCoords.lng}
          altM={cursorCoords.altM}
        />
      </div>

      {/* Top Right: Live Alert Overlay Strip */}
      <div className="absolute top-16 sm:top-4 right-3 sm:right-14 z-20 flex items-center gap-2 bg-critical/20 border border-critical/60 px-3 py-1.5 rounded-[4px] backdrop-blur-md shadow-lg pointer-events-auto max-w-[calc(100vw-30px)] sm:max-w-none">
        <span className="w-2 h-2 rounded-full bg-critical pulse-ping" />
        <span className="font-mono text-[10px] sm:text-[11px] text-critical font-bold uppercase tracking-wider">
          {language === 'hi' ? 'लाइव: साउथ ल्होनक L4 बांध विस्फोट खतरा सक्रिय' : 'LIVE: SOUTH LHONAK L4 BREACH HAZARD ACTIVE'}
        </span>
        <Link
          href="/alerts"
          className="ml-2 px-2 py-0.5 bg-critical/30 hover:bg-critical/50 text-white font-mono text-[9px] font-bold rounded transition-colors whitespace-nowrap"
        >
          {language === 'hi' ? 'डोज़ियर देखें →' : 'VIEW DOSSIER →'}
        </Link>
      </div>
    </div>
  );
};
