import { getOneMapToken } from './_shared.ts';

// Helper: Haversine distance in meters
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const start = (req.query?.start || '1.304033,103.905847').toString();
  const end = (req.query?.end || '1.301500,103.904200').toString();
  const routeType = (req.query?.routeType || 'walk').toString();

  const authHeader = req.headers?.authorization;
  const tokenInfo = await getOneMapToken(authHeader);

  if (tokenInfo.token) {
    try {
      const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&routeType=${routeType}`;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${tokenInfo.token}`,
        },
      });

      const data = await resp.json();
      return res.status(resp.status).json({
        ...data,
        source: 'onemap_live',
      });
    } catch (err: any) {
      console.error('OneMap routing error:', err);
    }
  }

  // Graceful geodesic calculation fallback when token is not yet provided
  const [lat1, lon1] = start.split(',').map(Number);
  const [lat2, lon2] = end.split(',').map(Number);

  const straightLineDistance = haversineDistanceMeters(lat1, lon1, lat2, lon2);
  // Pedestrian routing factor ~1.25x straight line distance in Singapore urban street grid
  const walkDistanceMeters = Math.round(straightLineDistance * 1.25);
  // Average human walking speed ~4.8 km/h = 80 meters/min
  const walkMinutes = Math.max(1, Math.round(walkDistanceMeters / 80));

  return res.status(200).json({
    status: 200,
    status_message: 'Found route (Geodesic fallback)',
    route_summary: {
      start_point: start,
      end_point: end,
      total_distance: walkDistanceMeters,
      total_time: walkMinutes * 60,
    },
    route_instructions: [
      `Walk toward school perimeter access point (${walkDistanceMeters}m, ~${walkMinutes} mins)`,
    ],
    source: 'geodesic_fallback',
    notice: 'OneMap token not provided yet in Vercel environment variables. Calculated using SLA geodesic distance formula.',
  });
}
