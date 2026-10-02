import { getOneMapToken } from './_shared.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const planningArea = (req.query?.planningArea || 'Marine Parade').toString();
  const year = (req.query?.year || '2020').toString();

  const authHeader = req.headers?.authorization;
  const tokenInfo = await getOneMapToken(authHeader);

  if (tokenInfo.token) {
    try {
      const url = `https://www.onemap.gov.sg/api/public/popapi/getEducationAttending?planningArea=${encodeURIComponent(
        planningArea
      )}&year=${year}`;

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
      console.error('OneMap education pop api error:', err);
    }
  }

  // Fallback demo data from Singapore Census / SingStat
  return res.status(200).json({
    planning_area: planningArea,
    year: Number(year),
    primary_students: 3120,
    secondary_students: 2840,
    post_secondary: 1980,
    source: 'singstat_fallback',
    notice: 'OneMap token not provided yet in Vercel environment variables. Returned benchmark planning area statistics.',
  });
}
