/**
 * Deterministic Simulation & Hydrodynamic Breach Datasets for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic demonstration scenarios for interface and emergency workflow demonstration.
 * Not an operational hydrologic forecast or verified physical simulation.
 */

import { BreachSimulationScenario, BreachHydrographPoint, ScenarioFactorContribution } from '@/lib/types/glof';

// Predefined Deterministic Breach Scenarios
export const mockBreachScenarios: Record<string, BreachSimulationScenario> = {
  baseline: {
    id: 'baseline',
    name: 'BASELINE // NO ACTIVE BREACH',
    description: 'Controlled proglacial discharge through natural moraine spillway with no dam failure.',
    breachWidthM: 10,
    breachDepthM: 2.5,
    initialVolumeMCM: 68.4,
    durationMin: 180,
    peakDischargeM3s: 1850,
    timeToPeakMin: 75,
    maxDownstreamDepthM: 3.2,
    flowVelocityMs: 3.8,
    inundationAreaKm2: 8.4,
    arrivalChungthang: 'T+5.5h',
    arrivalMangan: 'T+8.0h',
    arrivalDikchu: 'T+14.0h',
    riskTier: 'L1',
  },
  moderate: {
    id: 'moderate',
    name: 'SCENARIO B // PARTIAL MORAINE NOTCH',
    description: 'Seepage-induced piping leading to a 25m wide breach notch in the eastern lateral moraine.',
    breachWidthM: 25,
    breachDepthM: 6.0,
    initialVolumeMCM: 68.4,
    durationMin: 180,
    peakDischargeM3s: 6400,
    timeToPeakMin: 50,
    maxDownstreamDepthM: 8.4,
    flowVelocityMs: 6.2,
    inundationAreaKm2: 21.6,
    arrivalChungthang: 'T+3.8h',
    arrivalMangan: 'T+5.5h',
    arrivalDikchu: 'T+10.5h',
    riskTier: 'L2',
  },
  high: {
    id: 'high',
    name: 'SCENARIO C // FULL MORAINE FAILURE',
    description: 'Rapid retrogressive slope failure and overtopping wave triggering a 45m dam breach.',
    breachWidthM: 45,
    breachDepthM: 12.0,
    initialVolumeMCM: 68.4,
    durationMin: 180,
    peakDischargeM3s: 14200,
    timeToPeakMin: 38,
    maxDownstreamDepthM: 18.5,
    flowVelocityMs: 9.4,
    inundationAreaKm2: 42.8,
    arrivalChungthang: 'T+2.5h',
    arrivalMangan: 'T+4.0h',
    arrivalDikchu: 'T+8.5h',
    riskTier: 'L4',
  },
  extreme: {
    id: 'extreme',
    name: 'SCENARIO D // CASCADING ICE-AVALANCHE',
    description: 'High-magnitude rock-ice avalanche displacing 18M m³ of water with instantaneous 60m dam breach.',
    breachWidthM: 60,
    breachDepthM: 18.0,
    initialVolumeMCM: 68.4,
    durationMin: 180,
    peakDischargeM3s: 22800,
    timeToPeakMin: 22,
    maxDownstreamDepthM: 26.0,
    flowVelocityMs: 13.5,
    inundationAreaKm2: 68.2,
    arrivalChungthang: 'T+1.4h',
    arrivalMangan: 'T+2.8h',
    arrivalDikchu: 'T+6.0h',
    riskTier: 'L4',
  },
};

// Deterministic Hydrograph Generator based on width, depth, and volume
export function calculateBreachHydrograph(
  widthM: number,
  depthM: number,
  volumeMCM: number = 68.4,
  durationMin: number = 180
): {
  peakDischargeM3s: number;
  timeToPeakMin: number;
  maxDepthM: number;
  flowVelocityMs: number;
  inundationAreaKm2: number;
  points: BreachHydrographPoint[];
} {
  // Deterministic Froehlich/MacDonald-Langridge style breach discharge approximation
  const peakDischarge = Math.round(3.1 * Math.pow(volumeMCM * 1000000, 0.295) * Math.pow(depthM, 1.24) * (widthM / 30));
  const timeToPeak = Math.max(15, Math.round(65 - (widthM * 0.5) - (depthM * 1.2)));
  const maxDepth = Number((depthM * 1.35 + (widthM * 0.08)).toFixed(1));
  const flowVelocity = Number((Math.sqrt(depthM * 9.81) * 0.9 + (widthM * 0.05)).toFixed(1));
  const inundationArea = Number(((peakDischarge / 320) * 0.95).toFixed(1));

  const steps = [0, 10, 20, 30, 40, 50, 60, 75, 90, 105, 120, 140, 160, 180];
  const points: BreachHydrographPoint[] = steps.map((t) => {
    let q = 0;
    if (t <= timeToPeak) {
      // Rising limb (power curve)
      const ratio = t / timeToPeak;
      q = Math.round(peakDischarge * Math.pow(ratio, 1.8));
    } else {
      // Receding limb (exponential decay)
      const decayTime = t - timeToPeak;
      const decayFactor = Math.exp(-decayTime / 45);
      q = Math.round(peakDischarge * decayFactor);
    }
    const waterLvl = Math.max(5210, Math.round(5240 - (t / durationMin) * depthM));
    return {
      timeMin: t,
      dischargeM3s: Math.max(150, q),
      waterLevelM: waterLvl,
    };
  });

  return {
    peakDischargeM3s: peakDischarge,
    timeToPeakMin: timeToPeak,
    maxDepthM: maxDepth,
    flowVelocityMs: flowVelocity,
    inundationAreaKm2: inundationArea,
    points,
  };
}

// Downstream Impact Nodes & Evacuation Milestones
export const mockDownstreamImpactNodes = [
  {
    id: 'node-sl',
    name: 'South Lhonak Moraine Dam',
    chainageKm: '0.0 km',
    arrivalLeadTime: 'T+0.0h',
    peakArrival: 'T+0.6h',
    peakDischargeM3s: '14,200 m³/s',
    estimatedFloodDepth: '18.5 m',
    severity: 'CRITICAL',
    evacuationStatus: 'IMMEDIATE',
  },
  {
    id: 'node-lc',
    name: 'Lachen Confluence Station',
    chainageKm: '18.4 km',
    arrivalLeadTime: 'T+1.2h',
    peakArrival: 'T+1.8h',
    peakDischargeM3s: '12,800 m³/s',
    estimatedFloodDepth: '14.2 m',
    severity: 'CRITICAL',
    evacuationStatus: 'IN PROGRESS',
  },
  {
    id: 'node-ct',
    name: 'Chungthang Hydro Dam Site',
    chainageKm: '42.0 km',
    arrivalLeadTime: 'T+2.5h',
    peakArrival: 'T+3.2h',
    peakDischargeM3s: '10,900 m³/s',
    estimatedFloodDepth: '11.8 m',
    severity: 'CRITICAL',
    evacuationStatus: 'GATES OPEN // RED',
  },
  {
    id: 'node-mg',
    name: 'Mangan District Headquarters',
    chainageKm: '68.5 km',
    arrivalLeadTime: 'T+4.0h',
    peakArrival: 'T+5.1h',
    peakDischargeM3s: '8,400 m³/s',
    estimatedFloodDepth: '8.4 m',
    severity: 'HIGH',
    evacuationStatus: 'SIRENS ACTIVE',
  },
  {
    id: 'node-dk',
    name: 'Dikchu Stage V Powerhouse',
    chainageKm: '94.2 km',
    arrivalLeadTime: 'T+8.5h',
    peakArrival: 'T+10.2h',
    peakDischargeM3s: '6,200 m³/s',
    estimatedFloodDepth: '5.6 m',
    severity: 'MODERATE',
    evacuationStatus: 'STANDBY',
  },
  {
    id: 'node-sg',
    name: 'Singtam Highway Bridge',
    chainageKm: '118.0 km',
    arrivalLeadTime: 'T+12.0h',
    peakArrival: 'T+14.5h',
    peakDischargeM3s: '4,800 m³/s',
    estimatedFloodDepth: '3.8 m',
    severity: 'WATCH',
    evacuationStatus: 'MONITORING',
  },
];

// Explainable Risk Factor Contributions for Scenario C
export const mockScenarioFactorContributions: ScenarioFactorContribution[] = [
  {
    factor: 'Lake Water Storage Volume (68.4 MCM)',
    weightPct: 34,
    contributionValue: '+0.278 GSI',
    severity: 'CRITICAL',
    barColor: 'critical',
  },
  {
    factor: 'Freeboard Deficit (< 5.0m safety threshold)',
    weightPct: 26,
    contributionValue: '+0.212 GSI',
    severity: 'CRITICAL',
    barColor: 'critical',
  },
  {
    factor: 'Buried Ice-Core Degradation (62% void index)',
    weightPct: 18,
    contributionValue: '+0.148 GSI',
    severity: 'HIGH',
    barColor: 'warning',
  },
  {
    factor: 'Surface Area YoY Expansion (+18.4%)',
    weightPct: 12,
    contributionValue: '+0.098 GSI',
    severity: 'MODERATE',
    barColor: 'secondary',
  },
  {
    factor: 'Seismic Peak Ground Acceleration (0.24g buffer)',
    weightPct: 6,
    contributionValue: '+0.052 GSI',
    severity: 'LOW',
    barColor: 'primary',
  },
  {
    factor: 'Seepage Flow Accelerance (0.41 Index)',
    weightPct: 4,
    contributionValue: '+0.028 GSI',
    severity: 'LOW',
    barColor: 'primary',
  },
];
