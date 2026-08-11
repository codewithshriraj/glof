/**
 * Deterministic System Configuration State Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic operational threshold parameters and weighting coefficients for demonstration testing.
 */

import { SystemConfigState } from '@/lib/types/glof';

export const initialSystemConfig: SystemConfigState = {
  amberThreshold: 0.600,
  redThreshold: 0.800,
  freeboardWeightPct: 26,
  expansionWeightPct: 22,
  seepageWeightPct: 20,
  iceCoreWeightPct: 18,
  slopeWeightPct: 14,
  capPollingIntervalSec: 10,
  maxRetryAttempts: 3,
  failoverMode: 'PRIMARY_SEOC_ACTIVE',
  autoEscalationEnabled: true,
  lastCommittedUTC: '14:30:00 UTC',
};
