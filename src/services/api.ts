/**
 * Frontend client service for /api endpoints (OneMap & data.gov.sg).
 */

export interface HdbApiResponse {
  success: boolean;
  query: {
    town: string;
    street: string;
    flatType: string;
    block: string;
    limit: number;
  };
  analytics: {
    totalTransactionsFound: number;
    returnedCount: number;
    avgPrice: number;
    avgPsf: number;
    minPrice: number;
    maxPrice: number;
    flatTypeBreakdown: Array<{
      flatType: string;
      count: number;
      avgPrice: number;
      avgPsf: number;
    }>;
  };
  records: Array<{
    id: number;
    month: string;
    town: string;
    flatType: string;
    block: string;
    streetName: string;
    address: string;
    storeyRange: string;
    floorAreaSqm: number;
    floorAreaSqft: number;
    flatModel: string;
    leaseCommenceDate: string;
    remainingLease: string;
    resalePrice: number;
    psf: number;
  }>;
  datasetInfo: {
    dataset: string;
    resourceId: string;
    source: string;
  };
}

export interface RadiusApiResponse {
  success: boolean;
  school: {
    id: string;
    name: string;
    district: string;
    center: {
      lat: number;
      lng: number;
    };
  };
  targetLocation: {
    lat: number;
    lng: number;
  };
  measurement: {
    geodesicDistanceMeters: number;
    geodesicDistanceKm: number;
    walkDistanceMeters: number;
    walkDurationMinutes: number;
    framework: string;
  };
  moePriority: {
    category: 'within_1km' | 'within_2km' | 'outside_2km';
    label: string;
    group: number;
    isPriority1: boolean;
    isPriority2: boolean;
    phase2CBallotingStatus: string;
    estimatedBallotingChance: number;
  };
  mapLayers: {
    ring1km: any;
    ring2km: any;
  };
  onemapStatus: {
    hasToken: boolean;
    source: string;
  };
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: Array<{
    SEARCHVAL: string;
    BLK_NO: string;
    ROAD_NAME: string;
    BUILDING: string;
    ADDRESS: string;
    POSTAL: string;
    X: string;
    Y: string;
    LATITUDE: string;
    LONGITUDE: string;
  }>;
  source: string;
  notice?: string;
}

export async function fetchHdbResaleData(params: {
  town?: string;
  street?: string;
  flatType?: string;
  block?: string;
  q?: string;
  limit?: number;
}): Promise<HdbApiResponse> {
  const query = new URLSearchParams();
  if (params.town) query.set('town', params.town);
  if (params.street) query.set('street', params.street);
  if (params.flatType) query.set('flat_type', params.flatType);
  if (params.block) query.set('block', params.block);
  if (params.q) query.set('q', params.q);
  if (params.limit) query.set('limit', params.limit.toString());

  const resp = await fetch(`/api/hdb/resale?${query.toString()}`);
  if (!resp.ok) {
    throw new Error(`HDB API returned ${resp.status}`);
  }
  return resp.json();
}

export async function calculateRadiusInfo(
  schoolId: string,
  lat: number,
  lng: number
): Promise<RadiusApiResponse> {
  const resp = await fetch(`/api/onemap/radius?schoolId=${encodeURIComponent(schoolId)}&lat=${lat}&lng=${lng}`);
  if (!resp.ok) {
    throw new Error(`Radius API returned ${resp.status}`);
  }
  return resp.json();
}

export async function searchOneMap(searchVal: string): Promise<OneMapSearchResponse> {
  const resp = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(searchVal)}`);
  if (!resp.ok) {
    throw new Error(`OneMap Search API returned ${resp.status}`);
  }
  return resp.json();
}

export async function getOneMapTokenStatus(): Promise<{ status: string; hasToken: boolean; source: string; message: string }> {
  const resp = await fetch('/api/onemap/token');
  if (!resp.ok) {
    throw new Error(`Token API returned ${resp.status}`);
  }
  return resp.json();
}

export interface UraTransactionItem {
  id: string;
  project: string;
  street: string;
  district: string;
  marketSegment: string;
  contractDate: string;
  price: number;
  areaSqm: number;
  areaSqft: number;
  psf: number;
  propertyType: string;
  tenure: string;
  typeOfSale: 'New Sale' | 'Sub Sale' | 'Resale';
  floorRange: string;
  noOfUnits: number;
}

export interface UraTransactionsResponse {
  success: boolean;
  service: string;
  source: 'ura_live' | 'fallback_offline';
  notice?: string;
  query: {
    district: string;
    project: string;
    propertyType: string;
    batchesFetched: number[];
    limit: number;
  };
  analytics: {
    totalFound: number;
    returned: number;
    avgPrice: number;
    avgPsf: number;
    minPrice: number;
    maxPrice: number;
  };
  transactions: UraTransactionItem[];
}

export async function fetchUraPrivateTransactions(params: {
  district?: string;
  project?: string;
  propertyType?: string;
  batch?: string;
  limit?: number;
}): Promise<UraTransactionsResponse> {
  const query = new URLSearchParams();
  if (params.district) query.set('district', params.district);
  if (params.project) query.set('project', params.project);
  if (params.propertyType) query.set('propertyType', params.propertyType);
  if (params.batch) query.set('batch', params.batch);
  if (params.limit) query.set('limit', params.limit.toString());

  const resp = await fetch(`/api/ura/transactions?${query.toString()}`);
  if (!resp.ok) {
    throw new Error(`URA Transactions API returned ${resp.status}`);
  }
  return resp.json();
}

export async function fetchUraCarparks(params?: {
  type?: 'availability' | 'details' | 'both';
  name?: string;
}): Promise<any> {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.name) query.set('name', params.name);

  const resp = await fetch(`/api/ura/carparks?${query.toString()}`);
  if (!resp.ok) {
    throw new Error(`URA Carparks API returned ${resp.status}`);
  }
  return resp.json();
}

export async function getUraTokenStatus(): Promise<{
  status: string;
  hasToken: boolean;
  source: string;
  message: string;
}> {
  const resp = await fetch('/api/ura/token');
  if (!resp.ok) {
    throw new Error(`URA Token API returned ${resp.status}`);
  }
  return resp.json();
}
