/**
 * Shared helper for OneMap API authentication and token handling.
 * Supports:
 * 1. Environment variable: process.env.ONEMAP_API_TOKEN
 * 2. Auto-minting via process.env.ONEMAP_EMAIL and process.env.ONEMAP_PASSWORD
 * 3. In-memory token cache (valid for 3 days)
 * 4. Request Authorization header override
 */

interface CachedToken {
  token: string;
  expiresAt: number;
}

let inMemoryToken: CachedToken | null = null;

export async function getOneMapToken(reqAuthHeader?: string): Promise<{ token: string | null; source: string; error?: string }> {
  // 1. If caller supplied Bearer token in request header, prefer that
  if (reqAuthHeader && reqAuthHeader.startsWith('Bearer ')) {
    const headerToken = reqAuthHeader.substring(7).trim();
    if (headerToken) {
      return { token: headerToken, source: 'header' };
    }
  }

  // 2. Check process.env.ONEMAP_API_TOKEN (e.g. configured in Vercel)
  if (process.env.ONEMAP_API_TOKEN) {
    return { token: process.env.ONEMAP_API_TOKEN.trim(), source: 'env' };
  }

  // 3. Check in-memory cached token
  const now = Date.now();
  if (inMemoryToken && inMemoryToken.expiresAt > now + 60000) {
    return { token: inMemoryToken.token, source: 'cache' };
  }

  // 4. If email and password are provided in env, mint a new token
  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;

  if (email && password) {
    try {
      const resp = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        return {
          token: null,
          source: 'none',
          error: `Failed to mint token from OneMap (status ${resp.status})`,
        };
      }

      const data = (await resp.json()) as { access_token?: string; expiry_timestamp?: string };
      if (data.access_token) {
        // Cache token for 2.8 days
        const expiresAt = now + 2.8 * 24 * 60 * 60 * 1000;
        inMemoryToken = {
          token: data.access_token,
          expiresAt,
        };
        return { token: data.access_token, source: 'auto_mint' };
      }
    } catch (err: any) {
      return { token: null, source: 'none', error: err.message };
    }
  }

  return {
    token: null,
    source: 'none',
    error: 'OneMap token not provided. Please set ONEMAP_API_TOKEN or ONEMAP_EMAIL & ONEMAP_PASSWORD in Vercel environment variables.',
  };
}
