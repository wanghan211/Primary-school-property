import React, { useState } from 'react';
import {
  X,
  Footprints,
  ShieldCheck,
  Building2,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Property, School } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  school: School;
  isOpen: boolean;
  onClose: () => void;
  onOpenMortgage: (price: number) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  school,
  isOpen,
  onClose,
  onOpenMortgage,
  isSaved,
  onToggleSave,
}) => {
  const [scheduled, setScheduled] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !property) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto custom-scroll">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                property.dwellingType === 'hdb'
                  ? 'bg-blue-100 text-blue-800'
                  : property.dwellingType === 'landed'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {property.dwellingLabel}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{property.tenure}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleSave}
              className={`p-2 rounded-lg transition ${
                isSaved
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Saved to shortlist' : 'Save to shortlist'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="bg-emerald-600 text-white text-xs text-center py-1.5 font-medium">
            Listing link copied to clipboard!
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Visual & Key Price Block */}
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-80 bg-slate-900 border border-slate-200">
            <img
              src={property.imageUrl}
              alt={property.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black">{property.name}</h1>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">{property.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black tabular-nums text-white">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold text-sky-300 tabular-nums">
                    ${property.psf.toLocaleString()} psf
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOE P1 Registration Geodesic Priority Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <span>MOE Priority 1: Within 1.0 km Boundary</span>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-2 py-0.2 rounded font-semibold">
                    Verified Geodesic 2022
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Distance: <strong>{property.distanceKm} km</strong> from {school.shortName}{' '}
                  perimeter boundary. Eligible for MOE P1 Priority Group 1 (within 1km).
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-emerald-700">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>
                    <strong>{property.walkMinutes} mins walk ({property.walkDistanceMeters}m)</strong>{' '}
                    {property.walkNote}
                  </span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xs">
              {property.phase2CStatus}
            </span>
          </div>

          {/* Specs Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bedrooms</span>
              <span className="font-extrabold text-slate-800 text-sm">{property.beds} Beds</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bathrooms</span>
              <span className="font-extrabold text-slate-800 text-sm">{property.baths} Baths</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Floor Area</span>
              <span className="font-extrabold text-slate-800 text-sm tabular-nums">
                {property.sqft.toLocaleString()} sqft
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tenure / Year</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {property.tenureType === 'freehold' ? 'Freehold' : property.tenure}
              </span>
            </div>
          </div>

          {/* Editorial Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Property Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {property.description ||
                `Superb residential property situated within prime distance of ${school.shortName}. Offers excellent natural lighting, family-friendly condominium facilities, and seamless access to expressways and public transit.`}
            </p>
          </div>

          {/* Recent Transacted History */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Recent Transacted Sales in Development
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5 text-right">Size</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {property.history.map((tx, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-500">{tx.date}</td>
                      <td className="p-2.5 font-medium text-slate-800">{tx.unit}</td>
                      <td className="p-2.5 text-right text-slate-600 tabular-nums">
                        {tx.areaSqft} sqft
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900 tabular-nums">
                        ${tx.price.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-sky-700 tabular-nums">
                        ${tx.psf.toLocaleString()} psf
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenMortgage(property.price)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer flex items-center gap-1.5"
          >
            <span>Calculate Mortgage &amp; Cash Outlay</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduled(true)}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{scheduled ? 'Viewing Requested ✓' : 'Schedule Viewing'}</span>
            </button>

            <a
              href="tel:+6568282828"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Certified Agent</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
