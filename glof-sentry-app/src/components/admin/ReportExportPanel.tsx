'use client';

import React, { useState } from 'react';
import { ReportExportRequest } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

function createStandardPdf14(title: string, lines: string[]): Uint8Array {
  const sanitize = (t: string) => t.replace(/[()\\\r\n]/g, ' ');
  let streamText = `BT\n/F1 12 Tf\n50 740 Td\n(${sanitize(title)}) Tj\n/F1 9 Tf\n0 -20 Td\n`;
  for (let i = 0; i < lines.length; i++) {
    streamText += `(${sanitize(lines[i])}) Tj\n0 -14 Td\n`;
  }
  streamText += `ET`;

  const streamLen = streamText.length;
  const header = `%PDF-1.4\n`;
  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  const obj5 = `5 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamText}\nendstream\nendobj\n`;

  const o1 = header.length;
  const o2 = o1 + obj1.length;
  const o3 = o2 + obj2.length;
  const o4 = o3 + obj3.length;
  const o5 = o4 + obj4.length;
  const xrefOffset = o5 + obj5.length;

  const pad = (n: number) => String(n).padStart(10, '0');
  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(o1)} 00000 n \n${pad(o2)} 00000 n \n${pad(o3)} 00000 n \n${pad(o4)} 00000 n \n${pad(o5)} 00000 n \n`;

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const pdfString = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;

  const encoder = new TextEncoder();
  return encoder.encode(pdfString);
}

interface ReportExportPanelProps {
  reports: ReportExportRequest[];
  onGenerateReport: (report: ReportExportRequest) => void;
  className?: string;
}

export const ReportExportPanel: React.FC<ReportExportPanelProps> = ({
  reports,
  onGenerateReport,
  className,
}) => {
  const { t, language } = useLanguage();
  const [selectedLake, setSelectedLake] = useState<string>('South Lhonak Lake (SITE 014)');
  const [reportType, setReportType] = useState<ReportExportRequest['reportType']>('INCIDENT_DOSSIER');
  const [format, setFormat] = useState<ReportExportRequest['format']>('PDF');
  const [activePreviewReport, setActivePreviewReport] = useState<ReportExportRequest>(reports[0]);

  const handleGenerate = () => {
    const isHindi = language === 'hi';
    const reportTitle = isHindi
      ? `${selectedLake} ${reportType === 'INCIDENT_DOSSIER' ? 'घटना डोजियर' : reportType === 'BREACH_SIMULATION' ? 'तटबंध टूटने का सिमुलेशन' : reportType === 'BATHYMETRY_ANALYSIS' ? 'बाथिमेट्री विश्लेषण' : 'CAP चेतावनी पैकेज'} तकनीकी डोजियर`
      : `${selectedLake} ${reportType.replace('_', ' ')} Technical Dossier`;

    const newReport: ReportExportRequest = {
      id: `RPT-2026-${reports.length + 1}-GEN`,
      title: reportTitle,
      lakeId: selectedLake.toLowerCase().includes('lhonak') ? 'south-lhonak' : 'ghepang-gath',
      lakeName: selectedLake,
      reportType,
      format,
      generatedAtUTC: '14:36:50 UTC',
      fileSizeKB: format === 'GEOJSON' ? 4850 : format === 'PDF' ? 2180 : 96,
      classification: 'DEMO / SYNTHETIC REPORT',
      downloadUrl: '#demo-download-instant',
      status: 'READY',
    };
    onGenerateReport(newReport);
    setActivePreviewReport(newReport);
  };

  const handleDownloadFile = (report: ReportExportRequest) => {
    const isHindi = language === 'hi';

    if (report.format === 'PDF') {
      const pdfLines = isHindi
        ? [
            '================================================================================',
            'DISCLAIMER: HINDI SIMULATION DOSSIER PRODUCED FOR TESTING.',
            'NOT FOR OPERATIONAL DEPLOYMENT OR PUBLIC EMERGENCY ACTION.',
            '================================================================================',
            `REPORT ID     : ${report.id}`,
            `DOCUMENT TITLE: ${report.title}`,
            `TARGET SITE   : ${report.lakeName}`,
            `TIMESTAMP     : ${report.generatedAtUTC}`,
            `CLASSIFICATION: ${report.classification}`,
            '',
            'EXECUTIVE SUMMARY (HINDI SUMMARY):',
            '- Himanad Jheel Sthirata Soochkank (GSI): 0.892 [TIER 4 ATYANT SAMVEDANSHEEL]',
            '- Mukhya Karan                          : Moraine Freeboard Deficit (4.2m) + Seepage Spike (0.41)',
            '- Shikhara Bahav (Qp)                   : 14,200 m3/s',
            '- Anumanit Niche Pahunch Samay          : Sector 1 (Chungthang Dam) @ T+2.5 Hours',
            '',
            'DIGITAL AUDIT SIGNATURE:',
            'SHA-256: 8F44A29B0D1C68E94B32A710FC56D331902E44B8C01476B0E09428DAA183C901 (SYNTHETIC)',
          ]
        : [
            '================================================================================',
            'DISCLAIMER: SYNTHETIC DEMONSTRATION DOSSIER PRODUCED FOR SIMULATION TESTING.',
            'NOT FOR OPERATIONAL DEPLOYMENT OR PUBLIC EMERGENCY ACTION.',
            '================================================================================',
            `REPORT ID     : ${report.id}`,
            `DOCUMENT TITLE: ${report.title}`,
            `TARGET SITE   : ${report.lakeName}`,
            `TIMESTAMP     : ${report.generatedAtUTC}`,
            `CLASSIFICATION: ${report.classification}`,
            '',
            'EXECUTIVE SUMMARY:',
            '- Glacial Lake Stability Index (GSI): 0.892 [TIER 4 CRITICAL]',
            '- Primary Trigger Factor            : Moraine Freeboard Deficit (4.2m) + Seepage Spike (0.41)',
            '- Hydrodynamic Peak Discharge (Qp)  : 14,200 m3/s',
            '- Estimated Downstream Arrival      : Sector 1 (Chungthang Dam) @ T+2.5 Hours',
            '',
            'DIGITAL AUDIT SIGNATURE:',
            'SHA-256: 8F44A29B0D1C68E94B32A710FC56D331902E44B8C01476B0E09428DAA183C901 (SYNTHETIC)',
          ];

      const pdfBytes = createStandardPdf14(report.title, pdfLines);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    let mimeType = 'text/plain';
    let extension = 'txt';
    let content = '';

    if (report.format === 'CAP_XML') {
      mimeType = 'application/xml';
      extension = 'xml';
      content = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ==================================================================== -->
<!-- DEMO / SYNTHETIC CAP PACKAGE (${isHindi ? 'HINDI/ENGLISH DUAL' : 'ENGLISH'}) - NOT FOR OPERATIONAL USE -->
<!-- GLOF SENTRY NATIONAL MONITORING PLATFORM (EXERCISE MODE) -->
<!-- ==================================================================== -->
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${report.id}</identifier>
  <sender>glof-sentry-demo@local.sim</sender>
  <sent>2026-08-10T14:30:00Z</sent>
  <status>Exercise</status>
  <msgType>Alert</msgType>
  <scope>Restricted</scope>
  <info>
    <language>${isHindi ? 'hi-IN' : 'en-US'}</language>
    <category>Geo</category>
    <event>${isHindi ? 'हिमनद झील विस्फोट बाढ़ चेतावनी (सिमुलेशन)' : 'Glacial Lake Outburst Flood Warning (Simulation)'}</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <headline>${report.title}</headline>
    <description>${isHindi ? `${report.lakeName} के लिए सिमुलेटेड मोरेन ब्रीच परिदृश्य। शिखर बहाव Qp ~ 14,200 m3/s।` : `Simulated moraine breach scenario for ${report.lakeName}. Hydraulic peak discharge Qp ~ 14,200 m3/s.`}</description>
    <area>
      <areaDesc>${isHindi ? 'ऊपरी तीस्ता नदी बेसिन (सेक्टर 1)' : 'Upper Teesta River Basin (Sector 1)'}</areaDesc>
    </area>
  </info>
</alert>`;
    } else if (report.format === 'GEOJSON') {
      mimeType = 'application/geo+json';
      extension = 'geojson';
      content = JSON.stringify(
        {
          type: 'FeatureCollection',
          properties: {
            reportId: report.id,
            title: report.title,
            lake: report.lakeName,
            language: isHindi ? 'hi' : 'en',
            disclaimer: isHindi ? 'डेमो / सिंथेटिक बाढ़ सीमा - संचालन के लिए नहीं' : 'DEMO / SYNTHETIC FLOOD WAVE EXTENT - NOT FOR OPERATIONAL USE',
          },
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [88.19, 27.95],
                    [88.23, 27.92],
                    [88.28, 27.88],
                    [88.35, 27.82],
                    [88.32, 27.8],
                    [88.22, 27.87],
                    [88.18, 27.93],
                    [88.19, 27.95],
                  ],
                ],
              },
              properties: {
                sector: isHindi ? 'सेक्टर 1 (चुंगथांग जलमग्न गलियारा)' : 'Sector 1 (Chungthang Inundation Corridor)',
                leadTimeHours: 2.5,
                peakDepthM: 18.4,
              },
            },
          ],
        },
        null,
        2
      );
    } else if (report.format === 'CSV') {
      mimeType = 'text/csv';
      extension = 'csv';
      content = isHindi
        ? `# GLOF SENTRY // सिंथेटिक टेलीमेट्री निर्यात
# अस्वीकरण: केवल प्रदर्शन डेटा - संचालन के लिए नहीं
# REPORT_ID: ${report.id}
# LAKE: ${report.lakeName}
समय_UTC,जल_स्तर_मीटर,रिसाव_सूचकांक,फ्रीबोर्ड_कमी_मीटर,बहाव_m3s
14:00:00,5240.10,0.38,4.5,12500
14:15:00,5240.25,0.40,4.3,13800
14:30:00,5240.42,0.41,4.2,14200
`
        : `# GLOF SENTRY // SYNTHETIC TELEMETRY EXPORT
# DISCLAIMER: DEMONSTRATION DATA ONLY - NOT FOR OPERATIONAL USE
# REPORT_ID: ${report.id}
# LAKE: ${report.lakeName}
Timestamp_UTC,Water_Stage_M,Seepage_Index,Freeboard_Deficit_M,Discharge_M3S
14:00:00,5240.10,0.38,4.5,12500
14:15:00,5240.25,0.40,4.3,13800
14:30:00,5240.42,0.41,4.2,14200
`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id.toLowerCase()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-4 font-mono text-[11px]', className)}>
      {/* Top Generator Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Form: Report Configuration (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex justify-between items-center hud-border-b pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Icon name="summarize" size="xs" className="text-secondary" />
                <span className="font-sans font-bold text-on-surface text-[12px] uppercase">
                  {t.reportExport.title}
                </span>
              </div>
              <span className="text-[10px] text-outline font-sans">v4.2 CAP ENGINE</span>
            </div>

            <div className="space-y-3">
              {/* Lake Select */}
              <div>
                <label className="text-outline text-[10px] block mb-1 font-sans font-bold">{t.reportExport.targetSite}</label>
                <select
                  value={selectedLake}
                  onChange={(e) => setSelectedLake(e.target.value)}
                  className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary font-sans"
                >
                  <option value="South Lhonak Lake (SITE 014)">South Lhonak Lake (SITE 014 // North Sikkim)</option>
                  <option value="Ghepang Gath Lake (SITE 022)">Ghepang Gath Lake (SITE 022 // Himachal Pradesh)</option>
                  <option value="Imja Tsho (SITE 008)">Imja Tsho (SITE 008 // Khumbu, Nepal)</option>
                  <option value="Shako Cho (SITE 031)">Shako Cho (SITE 031 // North Sikkim)</option>
                </select>
              </div>

              {/* Report Type */}
              <div>
                <label className="text-outline text-[10px] block mb-1 font-sans font-bold">{t.reportExport.dossierType}</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportExportRequest['reportType'])}
                  className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary font-sans"
                >
                  <option value="INCIDENT_DOSSIER">INCIDENT_DOSSIER ({language === 'hi' ? 'समग्र विसंगति व हाइड्रोग्राफ' : 'Composite Anomaly & Hydrograph'})</option>
                  <option value="BREACH_SIMULATION">BREACH_SIMULATION ({language === 'hi' ? 'हाइड्रोडायनामिक बाढ़ जलमग्न लहर' : 'Hydrodynamic Flood Inundation Wave'})</option>
                  <option value="BATHYMETRY_ANALYSIS">BATHYMETRY_ANALYSIS ({language === 'hi' ? 'सोनार गहराई व बांध स्थिरता' : 'Sonar Depth & Dam Stability'})</option>
                  <option value="CAP_WARNING_PACKAGE">CAP_WARNING_PACKAGE ({language === 'hi' ? 'OASIS कॉमन अलर्टिंग प्रोटोकॉल v1.2' : 'OASIS Common Alerting Protocol v1.2'})</option>
                </select>
              </div>

              {/* Format Select */}
              <div>
                <label className="text-outline text-[10px] block mb-1 font-sans font-bold">{t.reportExport.exportFormat}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['PDF', 'CAP_XML', 'GEOJSON', 'CSV'] as const).map((fmt) => (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={cn(
                        'p-2 rounded-[2px] font-bold text-[10px] border transition-colors text-center touch-manipulation cursor-pointer min-h-[36px] font-sans',
                        format === fmt
                          ? 'bg-secondary/20 text-secondary border-secondary'
                          : 'bg-surface-container text-outline border-surface-high hover:text-on-surface'
                      )}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 hud-border-t flex justify-between items-center">
            <span className="text-[9px] text-outline font-sans">* {language === 'hi' ? 'सिंथेटिक निर्यात संग्रह उत्पन्न करता है' : 'GENERATES SYNTHETIC EXPORT ARCHIVE'}</span>
            <Button
              onClick={handleGenerate}
              variant="primary"
              size="sm"
              className="font-bold font-sans"
            >
              <Icon name="download" size="xs" />
              {t.reportExport.compileButton}
            </Button>
          </div>
        </div>

        {/* Right Preview Card: Live Structured Document Dossier (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex justify-between items-center hud-border-b pb-2 mb-2">
              <span className="font-sans text-[12px] font-bold text-secondary uppercase">
                {t.reportExport.documentPreview} // {activePreviewReport.format}
              </span>
              <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border border-primary/30 font-sans">
                {activePreviewReport.classification}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-3 hud-border rounded-[3px] space-y-2">
              <div className="font-sans text-[13px] font-bold text-on-surface">
                {activePreviewReport.title}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-outline block font-sans">{t.reportExport.targetSite}:</span>
                  <span className="text-on-surface-variant font-bold">{activePreviewReport.lakeName}</span>
                </div>
                <div>
                  <span className="text-outline block font-sans">{language === 'hi' ? 'उत्पन्न समय (UTC):' : 'GENERATED (UTC):'}</span>
                  <span className="text-on-surface-variant">{activePreviewReport.generatedAtUTC}</span>
                </div>
                <div>
                  <span className="text-outline block font-sans">{language === 'hi' ? 'प्रारूप व आकार:' : 'FORMAT & SIZE:'}</span>
                  <span className="text-secondary font-bold">
                    {activePreviewReport.format} ({activePreviewReport.fileSizeKB} KB)
                  </span>
                </div>
                <div>
                  <span className="text-outline block font-sans">{t.common.status}:</span>
                  <span className="text-advisory font-bold">{activePreviewReport.status}</span>
                </div>
              </div>

              {/* Sample Content Box */}
              <div className="bg-surface-container-high/80 p-2.5 rounded-[2px] text-[10px] text-outline font-mono border-l-2 border-l-secondary space-y-1">
                <div>[HEADER] GLOF-SENTRY-NATIONAL-MONITORING-INCIDENT-ARCHIVE</div>
                <div>[GSI_SCORE] 0.892 // {language === 'hi' ? 'स्तर 4 अत्यंत संवेदनशील' : 'TIER 4 CRITICAL'} // {language === 'hi' ? 'शिखर बहाव QP' : 'HYDRAULIC DISCHARGE QP'}: 14,200 M3/S</div>
                <div>[INUNDATION] SECTOR 1 CHUNGTHANG DAM ARRIVAL T+2.5H (SYNTHETIC SIMULATION)</div>
                <div>[AUTHENTICATION] SHA256 DIGEST: 8F44A29B... (DEMO VERIFIED)</div>
              </div>
            </div>
          </div>

          <div className="pt-2 hud-border-t flex justify-end">
            <Button
              onClick={() => handleDownloadFile(activePreviewReport)}
              variant="outline"
              size="sm"
              className="font-bold font-sans"
            >
              <Icon name="file_download" size="xs" />
              {t.reportExport.downloadButton} ({activePreviewReport.format})
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Reports Archive Table */}
      <div className="data-card hud-border rounded-[4px] flex flex-col overflow-hidden">
        <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="folder" size="xs" className="text-secondary" />
            <span className="font-sans font-bold text-on-surface uppercase">
              {t.reportExport.archiveTitle} ({reports.length} {language === 'hi' ? 'पैकेज' : 'PACKAGES'})
            </span>
          </div>
          <span className="text-[10px] text-outline font-sans">{language === 'hi' ? 'स्वतः संग्रह प्रतिधारण: 30 दिन' : 'AUTO-ARCHIVE RETENTION: 30 DAYS'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b font-sans font-bold">
                <th className="p-2.5">{language === 'hi' ? 'रिपोर्ट ID' : 'REPORT ID'}</th>
                <th className="p-2.5">{language === 'hi' ? 'दस्तावेज़ शीर्षक' : 'DOCUMENT TITLE'}</th>
                <th className="p-2.5">{t.reportExport.targetSite}</th>
                <th className="p-2.5 text-center">{t.reportExport.exportFormat}</th>
                <th className="p-2.5 text-center">{language === 'hi' ? 'आकार' : 'SIZE'}</th>
                <th className="p-2.5">{language === 'hi' ? 'समय (UTC)' : 'TIMESTAMP (UTC)'}</th>
                <th className="p-2.5 text-right">{language === 'hi' ? 'कार्रवाई' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-high">
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setActivePreviewReport(r)}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-surface-container-high/60',
                    activePreviewReport.id === r.id ? 'bg-surface-container-high border-l-2 border-l-secondary' : ''
                  )}
                >
                  <td className="p-2.5 font-bold text-secondary">{r.id}</td>
                  <td className="p-2.5 text-on-surface font-sans">{r.title}</td>
                  <td className="p-2.5 text-outline truncate max-w-[140px]">{r.lakeName}</td>
                  <td className="p-2.5 text-center font-bold text-primary">
                    <span className="bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-surface-high font-sans">
                      {r.format}
                    </span>
                  </td>
                  <td className="p-2.5 text-center text-outline">{r.fileSizeKB} KB</td>
                  <td className="p-2.5 text-outline">{r.generatedAtUTC}</td>
                  <td className="p-2.5 text-right font-bold text-secondary">
                    <span className="hover:underline flex items-center justify-end gap-1 font-sans">
                      <Icon name="visibility" size="xs" /> {language === 'hi' ? 'पूर्वावलोकन' : 'PREVIEW'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
