import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GLOF Sentry // National Cryosphere Monitoring Platform',
    short_name: 'GLOF Sentry',
    description: 'High-fidelity defense-grade glacial lake outburst flood early warning, risk assessment, and disaster surveillance platform.',
    start_url: '/command',
    scope: '/',
    display: 'standalone',
    background_color: '#0c141c',
    theme_color: '#0c141c',
    orientation: 'portrait-primary',
    categories: ['government', 'weather', 'utilities', 'emergency'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Command Center',
        short_name: 'Command',
        description: 'National GLOF risk telemetry and active watch sites',
        url: '/command',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Active Alerts',
        short_name: 'Alerts',
        description: 'Critical GLOF alert triage and emergency escalation',
        url: '/alerts',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Live Risk Map',
        short_name: 'Map',
        description: 'Himalayan GIS risk terrain and breach inundation corridors',
        url: '/map',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Emergency Dispatch',
        short_name: 'Dispatch',
        description: 'Multi-agency response teams and evacuation coordination',
        url: '/dispatch',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
