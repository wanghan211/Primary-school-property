import React, { useState } from 'react';
import {
  School as SchoolIcon,
  ChevronDown,
  Info,
  ShieldCheck,
  Columns2,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react';
import { School, ViewMode } from '../types';

interface TargetSchoolBarProps {
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenGeodesicInfo: () => void;
  onOpenBallotingInfo: () => void;
}

export const TargetSchoolBar: React.FC<TargetSchoolBarProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  viewMode,
  setViewMode,
  onOpenGeodesicInfo,
  onOpenBallotingInfo,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section
      className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4"
      data-purpose="school-target-header"
    >
      {/* School Selector Dropdown Trigger & Alert Ribbon */}
      <div className="flex flex-wrap items-center gap-3.5">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition cursor-pointer group text-left"
          >
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg group-hover:bg-sky-200 transition">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Target Primary School
              </div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>{selectedSchool.name}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Dropdown Options */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Benchmark Primary School
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {schools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => {
                      onSelectSchool(school);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                      selectedSchool.id === school.id
                        ? 'bg-sky-50 border border-sky-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{school.shortName}</div>
                      <div className="text-xs text-slate-500">{school.district}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{school.type}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {school.phase2CSubscription}% P2C
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Odds: {school.ballotingChanceSCWithin1km}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MOE Phase 2C Balloting Alert Ribbon */}
        <div
          onClick={onOpenBallotingInfo}
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-rose-50 border border-rose-200/80 rounded-xl cursor-pointer hover:bg-rose-100/70 transition"
          role="button"
          tabIndex={0}
          title="Click to view detailed Phase 2C breakdown"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
          <div className="text-xs">
            <span className="font-bold text-rose-800 uppercase tracking-tight">
              Phase 2C Balloting Alert
            </span>
            <span className="text-slate-400 mx-1">•</span>
            <span className="font-medium text-rose-700">
              Co-ed • {selectedSchool.phase2CSubscription}% Subscription (2024 MOE P1)
            </span>
          </div>
          <Info className="w-3.5 h-3.5 text-rose-400 ml-1 hover:text-rose-600" />
        </div>
      </div>

      {/* Verification Badge & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3">
        {/* Geodesic Guarantee */}
        <button
          onClick={onOpenGeodesicInfo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100/70 transition cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OneMap Geodesic Verified</span>
        </button>

        {/* View Controls */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-600">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Split</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Only</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>
    </section>
  );
};
