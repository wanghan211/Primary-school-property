/**
 * Shared helper for Urban Redevelopment Authority (URA) Data Service authentication.
 *
 * Rules:
 * 1. Each day, trade the AccessKey for today's Token:
 *    Header: AccessKey: <URA_ACCESS_KEY>
 *    Endpoint: https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1
 *
 * 2. Data calls send BOTH headers (AccessKey + Token):
 *    Endpoint: https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=...
 */

interface CachedUraToken {
  token: string;
  accessKey: string;
  expiresAt: number;
}

let cachedUraToken: CachedUraToken | null = null;

export async function getUraDailyToken(reqAccessKey?: string): Promise<{
  accessKey: string | null;
  token: string | null;
  source: 'env' | 'header' | 'cache' | 'none';
  error?: string;
}> {
  // 1. Resolve AccessKey
  const accessKey = reqAccessKey || process.env.URA_ACCESS_KEY;
  if (!accessKey) {
    return {
      accessKey: null,
      token: null,
      source: 'none',
      error: 'URA_ACCESS_KEY not provided. Set URA_ACCESS_KEY in Vercel environment variables or provide via AccessKey header.',
    };
  }

  // 2. Check cached token (valid for 23.5 hours)
  const now = Date.now();
  if (
    cachedUraToken &&
    cachedUraToken.accessKey === accessKey &&
    cachedUraToken.expiresAt > now + 60000
  ) {
    return {
      accessKey,
      token: cachedUraToken.token,
      source: 'cache',
    };
  }

  // 3. Trade AccessKey for today's Token
  try {
    const resp = await fetch('https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1', {
      method: 'GET',
      headers: {
        AccessKey: accessKey.trim(),
        'User-Agent': 'EduHomesSG-PropTech/1.0',
      },
    });

    const data = (await resp.json()) as {
      Status?: string;
      Message?: string;
      Result?: string;
    };

    if (data.Status === 'Success' && data.Result) {
      // Token is valid for 1 day; cache for 23 hours
      cachedUraToken = {
        token: data.Result,
        accessKey,
        expiresAt: now + 23 * 60 * 60 * 1000,
      };

      return {
        accessKey,
        token: data.Result,
        source: reqAccessKey ? 'header' : 'env',
      };
    } else {
      return {
        accessKey,
        token: null,
        source: 'none',
        error: data.Message || 'Failed to exchange URA AccessKey for daily Token',
      };
    }
  } catch (err: any) {
    return {
      accessKey,
      token: null,
      source: 'none',
      error: `Network error connecting to URA token endpoint: ${err.message}`,
    };
  }
}

/**
 * Invokes a URA Data Service with both required headers (AccessKey + Token).
 */
export async function invokeUraService<T = any>(
  service: string,
  params: Record<string, string | number> = {},
  reqAccessKey?: string
): Promise<{ success: boolean; data?: T; error?: string; source: 'ura_live' | 'fallback_offline' }> {
  const tokenResult = await getUraDailyToken(reqAccessKey);

  if (!tokenResult.token || !tokenResult.accessKey) {
    return {
      success: false,
      error: tokenResult.error || 'Missing URA daily token',
      source: 'fallback_offline',
    };
  }

  try {
    const query = new URLSearchParams({
      service,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    });

    const url = `https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?${query.toString()}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        AccessKey: tokenResult.accessKey,
        Token: tokenResult.token,
        'User-Agent': 'EduHomesSG-PropTech/1.0',
      },
    });

    const json = (await resp.json()) as any;

    if (json.Status === 'Success' || json.Result !== undefined) {
      return {
        success: true,
        data: json.Result || json,
        source: 'ura_live',
      };
    } else {
      return {
        success: false,
        error: json.Message || `URA Service returned status ${json.Status}`,
        source: 'ura_live',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      source: 'fallback_offline',
    };
  }
}
