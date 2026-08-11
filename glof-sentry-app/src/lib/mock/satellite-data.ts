/**
 * Deterministic Satellite Intelligence & Earth Observation Fusion Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic orbital passes and multi-spectral telemetry data for demonstration testing.
 */

import { SatellitePassInfo } from '@/lib/types/glof';

export const mockSatellitePasses: SatellitePassInfo[] = [
  {
    id: 'SAT-S1A',
    name: 'SENTINEL-1A [SAR C-BAND]',
    sensorType: 'SAR',
    orbitType: 'SUN_SYNCHRONOUS',
    status: 'ACTIVE_NOMINAL',
    nextPassUTC: '15:45:00 UTC',
    tMinus: '01h 14m 32s',
    pipelineStage: 'L0 -> L1 -> L2A (InSAR Surface Deformation)',
    pipelineProgressPct: 100,
    agreementPct: 98.2,
    resolutionM: 10.0,
    cloudObscurationPct: 0.0, // SAR penetrates clouds
    swathWidthKm: 250,
    spectralBands: ['VV (Co-pol)', 'VH (Cross-pol)', 'Interferometric Phase'],
  },
  {
    id: 'SAT-S2B',
    name: 'SENTINEL-2B [MULTI-SPECTRAL OPTICAL]',
    sensorType: 'OPTICAL',
    orbitType: 'SUN_SYNCHRONOUS',
    status: 'ACTIVE_NOMINAL',
    nextPassUTC: '18:52:40 UTC',
    tMinus: '04h 22m 10s',
    pipelineStage: 'L0 -> L1C -> L2A (Atmospherically Corrected)',
    pipelineProgressPct: 65,
    agreementPct: 94.2,
    resolutionM: 10.0,
    cloudObscurationPct: 34.5,
    swathWidthKm: 290,
    spectralBands: ['B2 Blue', 'B3 Green', 'B4 Red', 'B8 NIR', 'B11 SWIR-1', 'B12 SWIR-2'],
  },
  {
    id: 'SAT-L9',
    name: 'LANDSAT-9 [OLI-2 / TIRS-2]',
    sensorType: 'TIR',
    orbitType: 'SUN_SYNCHRONOUS',
    status: 'STANDBY_ORBIT',
    nextPassUTC: '02:35:15 UTC',
    tMinus: '12h 05m 45s',
    pipelineStage: 'L1TP -> L2SP (Surface Temperature Anomaly)',
    pipelineProgressPct: 15,
    agreementPct: 91.8,
    resolutionM: 30.0,
    cloudObscurationPct: 42.0,
    swathWidthKm: 185,
    spectralBands: ['Band 4 Red', 'Band 5 NIR', 'Band 10 Thermal Infrared'],
  },
  {
    id: 'SAT-RISAT',
    name: 'RISAT-1A (EOS-04) [ISRO C-BAND SAR]',
    sensorType: 'SAR',
    orbitType: 'POLAR_LEO',
    status: 'ACTIVE_NOMINAL',
    nextPassUTC: '21:10:00 UTC',
    tMinus: '06h 40m 30s',
    pipelineStage: 'RAW -> SLC -> GEO (High Resolution Swath)',
    pipelineProgressPct: 85,
    agreementPct: 96.5,
    resolutionM: 3.0,
    cloudObscurationPct: 0.0,
    swathWidthKm: 50,
    spectralBands: ['HH', 'HV', 'Circular Hybrid Pol'],
  },
];

export const mockCloudObscurationSectors = [
  { sector: 'Sector 1 (Upper Teesta / North Sikkim)', obscurationPct: 87, status: 'HIGH_OBSCURATION', note: 'Optical degraded. SAR telemetry primary.' },
  { sector: 'Sector 2 (Chandra Basin / Himachal)', obscurationPct: 45, status: 'MODERATE_OBSCURATION', note: 'Clear optical windows available.' },
  { sector: 'Sector 3 (Khumbu / Everest Sector)', obscurationPct: 12, status: 'CLEAR_SKY', note: 'Optimal optical multispectral conditions.' },
  { sector: 'Sector 4 (Zanskar / Ladakh)', obscurationPct: 5, status: 'CLEAR_SKY', note: 'Nominal satellite pass clarity.' },
];

export const mockSpectralIndices = [
  { index: 'NDWI (Normalized Difference Water Index)', value: '+0.74', baseline: '+0.68', interpretation: 'Perimeter Water Expansion Detected (+8.8%)' },
  { index: 'NDSI (Normalized Difference Snow Index)', value: '+0.82', baseline: '+0.85', interpretation: 'Glacial Melt Boundary Retreated 4.2m' },
  { index: 'NDVI (Normalized Difference Veg Index)', value: '-0.18', baseline: '-0.16', interpretation: 'Debris-Covered Terminal Moraine Stable' },
  { index: 'InSAR Moraine Creep Rate', value: '+3.4 mm/mo', baseline: '+1.2 mm/mo', interpretation: 'Elevated Downslope Creep Velocity' },
];
