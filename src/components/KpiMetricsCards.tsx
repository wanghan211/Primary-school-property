import React from 'react';
import { Compass, Navigation2, TrendingUp, AlertOctagon, AlertTriangle } from 'lucide-react';
import { School } from '../types';

interface KpiMetricsCardsProps {
  school: School;
  onFilter1km: () => void;
  onFilter2km: () => void;
  onOpenBallotingInfo: () => void;
}

export const KpiMetricsCards: React.FC<KpiMetricsCardsProps> = ({
  school,
  onFilter1km,
  onFilter2km,
  onOpenBallotingInfo,
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="metric-kpis">
      {/* Metric 1: 1km Zone Inventory */}
      <div
        onClick={onFilter1km}
        className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>1km Zone Inventory</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded text-[11px]">
            1k
          </span>
        </div>
        <div className="text-2xl font-black text-slate-900">58 Units Listed</div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>
            HDB: <strong>${school.hdb1kmPsf} psf</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Condo: <strong>${school.condo1kmPsf.toLocaleString()} psf</strong>
          </span>
        </div>
      </div>

      {/* Metric 2: 1-2km Secondary Zone */}
      <div
        onClick={onFilter2km}
        className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <Navigation2 className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>1-2km Secondary Zone</span>
          </div>
          <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded text-[11px]">
            2k
          </span>
        </div>
        <div className="text-2xl font-black text-slate-900">84 Units Listed</div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>
            HDB: <strong>${school.hdb2kmPsf} psf</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Condo: <strong>${school.condo2kmPsf.toLocaleString()} psf</strong>
          </span>
        </div>
      </div>

      {/* Metric 3: School Premium */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
            <TrendingUp className="w-4 h-4" />
            <span>1km School Premium</span>
          </div>
          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded text-[11px]">
            %
          </span>
        </div>
        <div className="text-2xl font-black text-indigo-900">
          +{school.psfPremiumPercent}% PSF
        </div>
        <div className="text-xs text-slate-500 mt-1 truncate">
          {school.psfDeltaNote}
        </div>
      </div>

      {/* Metric 4: Balloting Odds */}
      <div
        onClick={onOpenBallotingInfo}
        className="bg-white border border-rose-200 rounded-2xl p-4 shadow-xs bg-gradient-to-br from-white to-rose-50/30 hover:shadow-md hover:border-rose-300 transition cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
            <AlertOctagon className="w-4 h-4" />
            <span>Phase 2C SC Odds</span>
          </div>
          <span className="px-2 py-0.5 bg-rose-100 border border-rose-300 text-rose-800 font-bold rounded text-[11px] flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            <span>Risk</span>
          </span>
        </div>
        <div className="text-2xl font-black text-rose-700">
          {school.ballotingChanceSCWithin1km}% Balloting Chance
        </div>
        <div className="text-xs text-rose-600 font-medium mt-1 truncate">
          {school.ballotingNote}
        </div>
      </div>
    </section>
  );
};
