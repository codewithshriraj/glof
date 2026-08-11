'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';
import {
  FieldIncidentRecord,
  saveIncident,
  getAllIncidents,
  updateIncidentStatus,
} from '@/lib/storage/incident-db';

interface FieldIncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FieldIncidentReportModal: React.FC<FieldIncidentReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const [selectedLake, setSelectedLake] = useState('South Lhonak Lake (SITE 014)');
  const [severity, setSeverity] = useState<FieldIncidentRecord['severity']>('SEEPAGE_SPIKE');
  const [description, setDescription] = useState('');
  const [operatorCallsign, setOperatorCallsign] = useState('FIELD OPS-02 (CHUNGTHANG)');
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number; alt: number | null } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'NEW_REPORT' | 'LOCAL_QUEUE'>('NEW_REPORT');
  const [queuedIncidents, setQueuedIncidents] = useState<FieldIncidentRecord[]>([]);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing incidents from IndexedDB
  const refreshQueue = async () => {
    const records = await getAllIncidents();
    setQueuedIncidents(records.reverse());
  };

  useEffect(() => {
    if (isOpen) {
      refreshQueue();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Geolocation acquisition on explicit user action only
  const handleAcquireGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError(language === 'hi' ? 'आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          alt: position.coords.altitude ? Math.round(position.coords.altitude) : null,
        });
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError(language === 'hi' ? 'स्थान अनुमति अस्वीकृत। मैन्युअल चयन का उपयोग किया जाएगा।' : 'Location permission denied. Manual site selection will be used.');
        } else {
          setGpsError(language === 'hi' ? 'उच्च हिमालयी भूभाग में GPS सिग्नल प्राप्त करने में असमर्थ।' : 'Unable to acquire GPS fix in high Himalayan terrain.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Photo capture handler
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit incident to IndexedDB
  const handleSubmitReport = async () => {
    if (!description.trim()) {
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const timestampStr = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;

    const isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

    const newRecord: FieldIncidentRecord = {
      id: `INC-2026-${now.getTime().toString().slice(-6)}`,
      title: `${severity.replace('_', ' ')} - ${selectedLake}`,
      lakeId: selectedLake.toLowerCase().includes('lhonak') ? 'south-lhonak' : 'ghepang-gath',
      lakeName: selectedLake,
      severity,
      description,
      latitude: coords?.lat ?? 27.9158,
      longitude: coords?.lng ?? 88.2045,
      accuracyM: coords?.accuracy ?? 12,
      altitudeM: coords?.alt ?? 5240,
      timestampUTC: timestampStr,
      photoDataUrl: photoPreview,
      operatorCallsign,
      syncStatus: isOnline ? 'SYNCED' : 'SYNC_PENDING',
      retryCount: 0,
      lastSyncAttemptUTC: isOnline ? timestampStr : null,
    };

    await saveIncident(newRecord);
    await refreshQueue();
    setIsSubmitting(false);

    setSubmissionFeedback(
      isOnline
        ? t.fieldReport.reportSubmittedSuccess
        : t.fieldReport.reportStoredOffline
    );

    // Reset form
    setDescription('');
    setPhotoPreview(null);
    setTimeout(() => {
      setSubmissionFeedback(null);
      setActiveTab('LOCAL_QUEUE');
    }, 1800);
  };

  // Retry sync for an offline incident
  const handleRetrySync = async (id: string) => {
    const now = new Date();
    const timestampStr = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
    await updateIncidentStatus(id, 'SYNCED', timestampStr);
    await refreshQueue();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn cursor-pointer touch-manipulation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="data-card hud-border p-4 md:p-6 rounded-[6px] max-w-2xl w-full max-h-[90vh] overflow-y-auto font-mono text-[11px] space-y-4 cursor-default"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start hud-border-b pb-3">
          <div className="flex items-center gap-2 text-secondary font-bold text-[13px] uppercase">
            <Icon name="campaign" size="sm" />
            <span>{t.fieldReport.modalTitle}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors touch-manipulation cursor-pointer"
            aria-label="Close Incident Modal"
          >
            <Icon name="close" size="xs" />
          </button>
        </div>

        {/* Tab Strip: New Report vs Offline Vault Queue */}
        <div className="flex gap-1.5 hud-border-b pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('NEW_REPORT')}
            className={cn(
              'px-3 py-1.5 rounded-[3px] font-bold border transition-colors flex items-center gap-1.5 touch-manipulation cursor-pointer min-h-[36px]',
              activeTab === 'NEW_REPORT'
                ? 'bg-secondary/20 text-secondary border-secondary'
                : 'bg-surface-container text-outline border-surface-high hover:text-on-surface'
            )}
          >
            <Icon name="edit_note" size="xs" />
            <span>1. {t.fieldReport.submitIncident}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LOCAL_QUEUE')}
            className={cn(
              'px-3 py-1.5 rounded-[3px] font-bold border transition-colors flex items-center gap-1.5 touch-manipulation cursor-pointer min-h-[36px]',
              activeTab === 'LOCAL_QUEUE'
                ? 'bg-secondary/20 text-secondary border-secondary'
                : 'bg-surface-container text-outline border-surface-high hover:text-on-surface'
            )}
          >
            <Icon name="inventory_2" size="xs" />
            <span>2. {language === 'hi' ? 'ऑफ़लाइन कतार वॉल्ट' : 'OFFLINE QUEUE VAULT'} ({queuedIncidents.length})</span>
          </button>
        </div>

        {submissionFeedback && (
          <div className="bg-secondary/10 border border-secondary/40 p-2.5 rounded text-secondary font-bold text-[10px] flex items-center gap-2 animate-fadeIn">
            <Icon name="check_circle" size="xs" />
            <span>{submissionFeedback}</span>
          </div>
        )}

        {/* TAB 1: New Incident Report Form */}
        {activeTab === 'NEW_REPORT' && (
          <div className="space-y-4">
            {/* Lake & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-outline text-[10px] block mb-1 uppercase font-bold">{t.fieldReport.selectLake}</label>
                <select
                  value={selectedLake}
                  onChange={(e) => setSelectedLake(e.target.value)}
                  className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary font-sans text-[11px]"
                >
                  <option value="South Lhonak Lake (SITE 014)">South Lhonak Lake (SITE 014 // Sikkim)</option>
                  <option value="Ghepang Gath Lake (SITE 022)">Ghepang Gath Lake (SITE 022 // Himachal Pradesh)</option>
                  <option value="Imja Tsho (SITE 008)">Imja Tsho (SITE 008 // Khumbu Range)</option>
                  <option value="Tsho Rolpa (SITE 003)">Tsho Rolpa (SITE 003 // Rolwaling)</option>
                </select>
              </div>

              <div>
                <label className="text-outline text-[10px] block mb-1 uppercase font-bold">{t.fieldReport.severityLevel}</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as FieldIncidentRecord['severity'])}
                  className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary font-sans text-[11px]"
                >
                  <option value="OBSERVATION">
                    {language === 'hi' ? 'सामान्य अवलोकन (Routine Observation)' : 'OBSERVATION (Routine Survey)'}
                  </option>
                  <option value="SEEPAGE_SPIKE">
                    {t.fieldReport.incidentTypes.moraineSeepage}
                  </option>
                  <option value="DEBRIS_SLIDE">
                    {t.fieldReport.incidentTypes.iceAvalanche}
                  </option>
                  <option value="MORAINE_CREEP">
                    {language === 'hi' ? 'मोरेन बांध विस्थापन / धंसाव' : 'MORAINE_CREEP (Dam Subsidence)'}
                  </option>
                  <option value="IMMINENT_BREACH">
                    {language === 'hi' ? 'आसन्न बांध विस्फोट खतरा (IMMINENT BREACH)' : 'IMMINENT_BREACH (Critical Piping / Overtopping)'}
                  </option>
                </select>
              </div>
            </div>

            {/* GPS Geolocation Acquisition Panel */}
            <div className="bg-surface-container-lowest p-3 rounded hud-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface text-[11px] flex items-center gap-1.5">
                  <Icon name="my_location" size="xs" className="text-secondary" />
                  {t.fieldReport.coordinates}
                </span>
                <Button
                  onClick={handleAcquireGps}
                  variant="outline"
                  size="sm"
                  disabled={gpsLoading}
                  className="text-[10px] py-1"
                >
                  <Icon name="gps_fixed" size="xs" />
                  {gpsLoading ? t.fieldReport.gpsAcquiring : t.fieldReport.gpsLocation}
                </Button>
              </div>

              {coords ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-outline block">{t.common.latitude}:</span>
                    <span className="text-secondary font-bold">{coords.lat.toFixed(5)}° N</span>
                  </div>
                  <div>
                    <span className="text-outline block">{t.common.longitude}:</span>
                    <span className="text-secondary font-bold">{coords.lng.toFixed(5)}° E</span>
                  </div>
                  <div>
                    <span className="text-outline block">{language === 'hi' ? 'सटीकता' : 'ACCURACY'}:</span>
                    <span className="text-on-surface font-bold">±{coords.accuracy} m</span>
                  </div>
                  <div>
                    <span className="text-outline block">{t.common.elevation}:</span>
                    <span className="text-primary font-bold">{coords.alt ? `${coords.alt} m` : '5,240 m (EST)'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-outline font-sans">
                  {gpsError ? (
                    <span className="text-warning">{gpsError}</span>
                  ) : (
                    language === 'hi'
                      ? 'इस रिपोर्ट को उपग्रह निर्देशांकों से टैग करने के लिए "वर्तमान GPS स्थान प्राप्त करें" पर क्लिक करें।'
                      : 'Click "Capture Current GPS Location" to tag this field report with exact satellite coordinates.'
                  )}
                </p>
              )}
            </div>

            {/* Camera / Photo Capture Section */}
            <div className="bg-surface-container-lowest p-3 rounded hud-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface text-[11px] flex items-center gap-1.5">
                  <Icon name="photo_camera" size="xs" className="text-secondary" />
                  {t.fieldReport.evidenceUpload}
                </span>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="text-[10px] py-1"
                >
                  <Icon name="add_a_photo" size="xs" />
                  {photoPreview
                    ? (language === 'hi' ? 'फोटो बदलें' : 'REPLACE PHOTO')
                    : t.fieldReport.takePhoto}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </div>

              {photoPreview ? (
                <div className="relative w-full max-h-48 rounded overflow-hidden border border-surface-high flex justify-center bg-black">
                  <img src={photoPreview} alt="Field Evidence Preview" className="max-h-48 object-contain" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 bg-black/70 text-error p-1.5 rounded-full hover:bg-black touch-manipulation cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                    aria-label="Remove Photo"
                  >
                    <Icon name="delete" size="xs" />
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-outline font-sans">
                  {language === 'hi'
                    ? 'बांध दरार या असामान्य जलस्तर वृद्धि के साक्ष्य के लिए कैमरा फोटो या फ़ाइल अपलोड करें।'
                    : 'Supports live device camera snapshot or local file upload for moraine crest cracking evidence.'}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-outline text-[10px] block mb-1 uppercase font-bold">{t.fieldReport.description}</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.fieldReport.descriptionPlaceholder}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2.5 rounded-[2px] outline-none focus:border-secondary text-[11px] placeholder-outline resize-none font-sans"
              />
            </div>

            {/* Operator Callsign & Submit */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2 hud-border-t">
              <div className="flex items-center gap-2">
                <span className="text-outline text-[10px]">{language === 'hi' ? 'ऑपरेटर कॉलसाइन:' : 'OPERATOR:'}</span>
                <input
                  type="text"
                  value={operatorCallsign}
                  onChange={(e) => setOperatorCallsign(e.target.value)}
                  className="bg-surface-container-lowest hud-border px-2 py-1 rounded text-[10px] text-secondary font-bold outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={onClose} variant="outline" size="sm">
                  {t.common.cancel}
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  variant="primary"
                  size="sm"
                  disabled={!description.trim() || isSubmitting}
                  className="font-bold shadow-[0_0_12px_rgba(93,230,255,0.3)]"
                >
                  <Icon name="send" size="xs" />
                  {isSubmitting ? t.fieldReport.submitting : t.fieldReport.submitIncident}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Offline IndexedDB Queue Vault */}
        {activeTab === 'LOCAL_QUEUE' && (
          <div className="space-y-3">
            <div className="text-[10px] text-outline flex justify-between items-center">
              <span>{language === 'hi' ? 'स्थानीय IndexedDB में संग्रहीत रिपोर्ट' : 'LOCAL INDEXEDDB PERSISTED REPORTS'}</span>
              <span className="text-secondary font-bold">{queuedIncidents.length} {language === 'hi' ? 'रिकॉर्ड्स' : 'RECORDS STORED'}</span>
            </div>

            {queuedIncidents.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest rounded hud-border text-outline">
                <Icon name="inventory" size="md" className="mx-auto mb-2 opacity-50" />
                <p>{language === 'hi' ? 'वॉल्ट में कोई स्थानीय रिपोर्ट संग्रहीत नहीं है।' : 'No local field reports stored in device vault.'}</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-high border border-surface-high rounded overflow-hidden">
                {queuedIncidents.map((item) => (
                  <div key={item.id} className="p-3 bg-surface-container-lowest/60 hover:bg-surface-container-high/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface text-[12px]">{item.title}</span>
                        <span
                          className={cn(
                            'px-1.5 py-0.2 rounded font-bold text-[8px] border',
                            item.syncStatus === 'SYNCED'
                              ? 'bg-advisory/10 text-advisory border-advisory/30'
                              : item.syncStatus === 'SYNC_PENDING'
                              ? 'bg-warning/10 text-warning border-warning/30 animate-pulse'
                              : 'bg-error/10 text-error border-error/30'
                          )}
                        >
                          {item.syncStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-3 text-[9px] text-outline">
                        <span>{t.common.lastUpdated}: {item.timestampUTC}</span>
                        <span>{t.common.coordinates}: {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}</span>
                        <span>{item.operatorCallsign}</span>
                      </div>
                    </div>

                    {item.syncStatus !== 'SYNCED' && (
                      <Button
                        onClick={() => handleRetrySync(item.id)}
                        variant="outline"
                        size="sm"
                        className="text-[9px] py-1"
                      >
                        <Icon name="sync" size="xs" />
                        {language === 'hi' ? 'सिंक करें' : 'SYNC NOW'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
