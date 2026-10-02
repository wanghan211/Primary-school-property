import React from 'react';
import { X, ArrowRight, Check, Trash2, Building2 } from 'lucide-react';
import { Property, School } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  school: School;
  onRemoveProperty: (id: string) => void;
  onOpenListing: (property: Property) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  properties,
  school,
  onRemoveProperty,
  onOpenListing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Side-by-Side Property Comparison
            </h2>
            <p className="text-xs text-slate-500">Benchmark against {school.shortName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs">
          {properties.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No properties selected for comparison</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "Compare" on listing cards to compare their distance, price, and MOE eligibility.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-40 text-slate-400 font-semibold uppercase text-[10px]">
                      Metric
                    </th>
                    {properties.map((prop) => (
                      <th key={prop.id} className="p-3 min-w-[200px] align-top">
                        <div className="relative group">
                          <button
                            onClick={() => onRemoveProperty(prop.id)}
                            className="absolute -top-1 -right-1 p-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-full text-slate-400 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={prop.imageUrl}
                            alt={prop.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-24 object-cover rounded-xl mb-2"
                          />
                          <div className="font-bold text-sm text-slate-900">{prop.name}</div>
                          <div className="text-[11px] text-slate-500">{prop.dwellingLabel}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Asking Price</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-black text-slate-900 text-sm tabular-nums">
                        ${p.price.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Unit PSF</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-sky-700 tabular-nums">
                        ${p.psf.toLocaleString()} psf
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">School Distance</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3">
                        <span className="font-bold text-emerald-700">{p.distanceKm} km</span>
                        <div className="text-[11px] text-slate-500">
                          {p.walkMinutes} mins walk ({p.walkDistanceMeters}m)
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">MOE Priority Status</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.phase2CStatus}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Tenure / Year</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-slate-700">
                        {p.tenure} • Built {p.builtYear}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Bedrooms &amp; Size</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.beds} Beds • {p.baths} Baths ({p.sqft.toLocaleString()} sqft)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Action</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenListing(p);
                          }}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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
