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
  Building,
  Car,
  Layers,
} from 'lucide-react';
import {
  fetchHdbResaleData,
  getOneMapTokenStatus,
  fetchUraPrivateTransactions,
  getUraTokenStatus,
  fetchUraCarparks,
} from '../services/api';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [hdbData, setHdbData] = useState<any>(null);
  const [uraStatus, setUraStatus] = useState<any>(null);
  const [uraData, setUraData] = useState<any>(null);
  const [carparkData, setCarparkData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'onemap' | 'hdb' | 'ura'>('ura');
  const [searchTown, setSearchTown] = useState('MARINE PARADE');
  const [searchDistrict, setSearchDistrict] = useState('15');

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const [tok, hdb, uraTok, uraTx, cps] = await Promise.all([
        getOneMapTokenStatus().catch((err) => ({ status: 'error', message: err.message, hasToken: false })),
        fetchHdbResaleData({ town: searchTown, limit: 5 }).catch((err) => ({ success: false, error: err.message })),
        getUraTokenStatus().catch((err) => ({ status: 'error', message: err.message, hasToken: false })),
        fetchUraPrivateTransactions({ district: searchDistrict, limit: 5 }).catch((err) => ({ success: false, error: err.message })),
        fetchUraCarparks({ type: 'both' }).catch((err) => ({ success: false, error: err.message })),
      ]);
      setTokenStatus(tok);
      setHdbData(hdb);
      setUraStatus(uraTok);
      setUraData(uraTx);
      setCarparkData(cps);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
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
                URA Private Property, OneMap Singapore &amp; data.gov.sg Connectors (/api)
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
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('ura')}
            className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ura'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4 text-indigo-600" />
            <span>URA Space Private Property API (/api/ura/*)</span>
          </button>
          <button
            onClick={() => setActiveTab('onemap')}
            className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'onemap'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>OneMap SLA Geodesic API (/api/onemap/*)</span>
          </button>
          <button
            onClick={() => setActiveTab('hdb')}
            className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'hdb'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Data.gov.sg HDB 10,000 Resale (/api/hdb/resale)</span>
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* URA TAB */}
          {activeTab === 'ura' && (
            <div className="space-y-4">
              {/* URA Token Status Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  uraStatus?.hasToken
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                }`}
              >
                {uraStatus?.hasToken ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm">
                    {uraStatus?.hasToken
                      ? 'URA Daily Token Active'
                      : 'URA AccessKey Ready for Vercel'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-90">
                    {uraStatus?.message ||
                      'Trade your AccessKey daily via https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1. Set URA_ACCESS_KEY in Vercel.'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="bg-white/80 px-2 py-0.5 rounded border border-indigo-100">
                      AccessKey: {uraStatus?.hasToken ? 'Configured' : 'Set in Vercel'}
                    </span>
                    <span className="bg-white/80 px-2 py-0.5 rounded border border-indigo-100">
                      Header protocol: AccessKey + Token
                    </span>
                  </div>
                </div>
                <button
                  onClick={loadStatus}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* URA Endpoints in /api */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                  Registered URA Endpoints in /api/ura
                </div>
                <div className="divide-y divide-slate-100 font-mono text-[11px]">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-700">GET/POST</span> /api/ura/token
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Trades AccessKey for today's daily token (https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1)
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-700">GET</span> /api/ura/transactions?district=15&amp;batch=all
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Private residential property transactions (merges 4 postal district batches: PMI_Resi_Transaction)
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-700">GET</span> /api/ura/carparks?type=both
                      <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Live carpark lots availability + parking rates (Car_Park_Availability &amp; Car_Park_Details)
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-sans font-semibold">
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Preview of Private Transactions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-xs">
                    Private Property Transactions Preview:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchDistrict}
                      onChange={(e) => setSearchDistrict(e.target.value)}
                      placeholder="District e.g. 15, 10"
                      className="px-2 py-1 text-[11px] border border-slate-200 rounded-lg w-28"
                    />
                    <button
                      onClick={loadStatus}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      Filter District
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Project &amp; Street</th>
                        <th className="p-2.5">Type &amp; Segment</th>
                        <th className="p-2.5 text-right">Floor Area</th>
                        <th className="p-2.5 text-right">Transacted Price</th>
                        <th className="p-2.5 text-right">Unit PSF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uraData?.transactions && uraData.transactions.length > 0 ? (
                        uraData.transactions.slice(0, 5).map((t: any) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-500 font-mono text-[11px]">
                              {t.contractDate}
                            </td>
                            <td className="p-2.5 font-bold text-slate-900">
                              {t.project}
                              <div className="text-[10px] text-slate-400 font-normal">
                                {t.street} (D{t.district})
                              </div>
                            </td>
                            <td className="p-2.5 text-slate-600">
                              {t.propertyType}
                              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-100 rounded font-semibold text-slate-700">
                                {t.marketSegment}
                              </span>
                            </td>
                            <td className="p-2.5 text-right text-slate-600 tabular-nums">
                              {t.areaSqft} sqft
                            </td>
                            <td className="p-2.5 text-right font-black text-slate-900 tabular-nums">
                              ${t.price.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-bold text-sky-700 tabular-nums">
                              ${t.psf.toLocaleString()} psf
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-400">
                            Loading URA transactions...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Carparks Preview near schools */}
              {carparkData?.carparks && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                    <Car className="w-4 h-4 text-indigo-600" />
                    <span>School Zone Carpark Lots &amp; Visitor Parking Rates:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    {carparkData.carparks.slice(0, 4).map((cp: any, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <div className="font-bold text-slate-900">{cp.name}</div>
                        <div className="text-emerald-700 font-semibold mt-0.5">
                          Lots Available: {cp.lotsAvailable ?? 'Check entry'} / {cp.totalCapacity ?? 'N/A'}
                        </div>
                        <div className="text-slate-500 text-[10px] mt-0.5">
                          Rate: {cp.weekdayRate || '$0.60/30 mins'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ONEMAP TAB */}
          {activeTab === 'onemap' && (
            <div className="space-y-4">
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
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                  Registered OneMap Endpoints in /api/onemap
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
                </div>
              </div>
            </div>
          )}

          {/* HDB TAB */}
          {activeTab === 'hdb' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-950 flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-sm">Official Data.gov.sg Dataset Connected</div>
                  <p className="text-xs text-emerald-800 mt-0.5">
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
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
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
