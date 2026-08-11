/**
 * Deterministic Mock GeoJSON & Geospatial Layers for GLOF Sentry Live Risk Map
 * 
 * NOTE: These are synthetic demonstration coordinates & geometries representing
 * Himalayan glacial lake monitoring zones (South Lhonak, Imja Tsho, Ghepang Gath, Shako Cho).
 * They are purely for development & UI demonstration.
 */

export interface GeoJsonFeature<G = any, P = any> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJsonFeatureCollection<G = any, P = any> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<G, P>[];
}

// Teesta River Valley downstream breach inundation flow corridor (South Lhonak to Dikchu)
export const mockInundationCorridorGeoJson: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'inundation-main-path',
        name: 'South Lhonak Primary Breach Inundation Corridor',
        hazardTier: 'CRITICAL',
        estimatedPeakDischarge: '14,200 m³/s',
        arrivalChungthang: 'T+2.5h',
        arrivalMangan: 'T+4.0h',
        arrivalDikchu: 'T+8.5h',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [88.2045, 27.9158], // South Lhonak Lake (Toe)
          [88.2450, 27.8820], // Upper Teesta Gorge
          [88.3120, 27.8210], // Lachen Confluence
          [88.3890, 27.6040], // Chungthang Dam Site
          [88.4520, 27.5110], // Mangan Valley
          [88.4890, 27.4210], // Dikchu Hydro Stage
          [88.5120, 27.3500], // Singtam Bridge
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'inundation-hazard-polygon',
        name: 'High Impact Valley Inundation Polygon',
        depthM: '12.5 - 24.0 m',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.1900, 27.9250],
            [88.2200, 27.9050],
            [88.2700, 27.8500],
            [88.3400, 27.7800],
            [88.4100, 27.5900],
            [88.4700, 27.4900],
            [88.5000, 27.4000],
            [88.5300, 27.3400],
            [88.4900, 27.3400],
            [88.4500, 27.4100],
            [88.3900, 27.5200],
            [88.3300, 27.6500],
            [88.2700, 27.8100],
            [88.2100, 27.8900],
            [88.1800, 27.9200],
            [88.1900, 27.9250],
          ],
        ],
      },
    },
  ],
};

// Regional Glacial Hazard Iso-contour Buffers
export const mockHazardZonesGeoJson: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // South Lhonak L4 Critical Zone
    {
      type: 'Feature',
      properties: {
        lakeCode: 'SITE 014',
        name: 'South Lhonak Proglacial Risk Buffer',
        level: 'L4',
        color: '#ff6b6b',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.1800, 27.9300],
            [88.2300, 27.9300],
            [88.2300, 27.8900],
            [88.1800, 27.8900],
            [88.1800, 27.9300],
          ],
        ],
      },
    },
    // Ghepang Gath L3 Warning Zone
    {
      type: 'Feature',
      properties: {
        lakeCode: 'SITE 022',
        name: 'Ghepang Gath Moraine Risk Zone',
        level: 'L3',
        color: '#f59e0b',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.2400, 32.4950],
            [77.2900, 32.4950],
            [77.2900, 32.4650],
            [77.2400, 32.4650],
            [77.2400, 32.4950],
          ],
        ],
      },
    },
  ],
};

// Sensor Stations
export const mockSensorPoints = [
  { id: 'sens-sl-1', code: 'WL-04', name: 'Acoustic Stage Gauge', lat: 27.9162, lng: 88.2051, type: 'WATER_LEVEL' },
  { id: 'sens-sl-2', code: 'AWS-01', name: 'Automatic Weather Station', lat: 27.9185, lng: 88.2012, type: 'WEATHER' },
  { id: 'sens-ct-1', code: 'STAGE-CT', name: 'Chungthang Dam Gauge', lat: 27.6040, lng: 88.3890, type: 'DISCHARGE' },
  { id: 'sens-it-1', code: 'S-44', name: 'Imja Tsho Piezometer', lat: 27.9011, lng: 86.9247, type: 'PIEZOMETER' },
];
