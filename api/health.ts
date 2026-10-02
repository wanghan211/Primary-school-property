import { getOneMapToken } from './onemap/_shared.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tokenInfo = await getOneMapToken(req.headers?.authorization);

  const healthData = {
    status: 'ok',
    service: 'EduHomes SG API Server',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
    },
    integrations: {
      onemap: {
        status: tokenInfo.token ? 'connected' : 'ready_for_token',
        source: tokenInfo.source,
        hasToken: !!tokenInfo.token,
      },
      dataGovSg: {
        status: 'connected',
        dataset: 'HDB Resale Prices (Jan 2017 onwards)',
        resourceId: 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc',
      },
      ura: {
        status: process.env.URA_ACCESS_KEY ? 'ready' : 'ready_for_key',
        hasAccessKey: !!process.env.URA_ACCESS_KEY,
        services: ['PMI_Resi_Transaction', 'Car_Park_Availability', 'Car_Park_Details'],
      },
    },
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'System health and integration status' },
      { path: '/api/onemap/token', method: 'GET, POST', description: 'OneMap token verification and auto-minting' },
      { path: '/api/onemap/search', method: 'GET', description: 'OneMap address and school geocoding' },
      { path: '/api/onemap/radius', method: 'GET', description: 'MOE 1km/2km geodesic distance and GeoJSON rings' },
      { path: '/api/onemap/route', method: 'GET', description: 'Walking directions and travel time' },
      { path: '/api/onemap/reverse-geocode', method: 'GET', description: 'Reverse geocode coordinates to postal address' },
      { path: '/api/onemap/education', method: 'GET', description: 'Planning area education statistics' },
      { path: '/api/hdb/resale', method: 'GET', description: 'Data.gov.sg 10,000 HDB resale transactions with analytics' },
      { path: '/api/ura/token', method: 'GET, POST', description: 'URA daily token exchange and verification' },
      { path: '/api/ura/transactions', method: 'GET', description: 'URA private residential property transactions (4 batches merged)' },
      { path: '/api/ura/carparks', method: 'GET', description: 'URA live carpark lots availability and rates' },
    ],
  };

  return res.status(200).json(healthData);
}
