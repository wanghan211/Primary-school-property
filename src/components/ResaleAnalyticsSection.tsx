import React, { useState } from 'react';
import { Percent, TrendingUp } from 'lucide-react';
import { School } from '../types';

interface ResaleAnalyticsSectionProps {
  school: School;
}

export const ResaleAnalyticsSection: React.FC<ResaleAnalyticsSectionProps> = ({
  school,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Maximum value for chart height scaling
  const maxPsf = 2200;
  const minPsf = 1200;

  const calculateHeightPercent = (val: number) => {
    return Math.max(15, Math.min(100, ((val - minPsf) / (maxPsf - minPsf)) * 100));
  };

  return (
    <section
      className="mt-3 pt-6 border-t border-slate-200"
      data-purpose="empirical-analytics-section"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            Empirical Resale Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {school.shortName} 1km Premium &amp; 5-Year Capital Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comparing property appreciation between &lt;1km Priority Circle vs 1–2km buffer across
            HDB &amp; Private Condos.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Cluster Benchmark:</span>
          <span className="font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-xs">
            {school.district}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Analytics Card: PSF Gap Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  PSF Gap: 1km Zone vs 1–2km Zone
                </h3>
                <p className="text-xs text-slate-400">
                  2020 to 2024 Cumulative URA &amp; HDB Resale Data
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span> Within 1km
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-3 h-3 rounded bg-blue-300"></span> 1km - 2km
                </span>
              </div>
            </div>

            {/* Styled Bar Chart Graphic */}
            <div className="relative h-60 pt-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-2">
              {/* Y-axis reference lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-300 w-full text-[10px] text-slate-400 pt-0.5 tabular-nums">
                  $2,100
                </div>
                <div className="border-b border-dashed border-slate-300 w-full text-[10px] text-slate-400 pt-0.5 tabular-nums">
                  $1,800
                </div>
                <div className="border-b border-dashed border-slate-300 w-full text-[10px] text-slate-400 pt-0.5 tabular-nums">
                  $1,500
                </div>
                <div className="border-b border-dashed border-slate-300 w-full text-[10px] text-slate-400 pt-0.5 tabular-nums">
                  $1,200
                </div>
              </div>

              {/* Column Groups */}
              {school.historicalPsf.map((item) => {
                const height1km = calculateHeightPercent(item.within1kmPsf);
                const height2km = calculateHeightPercent(item.outer2kmPsf);

                return (
                  <div
                    key={item.year}
                    className="flex-1 flex flex-col items-center gap-1.5 z-10 relative"
                  >
                    {item.isMoeShiftYear && (
                      <span className="absolute -top-3 text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap shadow-xs">
                        MOE Boundary Shift
                      </span>
                    )}

                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Within 1km Bar */}
                      <div
                        onMouseEnter={() => setActiveTooltip(`${item.year}-1km`)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="w-5 bg-emerald-600 rounded-t-md hover:bg-emerald-500 transition-all cursor-pointer relative group"
                        style={{ height: `${height1km}%` }}
                      >
                        <div
                          className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30 transition-opacity ${
                            activeTooltip === `${item.year}-1km` ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          ${item.within1kmPsf.toLocaleString()} psf
                        </div>
                      </div>

                      {/* 1km - 2km Bar */}
                      <div
                        onMouseEnter={() => setActiveTooltip(`${item.year}-2km`)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="w-5 bg-blue-300 rounded-t-md hover:bg-blue-400 transition-all cursor-pointer relative group"
                        style={{ height: `${height2km}%` }}
                      >
                        <div
                          className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30 transition-opacity ${
                            activeTooltip === `${item.year}-2km` ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          ${item.outer2kmPsf.toLocaleString()} psf
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs ${
                        item.isMoeShiftYear ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="text-[11px]">
              *Note: 2022 revised MOE calculation method expanded 1km boundaries, increasing buyer competition.
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{school.growth5Year}% Growth (5-yr)</span>
            </span>
          </div>
        </div>

        {/* Right Analytics Card: Housing Segment Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Segment Breakdown</h3>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                12-Mo Volume
              </span>
            </div>

            {/* List of Segments */}
            <div className="space-y-3 text-xs">
              {school.segmentBreakdown.map((seg, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                >
                  <div>
                    <div className="font-bold text-slate-900">{seg.title}</div>
                    <div className="text-[11px] text-slate-400">{seg.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-sm tabular-nums">
                      {seg.avgPrice}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium tabular-nums">
                      {seg.psfAvg} • {seg.txns} txns
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Yield Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-sky-600" />
              <span>Avg Gross Rental Yield:</span>
            </span>
            <span className="font-bold text-slate-900 text-sm tabular-nums">
              {school.rentalYield}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
