/**
 * Deterministic Multi-Channel Warning & Delivery Simulation Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic demonstration data for warning workflow verification.
 * No real communication or emergency broadcast infrastructure is connected.
 */

import { NotificationDelivery } from '@/lib/types/glof';

export const mockMultilingualTemplates = {
  en: {
    language: 'EN // ENGLISH',
    charCount: 154,
    text: 'DEMO WARNING: Synthetic GLOF simulation active for South Lhonak demonstration site. This message is part of a software demonstration. Not an operational public warning.',
  },
  hi: {
    language: 'HI // HINDI (हिंदी)',
    charCount: 158,
    text: 'डेमो चेतावनी: दक्षिण ल्होनाक हिमनद झील का कृत्रिम अनुकरण। यह सॉफ्टवेयर परीक्षण हेतु डेमो संदेश है, वास्तविक सार्वजनिक चेतावनी नहीं।',
  },
  ne: {
    language: 'NE // NEPALI (नेपाली)',
    charCount: 155,
    text: 'डेमो चेतावनी: दक्षिण ल्होनाक तालको कृत्रिम सिमुलेशन। यो सफ्टवेयर परीक्षणका लागि डेमो सन्देश हो, वास्तविक सार्वजनिक चेतावनी होइन।',
  },
};

export const mockSimulatedDeliveries: NotificationDelivery[] = [
  {
    id: 'MSG-2026-1029',
    channel: 'SMS',
    targetAudience: 'Demo Regional Coordinators & Field Test Observers',
    messageText: 'DEMO WARNING: Simulated L4 GLOF breach escalation active for South Lhonak Sector 1 test scenario. Not an operational warning.',
    recipientCount: 1240,
    sentTimestampUTC: '14:31:02 UTC',
    status: 'SIMULATED / DELIVERED',
    ackRatePct: 98.4,
    retryCount: 0,
  },
  {
    id: 'MSG-2026-1030',
    channel: 'MOBILE_PUSH',
    targetAudience: 'Registered Emergency Coordinators & First Responders (Demo)',
    messageText: 'GLOF SENTRY DEMO ESCALATION // SITE 014: Hydrodynamic Scenario C active (Qp ~ 14,200 m³/s). Simulated workflow.',
    recipientCount: 450,
    sentTimestampUTC: '14:31:15 UTC',
    status: 'SIMULATED / DELIVERED',
    ackRatePct: 94.2,
    retryCount: 0,
  },
  {
    id: 'MSG-2026-1031',
    channel: 'RADIO',
    targetAudience: 'Demo Dam Telemetry Stations & Field Forward Observation Posts',
    messageText: 'ALL DEMO STATIONS // ALL DEMO STATIONS: CAP BROADCAST 014-ALPHA. SIMULATED FLOOD WAVE ESTIMATED T+2.5H AT CHUNGTHANG DAM.',
    recipientCount: 28,
    sentTimestampUTC: '14:31:40 UTC',
    status: 'SIMULATED / ACKNOWLEDGED',
    ackRatePct: 100.0,
    retryCount: 1,
  },
  {
    id: 'MSG-2026-1032',
    channel: 'PUBLIC_DISPLAY',
    targetAudience: 'Chungthang & Mangan Demonstration Warning Towers',
    messageText: 'HIGH-DECIBEL DEMO ACOUSTIC SEQUENCE // TIER 4 TEST BROADCAST',
    recipientCount: 6,
    sentTimestampUTC: '14:32:00 UTC',
    status: 'SIMULATED / ACTIVE',
    ackRatePct: 100.0,
    retryCount: 0,
  },
  {
    id: 'MSG-2026-1033',
    channel: 'EMAIL',
    targetAudience: 'Demo National Crisis Cell & Regional Hydrology Division',
    messageText: 'TECHNICAL INCIDENT BRIEFING (SIMULATION): South Lhonak Proglacial Breach Simulation Dossier & Inundation Flow Path Shapefiles.',
    recipientCount: 65,
    sentTimestampUTC: '14:32:10 UTC',
    status: 'SIMULATED / DELIVERED',
    ackRatePct: 92.0,
    retryCount: 0,
  },
];
