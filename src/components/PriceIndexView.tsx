import React from 'react';
import { TrendingUp, Building2, School as SchoolIcon } from 'lucide-react';
import { School } from '../types';

interface PriceIndexViewProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
}

export const PriceIndexView: React.FC<PriceIndexViewProps> = ({
  schools,
  onSelectSchool,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Singapore School Cluster Price Index</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          HDB Resale vs Private Condo Capital Index (2020 – 2026)
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Historical valuation deltas between homes located within the 1.0km priority perimeter
          versus the outer 1.0km–2.0km zone.
        </p>
      </div>

      {/* Grid of School Price Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{school.name}</h3>
                  <p className="text-xs text-slate-400">{school.district}</p>
                </div>
                <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-200 text-xs px-2.5 py-1 rounded-lg">
                  +{school.psfPremiumPercent}% PSF Premium
                </span>
              </div>

              {/* Price comparison numbers */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                    Within 1.0km Zone
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">HDB Resale:</span>
                    <strong className="text-slate-900 tabular-nums">
                      ${school.hdb1kmPsf} psf
                    </strong>
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Condo:</span>
                    <strong className="text-slate-900 tabular-nums">
                      ${school.condo1kmPsf.toLocaleString()} psf
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                  <div className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
                    1.0km – 2.0km Zone
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">HDB Resale:</span>
                    <strong className="text-slate-900 tabular-nums">
                      ${school.hdb2kmPsf} psf
                    </strong>
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Condo:</span>
                    <strong className="text-slate-900 tabular-nums">
                      ${school.condo2kmPsf.toLocaleString()} psf
                    </strong>
                  </div>
                </div>
              </div>

              {/* Segment breakdown summary */}
              <div className="space-y-2 text-xs">
                {school.segmentBreakdown.slice(0, 3).map((seg, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 rounded-lg bg-slate-50"
                  >
                    <span className="font-medium text-slate-700">{seg.title}</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {seg.avgPrice} ({seg.psfAvg})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                5-Year Growth: <strong>+{school.growth5Year}%</strong>
              </span>
              <button
                onClick={() => onSelectSchool(school)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                View School Radius
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
