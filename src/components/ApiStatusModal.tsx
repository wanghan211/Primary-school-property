import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Code,
} from 'lucide-react';
import { fetchHdbResaleData, getOneMapTokenStatus } from '../services/api';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [hdbData, setHdbData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'onemap' | 'hdb'>('onemap');
  const [searchTown, setSearchTown] = useState('MARINE PARADE');

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const [tok, hdb] = await Promise.all([
        getOneMapTokenStatus().catch((err) => ({ status: 'error', message: err.message, hasToken: false })),
        fetchHdbResaleData({ town: searchTown, limit: 5 }).catch((err) => ({ success: false, error: err.message })),
      ]);
      setTokenStatus(tok);
      setHdbData(hdb);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                API Integration Status &amp; Vercel Endpoints
              </h2>
              <p className="text-xs text-slate-500">
                OneMap Singapore &amp; data.gov.sg Live Dataset Connectors (/api)
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

        {/* Tab Buttons */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('onemap')}
            className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'onemap'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>OneMap SLA API (/api/onemap/*)</span>
          </button>
          <button
            onClick={() => setActiveTab('hdb')}
            className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hdb'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data.gov.sg HDB 10,000 Resale API (/api/hdb/resale)</span>
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {activeTab === 'onemap' && (
            <div className="space-y-4">
              {/* Token Status Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  tokenStatus?.hasToken
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {tokenStatus?.hasToken ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm">
                    {tokenStatus?.hasToken
                      ? 'OneMap API Token Active'
                      : 'OneMap Token Ready for Vercel'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-90">
                    {tokenStatus?.message ||
                      'Provide your token in Vercel under Environment Variables as ONEMAP_API_TOKEN.'}
                  </p>
                  <div className="mt-2 text-[11px] font-mono bg-white/70 px-2 py-1 rounded inline-block">
                    Source: {tokenStatus?.source || 'none'}
                  </div>
                </div>
                <button
                  onClick={loadStatus}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Endpoint Catalog */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                  Registered OneMap Endpoints in /api
                </div>
                <div className="divide-y divide-slate-100 font-mono text-[11px]">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-700">POST/GET</span> /api/onemap/token
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Mint 3-day token (https://www.onemap.gov.sg/api/auth/post/getToken)
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-700">GET</span> /api/onemap/search?searchVal=...
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Elastic address search &amp; geocode with Bearer token auth
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-700">GET</span> /api/onemap/radius?schoolId=...&amp;lat=...&amp;lng=...
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Computes 1km (Priority 1) &amp; 2km (Priority 2) geodesic zones + GeoJSON rings
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-700">GET</span> /api/onemap/route?start=...&amp;end=...&amp;routeType=walk
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Pedestrian walk routing to school gate with time &amp; distance
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-700">GET</span> /api/onemap/education?planningArea=...
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Population education attendance stats
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Vercel instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">
                  How to configure in Vercel:
                </span>
                <p className="text-slate-600 text-xs">
                  In your Vercel Project Dashboard &gt; <strong>Settings</strong> &gt;{' '}
                  <strong>Environment Variables</strong>, add either:
                </p>
                <div className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                  <div><strong>Option A:</strong> ONEMAP_API_TOKEN = "&lt;your_token&gt;"</div>
                  <div><strong>Option B:</strong> ONEMAP_EMAIL = "..." and ONEMAP_PASSWORD = "..."</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hdb' && (
            <div className="space-y-4">
              {/* Dataset Info Box */}
              <div className="p-4 rounded-xl border bg-sky-50 border-sky-200 text-sky-950 flex items-start gap-3">
                <Database className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-sm">Official Data.gov.sg Dataset Connected</div>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Resource ID: <code className="bg-white/80 px-1 py-0.5 rounded font-mono">d_8b84c4ee58e3cfc0ece0d773c8ca6abc</code> (HDB resale prices, Jan 2017 onwards, 10,000 transactions limit).
                  </p>
                  {hdbData?.analytics && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
                      <span>Found: {hdbData.analytics.totalTransactionsFound} txns</span>
                      <span>•</span>
                      <span>Avg Price: ${hdbData.analytics.avgPrice?.toLocaleString()}</span>
                      <span>•</span>
                      <span>Avg PSF: ${hdbData.analytics.avgPsf} psf</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Records Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-xs">
                    Live Data Preview (Marine Parade / Tao Nan Zone):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchTown}
                      onChange={(e) => setSearchTown(e.target.value.toUpperCase())}
                      placeholder="Town e.g. BISHAN"
                      className="px-2 py-1 text-[11px] border border-slate-200 rounded-lg"
                    />
                    <button
                      onClick={loadStatus}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="p-2.5">Month</th>
                        <th className="p-2.5">Address</th>
                        <th className="p-2.5">Flat Type</th>
                        <th className="p-2.5 text-right">Area (sqft)</th>
                        <th className="p-2.5 text-right">Price</th>
                        <th className="p-2.5 text-right">PSF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hdbData?.records && hdbData.records.length > 0 ? (
                        hdbData.records.slice(0, 5).map((rec: any) => (
                          <tr key={rec.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-500 font-mono text-[11px]">{rec.month}</td>
                            <td className="p-2.5 font-bold text-slate-900">{rec.address}</td>
                            <td className="p-2.5 text-slate-600">{rec.flatType}</td>
                            <td className="p-2.5 text-right text-slate-600 tabular-nums">
                              {rec.floorAreaSqft}
                            </td>
                            <td className="p-2.5 text-right font-black text-slate-900 tabular-nums">
                              ${rec.resalePrice?.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-bold text-sky-700 tabular-nums">
                              ${rec.psf}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-400">
                            Loading transactions...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
