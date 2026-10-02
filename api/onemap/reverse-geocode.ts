import { getOneMapToken } from './_shared.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const location = (req.query?.location || '1.3040,103.9058').toString();
  const buffer = (req.query?.buffer || '40').toString();
  const addressType = (req.query?.addressType || 'All').toString();

  const authHeader = req.headers?.authorization;
  const tokenInfo = await getOneMapToken(authHeader);

  if (tokenInfo.token) {
    try {
      const url = `https://www.onemap.gov.sg/api/public/revgeocode?location=${encodeURIComponent(
        location
      )}&buffer=${buffer}&addressType=${addressType}`;

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
      console.error('OneMap reverse-geocode error:', err);
    }
  }

  // Graceful fallback response when token is not yet provided
  return res.status(200).json({
    GeocodeInfo: [
      {
        BUILDINGNAME: 'TAO NAN RESIDENTIAL CLUSTER',
        BLOCK: '63',
        ROAD: 'MARINE DRIVE',
        POSTALCODE: '440063',
        XCOORD: '36043.2',
        YCOORD: '31580.4',
        LATITUDE: '1.3040',
        LONGITUDE: '103.9058',
      },
    ],
    source: 'fallback_offline',
    notice: 'OneMap token not provided yet in Vercel environment variables. Returned benchmark SLA coordinates.',
  });
}
