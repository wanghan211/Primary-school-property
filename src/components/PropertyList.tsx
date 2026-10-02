import React, { useState } from 'react';
import {
  Footprints,
  LineChart,
  Check,
  Building2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Property, School, SortOption } from '../types';

interface PropertyListProps {
  properties: Property[];
  school: School;
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  sortBy: SortOption;
  onChangeSort: (sort: SortOption) => void;
  onOpenPriceTrend: (property: Property) => void;
  onOpenListing: (property: Property) => void;
  savedPropertyIds: string[];
  onToggleSaveProperty: (propertyId: string) => void;
  comparedPropertyIds: string[];
  onToggleCompareProperty: (propertyId: string) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  school,
  selectedProperty,
  onSelectProperty,
  sortBy,
  onChangeSort,
  onOpenPriceTrend,
  onOpenListing,
  savedPropertyIds,
  onToggleSaveProperty,
  comparedPropertyIds,
  onToggleCompareProperty,
}) => {
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  return (
    <section className="flex flex-col h-[750px]" data-purpose="listings-container">
      {/* Header & Sort */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {properties.length} Properties
          </h2>
          <p className="text-xs text-slate-500">Around {school.shortName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as SortOption)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg pl-2.5 pr-8 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="distance">Nearest to School (1km first)</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="psf_asc">Lowest PSF First</option>
              <option value="odds_desc">Highest MOE P1 Odds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 custom-scroll">
        {properties.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-slate-800">No properties match your filter</p>
            <p className="text-xs text-slate-400 mt-1">
              Try expanding the distance slider or adjusting the price range.
            </p>
          </div>
        ) : (
          properties.map((property) => {
            const isSelected = selectedProperty?.id === property.id;
            const isSaved = savedPropertyIds.includes(property.id);
            const isCompared = comparedPropertyIds.includes(property.id);
            const hasImgError = imageErrorMap[property.id];

            return (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className={`bg-white border rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex gap-4">
                  {/* Thumbnail with resilient fallback */}
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                    {!hasImgError ? (
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImageErrorMap((prev) => ({ ...prev, [property.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <Building2 className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[10px] font-medium text-slate-500">
                          {property.dwellingLabel}
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 text-white text-[10px] font-bold rounded backdrop-blur ${
                        property.dwellingType === 'hdb'
                          ? 'bg-blue-900/85'
                          : property.dwellingType === 'landed'
                          ? 'bg-amber-900/85'
                          : 'bg-slate-900/85'
                      }`}
                    >
                      {property.dwellingLabel}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveProperty(property.id);
                      }}
                      title={isSaved ? 'Remove from saved' : 'Save property'}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur transition ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white/80 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 fill-current" />
                    </button>
                  </div>

                  {/* Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          property.distanceKm <= 1.0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            property.distanceKm <= 1.0 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                        ></span>
                        Within {property.distanceKm <= 1.0 ? '1km' : '2km'} ({property.distanceKm}km)
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {property.tenure}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {property.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{property.location}</p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900 tabular-nums">
                        ${property.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-sky-700 tabular-nums">
                        ${property.psf.toLocaleString()} psf
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Specs & Walk Distance Badge */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-600 truncate">
                    <span className="font-semibold text-slate-800">
                      {property.beds} Beds • {property.baths} Baths
                    </span>{' '}
                    • {property.sqft.toLocaleString()} sqft
                  </div>
                  <div className="text-right text-slate-500 truncate">
                    {property.additionalSpec || `Built ${property.builtYear}`}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium truncate">
                    <Footprints className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      <strong>
                        {property.walkMinutes} mins walk ({property.walkDistanceMeters}m)
                      </strong>{' '}
                      {property.walkNote}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      property.phase2CStatusLevel === 'safe'
                        ? 'bg-emerald-100/80 text-emerald-800'
                        : property.phase2CStatusLevel === 'guaranteed'
                        ? 'bg-emerald-100/80 text-emerald-800'
                        : property.phase2CStatusLevel === 'priority'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {property.phase2CStatus}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPriceTrend(property);
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                  >
                    <LineChart className="w-3.5 h-3.5" />
                    <span>
                      {property.dwellingType === 'hdb'
                        ? 'HDB Resale History'
                        : 'Price Trend & Transacted'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompareProperty(property.id);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border cursor-pointer ${
                        isCompared
                          ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {isCompared ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-sky-700" />
                          <span>Added</span>
                        </span>
                      ) : (
                        'Compare'
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenListing(property);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-xs cursor-pointer"
                    >
                      View Listing
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
