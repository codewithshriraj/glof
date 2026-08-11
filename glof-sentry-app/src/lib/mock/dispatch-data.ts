/**
 * Deterministic Emergency Dispatch & Response Teams Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic demonstration data for emergency response workflow testing.
 * Not connected to real emergency response teams or civil defence personnel.
 */

import { ResponseTeam, DispatchOrder, EvacuationZone } from '@/lib/types/glof';

export const mockResponseTeams: ResponseTeam[] = [
  {
    id: 'team-alpha',
    code: 'DEMO TEAM ALPHA',
    name: 'DEMO High Altitude Mountain Response Unit',
    unitType: 'MOUNTAIN_RESCUE',
    region: 'Chungthang Forward Staging Base',
    personnelCount: 18,
    status: 'DEPLOYED',
    priority: 'P1',
    etaMinutes: 25,
    lat: 27.6040,
    lng: 88.3890,
    equipment: ['Satellite Transceivers', 'Rope Rescue Kits', 'Helo Winch Gear', 'Field Drone SAR'],
  },
  {
    id: 'team-bravo',
    code: 'DEMO TEAM BRAVO',
    name: 'DEMO District Response Operations Cell',
    unitType: 'DISTRICT_EMERGENCY',
    region: 'Mangan Forward Station',
    personnelCount: 32,
    status: 'EN_ROUTE',
    priority: 'P1',
    etaMinutes: 45,
    lat: 27.5110,
    lng: 88.4520,
    equipment: ['Acoustic Siren Towers', 'Public Address Trucks', 'Inundation Barriers', 'Emergency Radios'],
  },
  {
    id: 'team-charlie',
    code: 'DEMO TEAM CHARLIE',
    name: 'DEMO Rapid Cryo-Medical Unit',
    unitType: 'MEDICAL_UNIT',
    region: 'DEMO Medical Staging Station',
    personnelCount: 14,
    status: 'STANDBY',
    priority: 'P2',
    etaMinutes: 60,
    lat: 27.3500,
    lng: 88.5120,
    equipment: ['Mobile Trauma Kits', 'Hypothermia Warmers', 'Field Triage Tents', 'Ambulance Vans'],
  },
  {
    id: 'team-delta',
    code: 'DEMO TEAM DELTA',
    name: 'DEMO Search & Rescue Taskforce Delta',
    unitType: 'SEARCH_AND_RESCUE',
    region: 'Dikchu Demonstration Staging Area',
    personnelCount: 45,
    status: 'AVAILABLE',
    priority: 'P1',
    etaMinutes: 90,
    lat: 27.4210,
    lng: 88.4890,
    equipment: ['Inflatable Zodiac Boats', 'Structural Acoustic Sounders', 'Heavy Winches', 'Night-Vision Optics'],
  },
  {
    id: 'team-echo',
    code: 'DEMO TEAM ECHO',
    name: 'DEMO Hydro-Dam Engineering Taskforce',
    unitType: 'DAM_ENGINEERING',
    region: 'Teesta Stage III Hydro Control Point',
    personnelCount: 12,
    status: 'ON_SCENE',
    priority: 'P1',
    etaMinutes: 10,
    lat: 27.6040,
    lng: 88.3890,
    equipment: ['Spillway Sluice Actuators', 'Pressure Telemetry Kits', 'Backup Diesel Generators'],
  },
];

export const mockActiveDispatchOrders: DispatchOrder[] = [
  {
    id: 'DSP-2026-044',
    alertId: 'ALT-014-2026-0087',
    incidentTitle: 'DEMO SOUTH LHONAK PROGLACIAL SURGE // SECTOR 1 EVACUATION SCENARIO',
    targetSector: 'Teesta Upper Valley (Chungthang to Mangan Corridor)',
    severity: 'L4',
    assignedTeamIds: ['team-alpha', 'team-bravo', 'team-echo'],
    evacuationPriority: 'IMMEDIATE',
    authorizedBy: 'DEMO SEOC / CHIEF CONTROLLER (DEMO OPS-04)',
    timestampUTC: '14:30:20 UTC',
    status: 'EN_ROUTE',
    affectedPopulation: 14200,
  },
];

export const mockEvacuationZones: EvacuationZone[] = [
  {
    id: 'zone-sec-1',
    name: 'Demo Sector 1 // Chungthang Inundation Gorge',
    sector: 'North Sikkim (Upper Basin)',
    tier: 'RED_EXCLUSION',
    population: 3400,
    estimatedLeadTime: 'T+2.5h (Simulated Lead Time)',
    evacuationRoute: 'Simulated Route: Arithang Ridge Path → Demonstration Muster Point Alpha',
    status: 'DEMO_EVACUATION_SCENARIO',
  },
  {
    id: 'zone-sec-2',
    name: 'Demo Sector 2 // Mangan Riparian Corridor',
    sector: 'North Sikkim (Mid Basin)',
    tier: 'AMBER_HAZARD',
    population: 6800,
    estimatedLeadTime: 'T+4.0h (Simulated Lead Time)',
    evacuationRoute: 'Simulated Route: Mangan Upper Bypass → Demonstration Muster Point Bravo',
    status: 'HIGH_PREPAREDNESS',
  },
  {
    id: 'zone-sec-3',
    name: 'Demo Sector 3 // Dikchu Station Corridor',
    sector: 'East Sikkim (Lower Gorge)',
    tier: 'GREEN_MUSTER',
    population: 4000,
    estimatedLeadTime: 'T+8.5h (Simulated Lead Time)',
    evacuationRoute: 'Simulated Route: Left Bank Access Trail → Demonstration Safe Shelter Point',
    status: 'SAFE_ZONE',
  },
];
