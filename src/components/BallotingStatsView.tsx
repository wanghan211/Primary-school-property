import React, { useState } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Search,
} from 'lucide-react';
import { School } from '../types';

interface BallotingStatsViewProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
}

export const BallotingStatsView: React.FC<BallotingStatsViewProps> = ({
  schools,
  onSelectSchool,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const MOE_PHASES = [
    {
      phase: 'Phase 1',
      desc: 'Siblings of current pupils studying in the school.',
      chance: '100% Guaranteed',
      seats: '~30% - 35%',
    },
    {
      phase: 'Phase 2A',
      desc: 'Former students (alumni), children of staff or school advisory committee.',
      chance: 'High (~95% - 100%)',
      seats: '~25%',
    },
    {
      phase: 'Phase 2B',
      desc: 'Parents endorsed as school/community grassroot leaders or church/clan affiliated.',
      chance: 'Balloting in popular SAP schools',
      seats: '20 seats reserved',
    },
    {
      phase: 'Phase 2C',
      desc: 'Open to all Singapore Citizens & PR children with no prior school ties.',
      chance: 'Fiercest competition — balloting within 1km',
      seats: '40 seats reserved + vacancies',
    },
    {
      phase: 'Phase 2C (S)',
      desc: 'Supplementary phase for applicants unsuccessful in Phase 2C.',
      chance: 'Only schools with remaining vacancies',
      seats: 'Remainder',
    },
  ];

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>MOE Primary 1 Registration Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Singapore Primary School Balloting Risk Index (2024 MOE P1)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Real historical subscription rates, citizen priority cut-offs, and geodesic distance
            impact across Singapore's top primary school clusters.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter school or district..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* MOE Phase Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MOE_PHASES.map((p) => (
          <div
            key={p.phase}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm">{p.phase}</span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {p.seats}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-700">
              {p.chance}
            </div>
          </div>
        ))}
      </div>

      {/* School Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Phase 2C Risk Table &amp; Balloting Odds
          </h2>
          <span className="text-xs text-slate-400">Singapore Land Authority Geodesic Mapped</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-3.5">School Name &amp; District</th>
                <th className="p-3.5">Intake Seats</th>
                <th className="p-3.5">Phase 2C Sub.</th>
                <th className="p-3.5">SC &lt;1km Odds</th>
                <th className="p-3.5">1-2km Applicant Outcome</th>
                <th className="p-3.5">1km PSF Premium</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 text-sm">{school.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {school.district} • {school.type}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700 tabular-nums">
                    {school.intakeSeats}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 tabular-nums">
                      {school.phase2CSubscription}%
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-rose-700 text-sm tabular-nums">
                    {school.ballotingChanceSCWithin1km}%
                  </td>
                  <td className="p-3.5 text-slate-600 text-[11px] max-w-xs leading-normal">
                    {school.ballotingNote}
                  </td>
                  <td className="p-3.5 font-bold text-indigo-700 text-xs tabular-nums">
                    +{school.psfPremiumPercent}% PSF
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onSelectSchool(school)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Explore Radius
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
