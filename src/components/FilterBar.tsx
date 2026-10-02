import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { DwellingType, FilterState, TenureType } from '../types';

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (updates: Partial<FilterState>) => void;
  counts: {
    all: number;
    hdb: number;
    condo: number;
    landed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  counts,
}) => {
  const [tenureDropdownOpen, setTenureDropdownOpen] = useState(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState(false);

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs"
      data-purpose="filter-bar"
    >
      {/* Distance Radio Presets and Slider */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
          Distance:
        </span>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() =>
              onChangeFilter({ distanceMode: '1km', customDistance: 1.0 })
            }
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              filter.distanceMode === '1km'
                ? 'text-white bg-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Within 1km (Priority 1)
          </button>
          <button
            onClick={() =>
              onChangeFilter({ distanceMode: '2km', customDistance: 2.0 })
            }
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition cursor-pointer ${
              filter.distanceMode === '2km'
                ? 'text-white bg-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            1km – 2km (Priority 2)
          </button>
          <button
            onClick={() =>
              onChangeFilter({ distanceMode: 'all', customDistance: 3.0 })
            }
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              filter.distanceMode === 'all'
                ? 'text-white bg-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (Up to 3km)
          </button>
        </div>

        {/* Custom Slider Input */}
        <div className="flex items-center gap-2 pl-2">
          <span className="text-slate-400 text-[11px]">Custom:</span>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={filter.customDistance}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangeFilter({
                customDistance: val,
                distanceMode: val <= 1.0 ? '1km' : val <= 2.0 ? '2km' : 'all',
              });
            }}
            className="w-20 accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="font-semibold text-slate-800 tabular-nums">
            {filter.customDistance.toFixed(1)} km
          </span>
        </div>
      </div>

      {/* Dwelling, Tenure & Price Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dwelling Types */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => onChangeFilter({ dwelling: 'all' })}
            className={`px-2.5 py-1 text-xs rounded transition cursor-pointer ${
              filter.dwelling === 'all'
                ? 'text-slate-900 font-semibold bg-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => onChangeFilter({ dwelling: 'hdb' })}
            className={`px-2.5 py-1 text-xs rounded transition cursor-pointer ${
              filter.dwelling === 'hdb'
                ? 'text-slate-900 font-semibold bg-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            HDB Resale ({counts.hdb})
          </button>
          <button
            onClick={() => onChangeFilter({ dwelling: 'condo' })}
            className={`px-2.5 py-1 text-xs rounded transition cursor-pointer ${
              filter.dwelling === 'condo'
                ? 'text-slate-900 font-semibold bg-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Condo ({counts.condo})
          </button>
          <button
            onClick={() => onChangeFilter({ dwelling: 'landed' })}
            className={`px-2.5 py-1 text-xs rounded transition cursor-pointer ${
              filter.dwelling === 'landed'
                ? 'text-slate-900 font-semibold bg-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Landed ({counts.landed})
          </button>
        </div>

        {/* Tenure Filter */}
        <div className="relative">
          <button
            onClick={() => setTenureDropdownOpen(!tenureDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 font-medium transition cursor-pointer"
          >
            <span>
              Tenure:{' '}
              <strong className="capitalize">
                {filter.tenure === 'any'
                  ? 'Any'
                  : filter.tenure === 'freehold'
                  ? 'Freehold'
                  : '99-year'}
              </strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {tenureDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40">
              {(['any', 'freehold', '99-year'] as TenureType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onChangeFilter({ tenure: t });
                    setTenureDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition capitalize ${
                    filter.tenure === t
                      ? 'bg-sky-50 text-sky-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t === 'any' ? 'Any Tenure' : t === 'freehold' ? 'Freehold' : '99-yr Leasehold'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <button
            onClick={() => setPricePopoverOpen(!pricePopoverOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 font-medium transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              ${(filter.minPrice / 1000).toFixed(0)}k - $
              {(filter.maxPrice / 1000000).toFixed(1)}M
            </span>
          </button>

          {pricePopoverOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-40 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Price Range Filter</div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Max Budget</span>
                  <span className="font-bold text-slate-900">
                    ${(filter.maxPrice / 1000000).toFixed(2)}M
                  </span>
                </div>
                <input
                  type="range"
                  min="800000"
                  max="6000000"
                  step="100000"
                  value={filter.maxPrice}
                  onChange={(e) =>
                    onChangeFilter({ maxPrice: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => {
                    onChangeFilter({ minPrice: 500000, maxPrice: 3800000 });
                    setPricePopoverOpen(false);
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800"
                >
                  Reset
                </button>
                <button
                  onClick={() => setPricePopoverOpen(false)}
                  className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
