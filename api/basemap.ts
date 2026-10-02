/**
 * OneMap Singapore SLA Basemap Configuration
 *
 * Official OneMap tile layer definition for Leaflet:
 *
 * var basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
 *    detectRetina: true,
 *    maxZoom: 19,
 *    minZoom: 11,
 *    attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
 * });
 */

export const ONEMAP_BASEMAP_TILE_URL =
  'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';

export const ONEMAP_BASEMAP_OPTIONS = {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 11,
  /** DO NOT REMOVE the OneMap attribution below **/
  attribution:
    '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>',
};

// Alternative OneMap map styles available
export const ONEMAP_MAP_STYLES = {
  Default: 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
  Night: 'https://www.onemap.gov.sg/maps/tiles/Night/{z}/{x}/{y}.png',
  Original: 'https://www.onemap.gov.sg/maps/tiles/Original/{z}/{x}/{y}.png',
  Grey: 'https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png',
};

/**
 * Leaflet helper to instantiate the basemap layer
 * Usage:
 *   const basemap = createOneMapBasemap(L);
 *   basemap.addTo(map);
 */
export function createOneMapBasemap(L: any, style: 'Default' | 'Night' | 'Original' | 'Grey' = 'Default') {
  if (!L || typeof L.tileLayer !== 'function') {
    throw new Error('Leaflet L instance required to create tileLayer');
  }

  const tileUrl = ONEMAP_MAP_STYLES[style] || ONEMAP_BASEMAP_TILE_URL;
  return L.tileLayer(tileUrl, ONEMAP_BASEMAP_OPTIONS);
}

/**
 * Serverless HTTP Handler for /api/basemap and /api/onemap/basemap
 */
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // If specific tile coordinates are queried: /api/basemap?z=15&x=26000&y=16000
  const { z, x, y, style = 'Default' } = req.query || {};
  if (z && x && y) {
    const tileBase = ONEMAP_MAP_STYLES[style as keyof typeof ONEMAP_MAP_STYLES] || ONEMAP_BASEMAP_TILE_URL;
    const tileUrl = tileBase
      .replace('{z}', String(z))
      .replace('{x}', String(x))
      .replace('{y}', String(y));
    return res.redirect(302, tileUrl);
  }

  return res.status(200).json({
    success: true,
    service: 'OneMap Singapore SLA Basemap Layer',
    codeSnippet: `var basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
   detectRetina: true,
   maxZoom: 19,
   minZoom: 11,
   /** DO NOT REMOVE the OneMap attribution below **/
   attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
});`,
    tileUrl: ONEMAP_BASEMAP_TILE_URL,
    options: ONEMAP_BASEMAP_OPTIONS,
    styles: ONEMAP_MAP_STYLES,
    usage: {
      leaflet: "import { createOneMapBasemap } from './api/basemap';",
      example: 'createOneMapBasemap(L).addTo(map);',
    },
  });
}
