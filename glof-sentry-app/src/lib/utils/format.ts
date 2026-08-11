/**
 * Formatting utilities for defense-grade GLOF telemetry and coordinates
 */

export function formatUtcTime(date: Date = new Date()): string {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `UTC ${hours}:${minutes}`;
}

export function formatUtcFull(date: Date = new Date()): string {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds} UTC`;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

export function formatVolume(mcm: number): string {
  return `${mcm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} MCM`;
}

export function formatDischarge(m3s: number): string {
  return `${m3s.toLocaleString('en-US')} m³/s`;
}

export function formatElevation(meters: number): string {
  return `${meters.toLocaleString('en-US')} m a.s.l.`;
}
