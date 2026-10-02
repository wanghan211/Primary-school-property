export type DwellingType = 'all' | 'hdb' | 'condo' | 'landed';
export type TenureType = 'any' | 'freehold' | '99-year';
export type SortOption = 'distance' | 'price_asc' | 'psf_asc' | 'odds_desc';
export type ActiveTab = 'explorer' | 'price_index' | 'balloting' | 'saved';
export type ViewMode = 'split' | 'map' | 'list';

export interface School {
  id: string;
  name: string;
  shortName: string;
  zone: string;
  district: string;
  type: string;
  affiliation?: string;
  intakeSeats: number;
  phase2CSubscription: number;
  ballotingRisk: 'High Risk' | 'Moderate' | 'Safe';
  ballotingChanceSCWithin1km: number;
  ballotingNote: string;
  psfPremiumPercent: number;
  psfDeltaNote: string;
  hdb1kmPsf: number;
  condo1kmPsf: number;
  hdb2kmPsf: number;
  condo2kmPsf: number;
  mapCoords: { x: number; y: number };
  lat?: number;
  lng?: number;
  growth5Year: number;
  mrtStations: { name: string; line: string; code: string; x: number; y: number; lat?: number; lng?: number }[];
  preschools: { name: string; x: number; y: number; lat?: number; lng?: number }[];
  historicalPsf: {
    year: string;
    within1kmPsf: number;
    outer2kmPsf: number;
    isMoeShiftYear?: boolean;
  }[];
  segmentBreakdown: {
    title: string;
    sub: string;
    avgPrice: string;
    psfAvg: string;
    txns: number;
  }[];
  rentalYield: string;
}

export interface Property {
  id: string;
  schoolId: string;
  name: string;
  location: string;
  district: string;
  dwellingType: 'condo' | 'hdb' | 'landed';
  dwellingLabel: string;
  tenure: string;
  tenureType: 'freehold' | '99-year';
  price: number;
  psf: number;
  beds: number;
  baths: number;
  sqft: number;
  additionalSpec?: string;
  builtYear: string;
  distanceKm: number;
  walkMinutes: number;
  walkDistanceMeters: number;
  walkNote: string;
  phase2CStatus: 'Phase 2C SC: Safe' | 'Phase 2C Priority #1' | 'Phase 2C Guaranteed' | 'Phase 2C: High Risk' | 'Outer Buffer Zone';
  phase2CStatusLevel: 'safe' | 'priority' | 'guaranteed' | 'risk';
  imageUrl: string;
  mapPos: { x: number; y: number };
  lat?: number;
  lng?: number;
  history: {
    date: string;
    price: number;
    psf: number;
    unit: string;
    areaSqft: number;
  }[];
  description?: string;
}

export interface FilterState {
  distanceMode: '1km' | '2km' | 'all' | 'custom';
  customDistance: number;
  dwelling: DwellingType;
  tenure: TenureType;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  searchQuery: string;
}
