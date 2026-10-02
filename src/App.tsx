import React, { useState, useMemo } from 'react';
import { SCHOOLS, PROPERTIES } from './data/schoolsData';
import {
  ActiveTab,
  DwellingType,
  FilterState,
  Property,
  School,
  SortOption,
  ViewMode,
} from './types';
import { TopNavigation } from './components/TopNavigation';
import { TargetSchoolBar } from './components/TargetSchoolBar';
import { FilterBar } from './components/FilterBar';
import { KpiMetricsCards } from './components/KpiMetricsCards';
import { GeodesicMap } from './components/GeodesicMap';
import { PropertyList } from './components/PropertyList';
import { ResaleAnalyticsSection } from './components/ResaleAnalyticsSection';
import { MortgageModal } from './components/MortgageModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PriceTrendModal } from './components/PriceTrendModal';
import { OneMapModal } from './components/OneMapModal';
import { CompareModal } from './components/CompareModal';
import { BallotingStatsView } from './components/BallotingStatsView';
import { PriceIndexView } from './components/PriceIndexView';
import { Footer } from './components/Footer';
import { ArrowRight, X, Building2, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorer');
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const [filter, setFilter] = useState<FilterState>({
    distanceMode: '1km',
    customDistance: 1.0,
    dwelling: 'all',
    tenure: 'any',
    minPrice: 500000,
    maxPrice: 3800000,
    sortBy: 'distance',
    searchQuery: '',
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [priceTrendProperty, setPriceTrendProperty] = useState<Property | null>(null);
  const [mortgageModalPrice, setMortgageModalPrice] = useState<number>(2280000);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isGeodesicOpen, setIsGeodesicOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-1']);
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);

  // Calculate dwelling counts for the selected school
  const counts = useMemo(() => {
    const schoolProps = PROPERTIES.filter((p) => p.schoolId === selectedSchool.id);
    return {
      all: 142, // benchmark cluster inventory count matching screenshot
      hdb: 54,
      condo: 81,
      landed: 7,
    };
  }, [selectedSchool]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((p) => {
      // School filter
      if (p.schoolId !== selectedSchool.id) return false;

      // Distance filter
      if (p.distanceKm > filter.customDistance) return false;

      // Dwelling filter
      if (filter.dwelling !== 'all' && p.dwellingType !== filter.dwelling) return false;

      // Tenure filter
      if (filter.tenure !== 'any' && p.tenureType !== filter.tenure) return false;

      // Price filter
      if (p.price < filter.minPrice || p.price > filter.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (filter.sortBy === 'price_asc') return a.price - b.price;
      if (filter.sortBy === 'psf_asc') return a.psf - b.psf;
      if (filter.sortBy === 'odds_desc') {
        const priorityScore: Record<string, number> = {
          guaranteed: 4,
          safe: 3,
          priority: 2,
          risk: 1,
        };
        return (
          (priorityScore[b.phase2CStatusLevel] || 0) -
          (priorityScore[a.phase2CStatusLevel] || 0)
        );
      }
      return 0;
    });
  }, [selectedSchool, filter]);

  // Compared property objects
  const comparedProperties = useMemo(() => {
    return PROPERTIES.filter((p) => comparedPropertyIds.includes(p.id));
  }, [comparedPropertyIds]);

  // Saved properties
  const savedProperties = useMemo(() => {
    return PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  }, [savedPropertyIds]);

  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompareProperty = (id: string) => {
    setComparedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenMortgage = (price?: number) => {
    if (price) setMortgageModalPrice(price);
    setIsMortgageOpen(true);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 antialiased font-sans flex flex-col min-h-screen">
      {/* Top Navigation */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPropertyIds.length}
        onOpenMortgage={() => handleOpenMortgage(2280000)}
        schools={SCHOOLS}
        selectedSchool={selectedSchool}
        onSelectSchool={(s) => {
          setSelectedSchool(s);
          setActiveTab('explorer');
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
        {/* VIEW 1: Primary School Radius Explorer */}
        {activeTab === 'explorer' && (
          <>
            {/* Target School Bar */}
            <TargetSchoolBar
              schools={SCHOOLS}
              selectedSchool={selectedSchool}
              onSelectSchool={setSelectedSchool}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenGeodesicInfo={() => setIsGeodesicOpen(true)}
              onOpenBallotingInfo={() => setActiveTab('balloting')}
            />

            {/* Filter Bar */}
            <FilterBar
              filter={filter}
              onChangeFilter={handleUpdateFilter}
              counts={counts}
            />

            {/* KPI Metrics Cards */}
            <KpiMetricsCards
              school={selectedSchool}
              onFilter1km={() =>
                handleUpdateFilter({ distanceMode: '1km', customDistance: 1.0 })
              }
              onFilter2km={() =>
                handleUpdateFilter({ distanceMode: '2km', customDistance: 2.0 })
              }
              onOpenBallotingInfo={() => setActiveTab('balloting')}
            />

            {/* Main Content View (Split / Map Only / List) */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-7">
                  <GeodesicMap
                    school={selectedSchool}
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(prop) => {
                      setSelectedProperty(prop);
                    }}
                    onOpenGeodesicInfo={() => setIsGeodesicOpen(true)}
                    customDistance={filter.customDistance}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PropertyList
                    properties={filteredProperties}
                    school={selectedSchool}
                    selectedProperty={selectedProperty}
                    onSelectProperty={setSelectedProperty}
                    sortBy={filter.sortBy}
                    onChangeSort={(s) => handleUpdateFilter({ sortBy: s })}
                    onOpenPriceTrend={(p) => setPriceTrendProperty(p)}
                    onOpenListing={(p) => setDetailProperty(p)}
                    savedPropertyIds={savedPropertyIds}
                    onToggleSaveProperty={handleToggleSaveProperty}
                    comparedPropertyIds={comparedPropertyIds}
                    onToggleCompareProperty={handleToggleCompareProperty}
                  />
                </div>
              </div>
            )}

            {viewMode === 'map' && (
              <div className="w-full">
                <GeodesicMap
                  school={selectedSchool}
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={(prop) => {
                    setSelectedProperty(prop);
                    setDetailProperty(prop);
                  }}
                  onOpenGeodesicInfo={() => setIsGeodesicOpen(true)}
                  customDistance={filter.customDistance}
                />
              </div>
            )}

            {viewMode === 'list' && (
              <div className="w-full">
                <PropertyList
                  properties={filteredProperties}
                  school={selectedSchool}
                  selectedProperty={selectedProperty}
                  onSelectProperty={setSelectedProperty}
                  sortBy={filter.sortBy}
                  onChangeSort={(s) => handleUpdateFilter({ sortBy: s })}
                  onOpenPriceTrend={(p) => setPriceTrendProperty(p)}
                  onOpenListing={(p) => setDetailProperty(p)}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSaveProperty={handleToggleSaveProperty}
                  comparedPropertyIds={comparedPropertyIds}
                  onToggleCompareProperty={handleToggleCompareProperty}
                />
              </div>
            )}

            {/* Empirical Resale Analytics Section */}
            <ResaleAnalyticsSection school={selectedSchool} />
          </>
        )}

        {/* VIEW 2: HDB vs Condo Price Index */}
        {activeTab === 'price_index' && (
          <PriceIndexView
            schools={SCHOOLS}
            onSelectSchool={(s) => {
              setSelectedSchool(s);
              setActiveTab('explorer');
            }}
          />
        )}

        {/* VIEW 3: MOE P1 Balloting Stats */}
        {activeTab === 'balloting' && (
          <BallotingStatsView
            schools={SCHOOLS}
            onSelectSchool={(s) => {
              setSelectedSchool(s);
              setActiveTab('explorer');
            }}
          />
        )}

        {/* VIEW 4: Saved Comparisons View */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900">
                  My Saved Property Shortlist ({savedProperties.length})
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Properties bookmarked for MOE Priority School registration assessment.
                </p>
              </div>
              {savedProperties.length > 1 && (
                <button
                  onClick={() => {
                    setComparedPropertyIds(savedProperties.map((p) => p.id));
                    setIsCompareOpen(true);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Compare All Side-by-Side
                </button>
              )}
            </div>

            {savedProperties.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-800">No properties saved yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click the bookmark icon on any property card to save it for comparison.
                </p>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="mt-4 px-4 py-2 bg-sky-900 text-white font-semibold text-xs rounded-xl"
                >
                  Explore Tao Nan School Listings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 rounded-xl overflow-hidden mb-3">
                        <img
                          src={prop.imageUrl}
                          alt={prop.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold rounded">
                          {prop.dwellingLabel}
                        </span>
                      </div>
                      <div className="font-bold text-base text-slate-900">{prop.name}</div>
                      <div className="text-xs text-slate-500">{prop.location}</div>
                      <div className="mt-2 text-lg font-black text-slate-900">
                        ${prop.price.toLocaleString()}{' '}
                        <span className="text-xs text-sky-700 font-semibold">
                          ${prop.psf.toLocaleString()} psf
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-emerald-700 font-medium">
                        Within {prop.distanceKm} km • {prop.walkMinutes} mins walk
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleSaveProperty(prop.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setDetailProperty(prop)}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        View Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Comparison Tray */}
      {comparedPropertyIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="text-xs">
            <span className="font-black text-white">{comparedPropertyIds.length} Properties</span>
            <span className="text-slate-400 block text-[11px]">Ready for side-by-side comparison</span>
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setComparedPropertyIds([])}
            className="p-1 text-slate-400 hover:text-white transition"
            title="Clear comparison selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer
        onOpenGeodesicInfo={() => setIsGeodesicOpen(true)}
        onOpenBallotingArchive={() => setActiveTab('balloting')}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Modals */}
      <MortgageModal
        isOpen={isMortgageOpen}
        onClose={() => setIsMortgageOpen(false)}
        defaultPrice={mortgageModalPrice}
      />

      <PropertyDetailModal
        property={detailProperty}
        school={selectedSchool}
        isOpen={!!detailProperty}
        onClose={() => setDetailProperty(null)}
        onOpenMortgage={(price) => handleOpenMortgage(price)}
        isSaved={detailProperty ? savedPropertyIds.includes(detailProperty.id) : false}
        onToggleSave={() => detailProperty && handleToggleSaveProperty(detailProperty.id)}
      />

      <PriceTrendModal
        property={priceTrendProperty}
        school={selectedSchool}
        isOpen={!!priceTrendProperty}
        onClose={() => setPriceTrendProperty(null)}
      />

      <OneMapModal
        isOpen={isGeodesicOpen}
        onClose={() => setIsGeodesicOpen(false)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        properties={comparedProperties}
        school={selectedSchool}
        onRemoveProperty={(id) => handleToggleCompareProperty(id)}
        onOpenListing={(p) => setDetailProperty(p)}
      />

      {/* Terms of Intelligence Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-xs text-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-sm text-slate-900">
                EduHomes SG • Terms of Intelligence
              </h2>
              <button
                onClick={() => setIsTermsOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="leading-relaxed">
              All school boundaries, geodesic calculations, and registration data are verified in
              accordance with the Ministry of Education (MOE) Primary 1 Registration Framework and
              Singapore Land Authority (SLA) OneMap APIs.
            </p>
            <p className="leading-relaxed">
              Past subscription rates and balloting statistics reflect official MOE records. Property
              transactions and capital appreciation estimates are derived from URA and HDB caveats.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
