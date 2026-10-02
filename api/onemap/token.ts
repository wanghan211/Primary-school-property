import { getOneMapToken } from './_shared.ts';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Explicitly mint or update token
  if (req.method === 'POST') {
    const { email, password } = req.body || {};
    const effectiveEmail = email || process.env.ONEMAP_EMAIL;
    const effectivePassword = password || process.env.ONEMAP_PASSWORD;

    if (!effectiveEmail || !effectivePassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing email or password to mint OneMap token. Set ONEMAP_EMAIL/ONEMAP_PASSWORD in Vercel or provide in JSON body.',
      });
    }

    try {
      const resp = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: effectiveEmail, password: effectivePassword }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        return res.status(resp.status).json({
          success: false,
          error: 'Failed to mint token from OneMap official API',
          details: data,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OneMap token minted successfully. Token is valid for 3 days.',
        access_token: data.access_token,
        expiry_timestamp: data.expiry_timestamp,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: 'Network error calling OneMap token endpoint',
        details: err.message,
      });
    }
  }

  // GET: Check token status
  const authHeader = req.headers?.authorization;
  const tokenInfo = await getOneMapToken(authHeader);

  return res.status(200).json({
    status: tokenInfo.token ? 'configured' : 'missing_token',
    source: tokenInfo.source,
    hasToken: !!tokenInfo.token,
    message: tokenInfo.token
      ? 'OneMap API token is active and ready.'
      : 'OneMap token not provided yet in Vercel. Set ONEMAP_API_TOKEN or ONEMAP_EMAIL/ONEMAP_PASSWORD in your Vercel project settings.',
  });
}
