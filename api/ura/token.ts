import { getUraDailyToken } from './_shared.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccessKey, X-URA-Access-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const reqAccessKey =
    req.headers?.['accesskey'] ||
    req.headers?.['x-ura-access-key'] ||
    req.query?.accessKey ||
    req.body?.accessKey;

  const result = await getUraDailyToken(reqAccessKey);

  if (result.token) {
    return res.status(200).json({
      status: 'Success',
      hasToken: true,
      source: result.source,
      message: 'URA daily token is active and valid for today.',
      tokenMasked: `${result.token.substring(0, 8)}...`,
    });
  }

  return res.status(200).json({
    status: 'Ready',
    hasToken: false,
    source: result.source,
    message:
      result.error ||
      'URA AccessKey not configured yet in Vercel. Set URA_ACCESS_KEY in your Vercel project environment variables.',
    instructions: {
      step1: 'Sign up for URA Space API access at https://www.ura.gov.sg/maps/api/',
      step2: 'Add URA_ACCESS_KEY in Vercel Project Settings > Environment Variables',
      step3: 'Token is traded automatically each day via https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
    },
  });
}
