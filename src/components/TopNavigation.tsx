import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Bookmark,
  Calculator,
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ActiveTab, School } from '../types';

interface TopNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenMortgage: () => void;
  schools: School[];
  selectedSchool: School;
  onSelectSchool: (school: School) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenMortgage,
  schools,
  selectedSchool,
  onSelectSchool,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState(selectedSchool.name);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Sync search input when selectedSchool changes
  React.useEffect(() => {
    setSearchValue(selectedSchool.name);
  }, [selectedSchool]);

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      s.district.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Primary Search Bar */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition">
                EduHomes
                <span className="text-sky-600 text-sm font-semibold ml-1 px-1.5 py-0.5 bg-sky-50 rounded border border-sky-200">
                  SG
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Primary School Radius &amp; Property Intel
              </p>
            </div>
          </button>

          {/* Global School Quick Search Input */}
          <div className="relative hidden md:block w-72 lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search Tao Nan, ACS, Nanyang..."
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />

            {/* School Autocomplete Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Singapore Primary School
                </div>
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <button
                      key={school.id}
                      onMouseDown={() => {
                        onSelectSchool(school);
                        setSearchValue(school.name);
                        setSearchFocused(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition flex items-center justify-between ${
                        selectedSchool.id === school.id ? 'bg-sky-50 font-semibold text-sky-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{school.shortName}</div>
                        <div className="text-[11px] text-slate-500">{school.district}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                        P2C: {school.phase2CSubscription}%
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-500">No matching school found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3.5 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-sky-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            School Radius Explorer
          </button>
          <button
            onClick={() => setActiveTab('price_index')}
            className={`px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'price_index'
                ? 'bg-sky-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            HDB vs Condo Price Index
          </button>
          <button
            onClick={() => setActiveTab('balloting')}
            className={`px-3 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'balloting'
                ? 'bg-sky-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            MOE P1 Balloting Stats
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-sky-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved Comparisons</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Utility Tools & User Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMortgage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-500" />
            <span>Mortgage</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg border border-slate-200">
            <span>SGD ($)</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">MOE &amp; Property Alerts</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="p-3 text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Phase 2C Risk Advisory</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Tao Nan School 2024 MOE P1 registration closed at 184% subscription. All PR and Citizens &gt; 1km eliminated.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                  </div>
                  <div className="p-3 text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>New Listing within 0.38km</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Parkway Residences Freehold 3-Bed newly listed at $2,280,000 ($2,035 psf).
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">5 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs border border-slate-300 hover:ring-2 hover:ring-sky-500/20 transition">
                EL
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Dr. Edwin Lim</div>
                  <div className="text-[11px] text-slate-500">P1 2025 Parent Applicant</div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('saved');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                >
                  My Shortlisted Homes ({savedCount})
                </button>
                <button
                  onClick={() => {
                    onOpenMortgage();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Affordability &amp; TDSR Calculator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
