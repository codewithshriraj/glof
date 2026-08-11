/**
 * Deterministic Model & Platform Audit Trail Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic audit and model explainability records for demonstration testing.
 */

import { ModelAuditEntry, PlatformAuditRecord } from '@/lib/types/glof';

export const mockModelAuditEntries: ModelAuditEntry[] = [
  {
    id: 'GSI-AUD-2026-0891',
    timestampUTC: '14:22:15 UTC',
    lakeId: 'south-lhonak',
    lakeName: 'South Lhonak Lake (SITE 014)',
    modelVersion: 'GSI-Himalaya-v4.2.1-Ensemble (DEMO)',
    compositeRiskScore: 0.892,
    riskTier: 'L4',
    primaryDriver: 'Moraine Freeboard Deficit (<4.5m) + Seepage Spike (0.41)',
    confidencePct: 96.4,
    executionTimeMs: 42,
    factorContributions: [
      { factor: 'Moraine Freeboard Deficit', weightPct: 26, value: '4.2m (< 5.0m safety threshold)', direction: 'INCREASING' },
      { factor: 'YoY Surface Expansion', weightPct: 22, value: '+18.4% YoY (1.642 km²)', direction: 'INCREASING' },
      { factor: 'Acoustic Seepage Index', weightPct: 20, value: '0.41 (Elevated Baseline > 0.25)', direction: 'INCREASING' },
      { factor: 'Ice-Core Degradation', weightPct: 18, value: '62% Thawed Terminal Ridge', direction: 'INCREASING' },
      { factor: 'Downstream Slope Gradient', weightPct: 14, value: '18.4° Canyon Corridor', direction: 'NEUTRAL' },
    ],
  },
  {
    id: 'GSI-AUD-2026-0888',
    timestampUTC: '13:45:00 UTC',
    lakeId: 'ghepang-gath',
    lakeName: 'Ghepang Gath Lake (SITE 022)',
    modelVersion: 'GSI-Himalaya-v4.2.1-Ensemble (DEMO)',
    compositeRiskScore: 0.745,
    riskTier: 'L3',
    primaryDriver: 'Lateral Moraine Creep Rate (+4.8 mm/mo)',
    confidencePct: 92.1,
    executionTimeMs: 38,
    factorContributions: [
      { factor: 'Moraine Creep Velocity', weightPct: 32, value: '+4.8 mm/mo (Threshold > 3.0)', direction: 'INCREASING' },
      { factor: 'Pore Water Pressure', weightPct: 24, value: '142.8 kPa (Elevated)', direction: 'INCREASING' },
      { factor: 'Thermal Anomaly (Landsat TIR)', weightPct: 20, value: '+1.1°C Crest Anomaly', direction: 'INCREASING' },
      { factor: 'Lake Freeboard', weightPct: 14, value: '7.8m (Nominal)', direction: 'DECREASING' },
      { factor: 'Upstream Glacier Velocity', weightPct: 10, value: '12.4 m/yr Steady', direction: 'NEUTRAL' },
    ],
  },
  {
    id: 'GSI-AUD-2026-0880',
    timestampUTC: '11:10:20 UTC',
    lakeId: 'imja-tsho',
    lakeName: 'Imja Tsho (SITE 008)',
    modelVersion: 'GSI-Himalaya-v4.2.1-Ensemble (DEMO)',
    compositeRiskScore: 0.512,
    riskTier: 'L2',
    primaryDriver: 'Monsoon Inflow Stage Rise (+1.2m / 72h)',
    confidencePct: 94.8,
    executionTimeMs: 35,
    factorContributions: [
      { factor: 'Lake Storage Volume', weightPct: 35, value: '72.8 MCM Storage', direction: 'NEUTRAL' },
      { factor: 'Inflow Stage Surge', weightPct: 30, value: '+1.2m Elevation Gain', direction: 'INCREASING' },
      { factor: 'Spillway Channel Capacity', weightPct: 20, value: '1,850 m³/s Max Outflow', direction: 'DECREASING' },
      { factor: 'Dam Crest Stability', weightPct: 15, value: '0.82 Score (Nominal)', direction: 'DECREASING' },
    ],
  },
];

export const mockPlatformAuditRecords: PlatformAuditRecord[] = [
  {
    id: 'AUD-2026-1044',
    timestampUTC: '14:35:10 UTC',
    actor: 'DEMO OPS-04 (Lead Controller)',
    action: 'DISPATCH_ORDER_TRANSMIT',
    targetResource: 'DSP-2026-044 // Sector 1 Chungthang',
    originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
    status: 'SUCCESS',
    details: 'Transmitted simulated emergency dispatch order to Demo Teams Alpha, Bravo, Echo for Sector 1 corridor.',
  },
  {
    id: 'AUD-2026-1043',
    timestampUTC: '14:32:00 UTC',
    actor: 'DEMO OPS-04 (Lead Controller)',
    action: 'ALERT_STATUS_ESCALATED',
    targetResource: 'ALT-014-2026-0087 // South Lhonak',
    originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
    status: 'SUCCESS',
    details: 'Simulated escalation to Tier 4 Critical based on hydrodynamic solver peak discharge Qp ~ 14,200 m³/s.',
  },
  {
    id: 'AUD-2026-1042',
    timestampUTC: '14:31:02 UTC',
    actor: 'DEMO WARNING GATEWAY',
    action: 'MULTI_CHANNEL_SIMULATION_BROADCAST',
    targetResource: 'MSG-2026-1029 to MSG-2026-1033',
    originEndpoint: 'SIMULATOR GATEWAY (LOCAL)',
    status: 'SUCCESS',
    details: 'Simulated multi-channel broadcast across SMS, Mobile Push, VHF CAP Radio, and Warning Towers.',
  },
  {
    id: 'AUD-2026-1041',
    timestampUTC: '14:20:00 UTC',
    actor: 'SYSTEM // TELEMETRY WATCHDOG',
    action: 'SENSOR_NODE_CALIBRATION_TRIGGER',
    targetResource: 'SN-092-CAM-01 // Palcacocha',
    originEndpoint: 'INTERNAL DEMO IoT HUB',
    status: 'WARNING',
    details: 'Initiated simulated zero-offset re-calibration cycle for thermal camera sensor node.',
  },
  {
    id: 'AUD-2026-1040',
    timestampUTC: '14:15:20 UTC',
    actor: 'SYSTEM // ORBITAL INGEST',
    action: 'SATELLITE_PASS_PIPELINE_COMPLETE',
    targetResource: 'Sentinel-1A SAR Pass #4412 (DEMO)',
    originEndpoint: 'SYNTHETIC INGEST WORKER 02',
    status: 'SUCCESS',
    details: 'Ingested synthetic L2A SAR interferogram; agreement correlation verified at 98.2% across North Sikkim.',
  },
];
