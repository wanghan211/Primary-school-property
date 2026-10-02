/**
 * OneMap Singapore SLA Basemap Configuration for Leaflet
 */

export const ONEMAP_BASEMAP_TILE_URL =
  'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';

export const ONEMAP_BASEMAP_OPTIONS = {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 11,
  /** DO NOT REMOVE the OneMap attribution below (SLA requirement) **/
  attribution:
    '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>',
};

// Alternative OneMap map styles available
export const ONEMAP_MAP_STYLES = {
  Default: 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
  Night: 'https://www.onemap.gov.sg/maps/tiles/Night/{z}/{x}/{y}.png',
  Original: 'https://www.onemap.gov.sg/maps/tiles/Original/{z}/{x}/{y}.png',
  Grey: 'https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png',
} as const;

export type OneMapStyle = keyof typeof ONEMAP_MAP_STYLES;
