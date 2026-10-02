import React from 'react';
import { X, LineChart, TrendingUp, Calendar } from 'lucide-react';
import { Property, School } from '../types';

interface PriceTrendModalProps {
  property: Property | null;
  school: School;
  isOpen: boolean;
  onClose: () => void;
}

export const PriceTrendModal: React.FC<PriceTrendModalProps> = ({
  property,
  school,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{property.name}</h2>
              <p className="text-xs text-slate-500">
                Transacted PSF Appreciation vs {school.shortName} Cluster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Trend Summary Stats */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Latest Asking PSF
              </span>
              <span className="text-lg font-black text-slate-900 tabular-nums">
                ${property.psf.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                School 1km Cluster Avg
              </span>
              <span className="text-lg font-black text-sky-700 tabular-nums">
                $
                {property.dwellingType === 'hdb'
                  ? school.hdb1kmPsf
                  : school.condo1kmPsf.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Capital Growth (Est.)
              </span>
              <span className="text-lg font-black text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+22.5%</span>
              </span>
            </div>
          </div>

          {/* Transaction History Graph Simulation */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-900">Historical Unit Transacted Trends</span>
              <span className="text-[11px] text-slate-400">URA &amp; SLA Caveats Log</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-4 pt-4 border-b border-slate-200 pb-2">
              {property.history.map((h, idx) => {
                const max = 2500;
                const min = 500;
                const height = Math.max(20, Math.min(100, ((h.psf - min) / (max - min)) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full flex items-end justify-center h-32">
                      <div
                        className="w-8 bg-sky-600 rounded-t-md group-hover:bg-sky-500 transition relative flex flex-col justify-start items-center"
                        style={{ height: `${height}%` }}
                      >
                        <span className="text-[9px] text-white font-bold pt-1 opacity-0 group-hover:opacity-100 transition tabular-nums">
                          ${h.psf}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">{h.date}</span>
                    <span className="text-[9px] text-slate-400">{h.unit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Transaction Records */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-2">Transacted Records Table</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Unit #</th>
                    <th className="p-2.5 text-right">Floor Area</th>
                    <th className="p-2.5 text-right">Transacted Price</th>
                    <th className="p-2.5 text-right">Unit PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {property.history.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-600 font-medium">{rec.date}</td>
                      <td className="p-2.5 text-slate-800">{rec.unit}</td>
                      <td className="p-2.5 text-right text-slate-600 tabular-nums">
                        {rec.areaSqft} sqft
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900 tabular-nums">
                        ${rec.price.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-sky-700 tabular-nums">
                        ${rec.psf.toLocaleString()} psf
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
