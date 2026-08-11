/**
 * Deterministic Report & CAP Export Dataset for GLOF Sentry
 * 
 * DISCLAIMER:
 * Synthetic report archive and CAP packaging for demonstration testing.
 */

import { ReportExportRequest } from '@/lib/types/glof';

export const mockReportExports: ReportExportRequest[] = [
  {
    id: 'RPT-2026-014-A',
    title: 'South Lhonak Hydrodynamic Breach & Inundation Dossier',
    lakeId: 'south-lhonak',
    lakeName: 'South Lhonak Lake (SITE 014)',
    reportType: 'INCIDENT_DOSSIER',
    format: 'PDF',
    generatedAtUTC: '14:30:00 UTC',
    fileSizeKB: 2450,
    classification: 'DEMO / SYNTHETIC REPORT',
    downloadUrl: '#demo-download-pdf',
    status: 'READY',
  },
  {
    id: 'RPT-2026-014-B',
    title: 'Common Alerting Protocol (CAP v1.2) XML Package',
    lakeId: 'south-lhonak',
    lakeName: 'South Lhonak Lake (SITE 014)',
    reportType: 'CAP_WARNING_PACKAGE',
    format: 'CAP_XML',
    generatedAtUTC: '14:31:05 UTC',
    fileSizeKB: 84,
    classification: 'DEMO / SYNTHETIC REPORT',
    downloadUrl: '#demo-download-cap',
    status: 'READY',
  },
  {
    id: 'RPT-2026-014-C',
    title: 'Teesta River Basin 1D/2D Inundation Flood Wave Extent',
    lakeId: 'south-lhonak',
    lakeName: 'South Lhonak Lake (SITE 014)',
    reportType: 'BREACH_SIMULATION',
    format: 'GEOJSON',
    generatedAtUTC: '14:32:20 UTC',
    fileSizeKB: 5120,
    classification: 'DEMO / SYNTHETIC REPORT',
    downloadUrl: '#demo-download-geojson',
    status: 'READY',
  },
  {
    id: 'RPT-2026-022-A',
    title: 'Ghepang Gath Dam Core Stability & Bathymetry Scan',
    lakeId: 'ghepang-gath',
    lakeName: 'Ghepang Gath Lake (SITE 022)',
    reportType: 'BATHYMETRY_ANALYSIS',
    format: 'PDF',
    generatedAtUTC: '12:00:00 UTC',
    fileSizeKB: 1890,
    classification: 'DEMO / SYNTHETIC REPORT',
    downloadUrl: '#demo-download-pdf2',
    status: 'READY',
  },
];
