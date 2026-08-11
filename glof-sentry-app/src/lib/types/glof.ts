/**
 * GLOF Sentry Master Types & Domain Models
 */

export type RiskLevel = 'L1' | 'L2' | 'L3' | 'L4';
export type RiskStatus = 'NOMINAL' | 'ADVISORY' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'ELEVATED' | 'HIGH RISK' | 'MODERATE';
export type SensorStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'CALIBRATING';
export type AgencyCode = 'ISRO' | 'IMD' | 'CWC' | 'NDMA' | 'USGS' | 'SDMA';
export type LogLevel = 'INFO' | 'WARN' | 'ERR' | 'CRIT';

export type AlertSeverity = 'L1' | 'L2' | 'L3' | 'L4';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'ASSESSING' | 'ESCALATED' | 'DISPATCHED' | 'RESOLVED';
export type AlertType =
  | 'GLOF RISK ESCALATION'
  | 'RAPID LAKE EXPANSION'
  | 'MORAINE INSTABILITY'
  | 'ABNORMAL WATER LEVEL'
  | 'SEISMIC ACTIVITY'
  | 'BREACH SCENARIO TRIGGER'
  | 'INUNDATION THREAT';

export interface GlacialLake {
  id: string;
  slug: string;                  // e.g. "south-lhonak"
  code: string;                  // e.g. "SITE 014"
  name: string;                  // e.g. "South Lhonak Lake"
  basin: string;                 // e.g. "Teesta River Basin"
  region: string;                // e.g. "North Sikkim, India"
  coordinates: {
    lat: number;
    lng: number;
    elevationM: number;
    formatted: string;           // e.g. "27°54'N 88°12'E"
  };
  surfaceAreaKm2: number;        // Current surface area
  previousAreaKm2: number;       // Previous satellite baseline
  areaExpansionPct: number;      // e.g. +1.4%
  yoyExpansionPct: number;       // e.g. +18.4% YoY
  estimatedVolumeMCM: number;    // Million Cubic Meters
  freeboardM: number;            // Distance from crest to water level
  moraineDamStabilityScore: number; // 0.0 - 1.0
  iceCoreDegradationPct: number; // e.g. 62%
  seepageIndex: number;          // e.g. 0.41
  riskScore: number;             // Composite risk score 0.000 - 1.000
  riskLevel: RiskLevel;          // L1 to L4
  riskStatus: RiskStatus;
  lastSatellitePassUTC: string;
  satelliteSource: string;       // e.g. "Sentinel-2 L2A / Landsat-9"
  sensorsCount: number;
  activeAlertsCount: number;
  aiRiskDrivers?: {
    factor: string;
    weight: string;
    impactScore: number;
  }[];
}

export interface SensorDevice {
  id: string;
  code: string;                  // e.g. "WL-ACOUSTIC-04"
  name: string;
  type: 'WATER_LEVEL' | 'WEATHER_STATION' | 'SEISMIC' | 'PIEZOMETER' | 'CAMERA_SAR';
  lakeId: string;
  lakeName: string;
  lat: number;
  lng: number;
  batteryPct: number;
  signalDbm: number;
  uplinkType: 'IRIDIUM_SATELLITE' | 'LORA_WAN' | 'CELLULAR_4G';
  status: SensorStatus;
  lastPingUTC: string;
  currentReading: {
    value: number;
    unit: string;
    rateOfChangePerHr?: number;
  };
}

export interface LakeSensorStation {
  id: string;
  code: string;
  name: string;
  category: 'WATER_LEVEL' | 'WEATHER' | 'DEFORMATION' | 'SEISMIC' | 'THERMAL' | 'CAMERA_SAR';
  status: SensorStatus;
  lastReading: string;
  numericValue: number;
  unit: string;
  timestampUTC: string;
  signalQualityPct: number;
  batteryPct: number;
}

export interface LakeHistoricalMetricPoint {
  dateLabel: string;
  surfaceAreaKm2: number;
  waterLevelM: number;
  freeboardM: number;
  expansionRatePct: number;
  temperatureAnomalyC: number;
  seepageIndex: number;
}

export interface BathymetryDepthBand {
  zoneLabel: string;
  depthRangeM: string;
  areaCoveragePct: number;
  estimatedVolumeMCM: number;
  colorClass: string;
}

export interface BreachSimulationScenario {
  id: 'baseline' | 'moderate' | 'high' | 'extreme';
  name: string;
  description: string;
  breachWidthM: number;
  breachDepthM: number;
  initialVolumeMCM: number;
  durationMin: number;
  peakDischargeM3s: number;
  timeToPeakMin: number;
  maxDownstreamDepthM: number;
  flowVelocityMs: number;
  inundationAreaKm2: number;
  arrivalChungthang: string;
  arrivalMangan: string;
  arrivalDikchu: string;
  riskTier: RiskLevel;
}

export interface BreachHydrographPoint {
  timeMin: number;
  dischargeM3s: number;
  waterLevelM: number;
}

export interface BacktestEvent {
  id: string;
  name: string;
  region: string;
  eventDate: string;
  triggerType: string;
  observedPeakDischargeM3s: number;
  predictedPeakDischargeM3s: number;
  errorMarginPct: number;
  status: 'MATCH' | 'PARTIAL' | 'MISS';
  leadTimeHours: number;
  lakeVolumeMCM: number;
}

export interface BacktestScorecard {
  precision: number;
  recall: number;
  f1Score: number;
  scenarioMatchRatePct: number;
  falseAlarmRatePct: number;
  missRatePct: number;
  meanTimingErrorMin: number;
}

export interface ScenarioFactorContribution {
  factor: string;
  weightPct: number;
  contributionValue: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  barColor: 'critical' | 'warning' | 'secondary' | 'primary';
}

export interface OperationalAlert {
  id: string;                    // e.g. "ALT-014-2026-0087"
  lakeId: string;
  lakeCode: string;              // e.g. "SITE 014"
  lakeName: string;              // e.g. "South Lhonak Lake"
  region: string;                // e.g. "North Sikkim"
  severity: AlertSeverity;       // L1 to L4
  type: AlertType;
  title: string;
  triggerCondition: string;
  createdAtUTC: string;
  status: AlertStatus;
  assignedOperator: string;
  assignedTeamId?: string;
  operatorNote?: string;
  evidence: {
    satellitePass: string;
    sensorAnomaly: string;
    simulationDischarge: string;
    riskFactor: string;
  };
}

export interface AlertTimelineEvent {
  id: string;
  alertId: string;
  timestampUTC: string;
  actor: string;                 // e.g. "SYSTEM", "DEMO OPS-04", "DEMO ANALYST-02", "DEMO DISPATCH"
  action: string;                // e.g. "ALERT GENERATED", "ACKNOWLEDGED", "ESCALATED"
  details: string;
  severity: 'info' | 'warn' | 'critical';
}

export type UnitType = 'MOUNTAIN_RESCUE' | 'DISTRICT_EMERGENCY' | 'MEDICAL_UNIT' | 'SEARCH_AND_RESCUE' | 'DAM_ENGINEERING';
export type TeamStatus = 'AVAILABLE' | 'ASSIGNED' | 'DEPLOYED' | 'EN_ROUTE' | 'ON_SCENE' | 'STANDBY';

export interface ResponseTeam {
  id: string;                    // e.g. "team-alpha"
  code: string;                  // e.g. "TEAM ALPHA"
  name: string;                  // e.g. "DEMO High Altitude Mountain Response Unit"
  unitType: UnitType;
  region: string;                // e.g. "Chungthang Forward Staging Base"
  personnelCount: number;
  status: TeamStatus;
  priority: 'P1' | 'P2' | 'P3';
  etaMinutes: number;
  lat: number;
  lng: number;
  equipment: string[];
}

export type DispatchStatus =
  | 'UNASSIGNED'
  | 'TEAM_SELECTED'
  | 'DISPATCH_QUEUED'
  | 'DISPATCHED'
  | 'ACKNOWLEDGED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'STANDBY'
  | 'RESOLVED';

export interface DispatchOrder {
  id: string;                    // e.g. "DSP-2026-044"
  alertId: string;
  incidentTitle: string;
  targetSector: string;          // e.g. "Teesta Upper Valley Sector 1"
  severity: AlertSeverity;
  assignedTeamIds: string[];
  evacuationPriority: 'IMMEDIATE' | 'HIGH' | 'PRECAUTIONARY';
  authorizedBy: string;
  timestampUTC: string;
  status: DispatchStatus;
  affectedPopulation: number;
}

export type NotificationChannel = 'SMS' | 'EMAIL' | 'MOBILE_PUSH' | 'WEB_ALERT' | 'RADIO' | 'PUBLIC_DISPLAY';

export interface NotificationDelivery {
  id: string;                    // e.g. "MSG-2026-1029"
  channel: NotificationChannel;
  targetAudience: string;
  messageText: string;
  recipientCount: number;
  sentTimestampUTC: string;
  status: 'SIMULATED / DELIVERED' | 'SIMULATED / QUEUED' | 'SIMULATED / ACTIVE' | 'SIMULATED / ACKNOWLEDGED';
  ackRatePct: number;
  retryCount: number;
}

export interface EvacuationZone {
  id: string;
  name: string;
  sector: string;
  tier: 'RED_EXCLUSION' | 'AMBER_HAZARD' | 'GREEN_MUSTER';
  population: number;
  estimatedLeadTime: string;
  evacuationRoute: string;
  status: 'DEMO_EVACUATION_SCENARIO' | 'HIGH_PREPAREDNESS' | 'SAFE_ZONE';
}

export interface AlertDispatch {
  id: string;
  alertNumber: string;
  lakeId: string;
  lakeName: string;
  lakeCode: string;
  severity: RiskLevel;
  severityLabel: RiskStatus;
  title: string;
  description: string;
  timestampUTC: string;
  authorizingAgency: AgencyCode;
  impactZones: string[];
  timeToFirstImpactHours: number;
  estimatedDischargeM3s: number;
  channels: ('SMS' | 'SIREN' | 'CELL_BROADCAST' | 'RADIO' | 'CAP_FEED')[];
  status: 'DRAFT' | 'TRANSMITTED' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface SystemTelemetry {
  utcTime: string;
  status: 'NOMINAL' | 'DEGRADED' | 'ELEVATED_RISK';
  nationalRiskIndex: number;
  activeAlertSitesCount: number;
  lakesUnderWatchCount: number;
  avgLakeExpansionPct: number;
  satelliteArrayStatus: SensorStatus;
  sensorGridStatus: SensorStatus;
  dataPipelineUptimePct: number;
  totalActiveNodes: number;
}

export interface OperationalComponentStatus {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: SensorStatus;
  latencyMs: number;
  loadPct: number;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface RegionalRiskMetric {
  region: string;
  score: number;
  status: RiskStatus;
  statusColor: 'critical' | 'secondary' | 'primary' | 'outline';
  icon?: string;
  coordinatesOnMatrix: { xPct: number; yPct: number };
  lakesCount?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
}

// ==========================================
// PHASE 6 DOMAIN MODELS & TYPES
// ==========================================

export interface SatellitePassInfo {
  id: string;
  name: string;                  // e.g. "Sentinel-1A [SAR]"
  sensorType: 'SAR' | 'OPTICAL' | 'TIR' | 'ALTIMETRY';
  orbitType: 'SUN_SYNCHRONOUS' | 'POLAR_LEO' | 'GEOSTATIONARY';
  status: 'ACTIVE_NOMINAL' | 'STANDBY_ORBIT' | 'CALIBRATING' | 'TASKED';
  nextPassUTC: string;
  tMinus: string;                // e.g. "01h 14m 32s"
  pipelineStage: string;         // e.g. "L0 -> L1 -> L2A"
  pipelineProgressPct: number;   // 0 - 100
  agreementPct: number;          // Correlation score
  resolutionM: number;
  cloudObscurationPct: number;
  swathWidthKm: number;
  spectralBands: string[];
}

export interface SensorFleetNode {
  id: string;                    // e.g. "SN-014-WL-01"
  code: string;                  // e.g. "WL-ACOUSTIC-04"
  name: string;
  category: 'WATER_LEVEL' | 'WEATHER' | 'DEFORMATION' | 'SEISMIC' | 'THERMAL';
  lakeId: string;
  lakeName: string;
  region: string;
  status: SensorStatus;
  batteryPct: number;
  signalDbm: number;
  uplinkType: 'IRIDIUM_SATELLITE' | 'LORA_WAN' | 'CELLULAR_4G';
  samplingIntervalSec: number;
  lastReading: string;
  numericValue: number;
  unit: string;
  lastPingUTC: string;
  lastCalibrationDate: string;
  firmwareVersion: string;
  packetLossPct: number;
  rawPacketSample: string;
}

export interface ModelAuditEntry {
  id: string;                    // e.g. "GSI-AUD-2026-0891"
  timestampUTC: string;
  lakeId: string;
  lakeName: string;
  modelVersion: string;          // e.g. "GSI-Himalaya-v4.2.1-Ensemble"
  compositeRiskScore: number;
  riskTier: RiskLevel;
  primaryDriver: string;
  confidencePct: number;
  executionTimeMs: number;
  factorContributions: {
    factor: string;
    weightPct: number;
    value: string;
    direction: 'INCREASING' | 'NEUTRAL' | 'DECREASING';
  }[];
}

export interface PlatformAuditRecord {
  id: string;                    // e.g. "AUD-2026-1044"
  timestampUTC: string;
  actor: string;                 // e.g. "DEMO OPS-04 (Lead Controller)"
  action: string;                // e.g. "DISPATCH_TRANSMIT", "CALIBRATION_TRIGGER", "ALERT_ACK"
  targetResource: string;        // e.g. "SITE 014 // South Lhonak", "SN-014-WL-01"
  originEndpoint: string;        // Synthetic demo origin e.g. "DEMO SEOC NOC (TERMINAL 04)"
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface ReportExportRequest {
  id: string;                    // e.g. "RPT-2026-014-A"
  title: string;
  lakeId: string;
  lakeName: string;
  reportType: 'INCIDENT_DOSSIER' | 'BATHYMETRY_ANALYSIS' | 'BREACH_SIMULATION' | 'CAP_WARNING_PACKAGE';
  format: 'PDF' | 'CAP_XML' | 'GEOJSON' | 'CSV';
  generatedAtUTC: string;
  fileSizeKB: number;
  classification: 'DEMO / SYNTHETIC REPORT' | 'OFFICIAL_SIMULATION';
  downloadUrl: string;
  status: 'READY' | 'GENERATING' | 'QUEUED';
}

export interface GsiBreakdownFactor {
  name: string;
  weightPct: number;
  score: number;
  statusColor: 'secondary' | 'error' | 'primary';
}

// ==========================================
// PHASE 7 DOMAIN MODELS & TYPES
// ==========================================

export interface AgencyConnector {
  id: string;                    // e.g. "CONN-ISRO-01"
  name: string;                  // e.g. "ISRO Bhuvan (Satellite)"
  agency: 'ISRO' | 'CWC' | 'IMD' | 'ESA_SENTINEL' | 'USGS';
  category: 'SATELLITE_SAR' | 'HYDROLOGY' | 'METEOROLOGY' | 'THERMAL_IR';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'SYNCING';
  latencyMs: number;
  syncRatePct: number;
  lastSyncUTC: string;
  activeKeyMasked: string;
  dataFeedUrl: string;
  protocol: 'REST_GEOJSON' | 'WMS_OGC' | 'MQTT_TELEMETRY' | 'FTP_BINARY';
  packetThroughputKBs: number;
  description: string;
}

export interface SystemConfigState {
  amberThreshold: number;        // e.g. 0.600
  redThreshold: number;          // e.g. 0.800
  freeboardWeightPct: number;    // e.g. 26
  expansionWeightPct: number;    // e.g. 22
  seepageWeightPct: number;      // e.g. 20
  iceCoreWeightPct: number;      // e.g. 18
  slopeWeightPct: number;        // e.g. 14
  capPollingIntervalSec: number; // e.g. 10
  maxRetryAttempts: number;      // e.g. 3
  failoverMode: 'PRIMARY_SEOC_ACTIVE' | 'SECONDARY_FIELD_NOC' | 'HOT_STANDBY';
  autoEscalationEnabled: boolean;
  lastCommittedUTC: string;
}

export interface UserOperatorAccount {
  id: string;                    // e.g. "USR-OPS-04"
  callsign: string;              // e.g. "DEMO OPS-04"
  name: string;                  // e.g. "Cmdr. Rajesh Verma (Demo)"
  role: 'LEAD_CONTROLLER' | 'HYDROLOGIST' | 'FIELD_COORDINATOR' | 'GIS_ANALYST';
  jurisdiction: string;          // e.g. "Sector 1 (North Sikkim & Teesta Basin)"
  status: 'ACTIVE' | 'STANDBY' | 'OFF_DUTY';
  mfaEnabled: boolean;
  lastActiveUTC: string;
}
