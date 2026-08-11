/**
 * Deterministic Operator Accounts & Jurisdiction Roster for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic operator accounts and jurisdiction matrix for demonstration testing.
 */

import { UserOperatorAccount } from '@/lib/types/glof';

export const mockOperatorAccounts: UserOperatorAccount[] = [
  {
    id: 'USR-OPS-04',
    callsign: 'DEMO OPS-04',
    name: 'Cmdr. Rajesh Verma (Demo Controller)',
    role: 'LEAD_CONTROLLER',
    jurisdiction: 'National Command Center // All Himalayan Sectors',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastActiveUTC: '14:35:10 UTC',
  },
  {
    id: 'USR-HYDRO-01',
    callsign: 'HYDRO SIKKIM-01',
    name: 'Dr. Ananya Sharma (Demo Hydrologist)',
    role: 'HYDROLOGIST',
    jurisdiction: 'Sector 1 (North Sikkim & Teesta River Basin)',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastActiveUTC: '14:32:00 UTC',
  },
  {
    id: 'USR-FIELD-02',
    callsign: 'CHUNGTHANG NOC-02',
    name: 'Tashi Namgyal (Demo Field Officer)',
    role: 'FIELD_COORDINATOR',
    jurisdiction: 'Sector 1 (Chungthang Dam & Mangan Corridor)',
    status: 'ACTIVE',
    mfaEnabled: false,
    lastActiveUTC: '14:28:40 UTC',
  },
  {
    id: 'USR-GIS-03',
    callsign: 'GEOINT LEO-03',
    name: 'Vikram Sethi (Demo InSAR Analyst)',
    role: 'GIS_ANALYST',
    jurisdiction: 'Sector 2 (Himachal Chandra Basin) & Sector 3 (Nepal)',
    status: 'STANDBY',
    mfaEnabled: true,
    lastActiveUTC: '13:50:00 UTC',
  },
];
