import React, { useState } from 'react';
import {
  GraduationCap,
  Train,
  Baby,
  Plus,
  Minus,
  Crosshair,
  Info,
  ExternalLink,
  Footprints,
} from 'lucide-react';
import { Property, School } from '../types';

interface GeodesicMapProps {
  school: School;
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenGeodesicInfo: () => void;
  customDistance: number;
}

export const GeodesicMap: React.FC<GeodesicMapProps> = ({
  school,
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenGeodesicInfo,
  customDistance,
}) => {
  const [show1kmZone, setShow1kmZone] = useState(true);
  const [show2kmZone, setShow2kmZone] = useState(true);
  const [showMrt, setShowMrt] = useState(true);
  const [showPreschools, setShowPreschools] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // SVG radius calculations based on customDistance (1.0km = 145px, 2.0km = 280px)
  const customRadiusPx = customDistance * 145;

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[750px] relative"
      data-purpose="geodesic-map-view"
    >
      {/* Map Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShow1kmZone(!show1kmZone)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-2 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              show1kmZone
                ? 'bg-white/95 text-slate-800 border-slate-200'
                : 'bg-slate-100/90 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ring-2 ${
                show1kmZone
                  ? 'bg-emerald-500 ring-emerald-200'
                  : 'bg-slate-300 ring-slate-200'
              }`}
            ></span>
            <span>1.0km MOE Zone</span>
          </button>

          <button
            onClick={() => setShow2kmZone(!show2kmZone)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-2 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              show2kmZone
                ? 'bg-white/95 text-slate-800 border-slate-200'
                : 'bg-slate-100/90 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ring-2 ${
                show2kmZone
                  ? 'bg-blue-500 ring-blue-200'
                  : 'bg-slate-300 ring-slate-200'
              }`}
            ></span>
            <span>2.0km Secondary</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowMrt(!showMrt)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              showMrt
                ? 'bg-white/95 text-slate-800 border-slate-200 shadow-sm'
                : 'bg-slate-100/80 text-slate-400 border-slate-200'
            }`}
          >
            <Train className={`w-3.5 h-3.5 ${showMrt ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>TEL MRT</span>
          </button>

          <button
            onClick={() => setShowPreschools(!showPreschools)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              showPreschools
                ? 'bg-purple-50 text-purple-900 border-purple-200 shadow-sm'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Baby
              className={`w-3.5 h-3.5 ${
                showPreschools ? 'text-purple-600' : 'text-slate-500'
              }`}
            />
            <span>Preschools</span>
          </button>
        </div>
      </div>

      {/* Rendered Map Stage */}
      <div className="flex-1 w-full h-full relative bg-[#edf2f7] overflow-hidden select-none">
        <div
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Vector Map Background Graphics (Streets & Coastline) */}
          <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.8"
                ></path>
              </pattern>
            </defs>

            {/* Base Grid & Landmass */}
            <rect width="100%" height="100%" fill="#f1f5f9"></rect>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" opacity="0.6"></rect>

            {/* Major Roads (Simulated Marine Parade layout) */}
            {/* ECP Expressway */}
            <path
              d="M -50 630 Q 300 580 850 560"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="12"
            ></path>
            <path
              d="M -50 630 Q 300 580 850 560"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="8"
            ></path>

            {/* Marine Parade Road */}
            <path
              d="M -50 380 Q 250 360 850 340"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="8"
            ></path>
            <path
              d="M -50 380 Q 250 360 850 340"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
            ></path>

            {/* Still Road South / Joo Chiat Road */}
            <path d="M 320 0 L 320 750" fill="none" stroke="#cbd5e1" strokeWidth="6"></path>
            <path d="M 320 0 L 320 750" fill="none" stroke="#ffffff" strokeWidth="3"></path>
            <path d="M 180 0 L 170 750" fill="none" stroke="#e2e8f0" strokeWidth="4"></path>
            <path d="M 520 0 L 510 750" fill="none" stroke="#e2e8f0" strokeWidth="4"></path>

            {/* Labels for Roads */}
            <text
              x="70"
              y="372"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="1"
            >
              MARINE PARADE ROAD
            </text>
            <text
              x="326"
              y="240"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="1"
              transform="rotate(90 326 240)"
            >
              STILL ROAD SOUTH
            </text>
            <text
              x="176"
              y="200"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="1"
              transform="rotate(90 176 200)"
            >
              JOO CHIAT ROAD
            </text>
            <text
              x="516"
              y="210"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="1"
              transform="rotate(90 516 210)"
            >
              TELOK KURAU ROAD
            </text>
            <text
              x="560"
              y="555"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="700"
              letterSpacing="1"
            >
              ECP (EAST COAST PARKWAY)
            </text>

            {/* 2.0km Secondary MOE Distance Ring */}
            {show2kmZone && (
              <g>
                <circle
                  cx={school.mapCoords.x}
                  cy={school.mapCoords.y}
                  r="280"
                  fill="rgba(59, 130, 246, 0.04)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                ></circle>
                <text
                  x={school.mapCoords.x - 90}
                  y="98"
                  fill="#2563eb"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  2.0 KM SECONDARY MOE BUFFER
                </text>
              </g>
            )}

            {/* 1.0km Critical Home-School Distance Ring */}
            {show1kmZone && (
              <g>
                <circle
                  cx={school.mapCoords.x}
                  cy={school.mapCoords.y}
                  r="145"
                  fill="rgba(16, 185, 129, 0.07)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                ></circle>
                <text
                  x={school.mapCoords.x - 110}
                  y="235"
                  fill="#059669"
                  fontSize="10"
                  fontWeight="extrabold"
                  letterSpacing="0.5"
                >
                  1.0 KM CRITICAL HOME-SCHOOL DISTANCE
                </text>
              </g>
            )}

            {/* Dynamic Custom Radius Indicator if different from 1km or 2km */}
            {Math.abs(customDistance - 1.0) > 0.05 && Math.abs(customDistance - 2.0) > 0.05 && (
              <circle
                cx={school.mapCoords.x}
                cy={school.mapCoords.y}
                r={customRadiusPx}
                fill="rgba(14, 165, 233, 0.03)"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              ></circle>
            )}

            {/* School Ground Perimeter Polygon */}
            <polygon
              points="350,355 390,355 395,385 345,385"
              fill="#0f172a"
              opacity="0.1"
            ></polygon>
          </svg>

          {/* Center: Target School Marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-auto cursor-pointer"
            style={{ top: `${school.mapCoords.y}px`, left: `${school.mapCoords.x}px` }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full bg-slate-900/20 pulse-effect"></span>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-slate-900/30">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="mt-1 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md shadow-lg border border-slate-700 whitespace-nowrap flex items-center gap-1">
              <span>{school.shortName.toUpperCase()}</span>
            </div>
          </div>

          {/* Transit MRT Station Markers */}
          {showMrt &&
            school.mrtStations.map((mrt) => (
              <div
                key={mrt.code}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-md border border-amber-300 shadow-xs text-[10px] font-bold text-amber-900"
                style={{ top: `${mrt.y}px`, left: `${mrt.x}px` }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>
                  {mrt.code} {mrt.name}
                </span>
              </div>
            ))}

          {/* Preschool Markers */}
          {showPreschools &&
            school.preschools.map((pre, idx) => (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-15 flex items-center gap-1 bg-purple-50/95 backdrop-blur px-2 py-0.5 rounded-md border border-purple-300 shadow-xs text-[9px] font-bold text-purple-900"
                style={{ top: `${pre.y}px`, left: `${pre.x}px` }}
              >
                <Baby className="w-3 h-3 text-purple-600" />
                <span>{pre.name}</span>
              </div>
            ))}

          {/* Property Price Pins */}
          {properties.map((prop) => {
            const is1km = prop.distanceKm <= 1.0;
            const isSelected = selectedProperty?.id === prop.id;
            const isHovered = hoveredProperty?.id === prop.id;

            return (
              <div
                key={prop.id}
                onMouseEnter={() => setHoveredProperty(prop)}
                onMouseLeave={() => setHoveredProperty(null)}
                onClick={() => onSelectProperty(prop)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-transform ${
                  isSelected || isHovered ? 'scale-115 z-30' : 'hover:scale-110'
                }`}
                style={{ top: `${prop.mapPos.y}px`, left: `${prop.mapPos.x}px` }}
              >
                {/* Visual Pin Bubble */}
                {is1km ? (
                  prop.dwellingType === 'hdb' ? (
                    <div
                      className={`px-2.5 py-1 rounded-full font-bold text-xs shadow-md border-2 border-white flex items-center gap-1 transition ${
                        isSelected
                          ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      ${(prop.price / 1000).toFixed(0)}k
                    </div>
                  ) : (
                    <div
                      className={`px-2.5 py-1 rounded-full font-bold text-xs shadow-md border-2 border-white flex items-center gap-1 transition ${
                        isSelected
                          ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>$
                      {(prop.price / 1000000).toFixed(2)}M
                    </div>
                  )
                ) : (
                  <div
                    className={`px-2 py-0.5 rounded-full font-bold text-[11px] shadow border transition ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    ${prop.price >= 1000000 ? `${(prop.price / 1000000).toFixed(2)}M` : `${(prop.price / 1000).toFixed(0)}k`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hovered Property Tooltip Card */}
        {hoveredProperty && (
          <div
            className="absolute z-40 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-xl p-3 w-64 pointer-events-none transition-all"
            style={{
              top: `${Math.min(Math.max(hoveredProperty.mapPos.y - 130, 20), 580)}px`,
              left: `${Math.min(Math.max(hoveredProperty.mapPos.x - 120, 20), 400)}px`,
            }}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {hoveredProperty.distanceKm} km to school
              </span>
              <span>{hoveredProperty.dwellingLabel}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 truncate">
              {hoveredProperty.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ${hoveredProperty.price.toLocaleString()} (${hoveredProperty.psf} psf)
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-600">
              <Footprints className="w-3 h-3 text-emerald-600" />
              <span>{hoveredProperty.walkMinutes} mins walk ({hoveredProperty.walkDistanceMeters}m)</span>
            </div>
          </div>
        )}

        {/* Map Zoom & Location Floating Buttons */}
        <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-9 h-9 bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-9 h-9 bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            aria-label="Reset map view"
            title="Reset to center"
            className="w-9 h-9 bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition mt-1 cursor-pointer"
          >
            <Crosshair className="w-4 h-4 text-sky-600" />
          </button>
        </div>

        {/* Bottom Geodesic Legal Footnote */}
        <div
          onClick={onOpenGeodesicInfo}
          className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-white hover:text-slate-800 transition"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Distances computed from school perimeter boundary under 2022 MOE revision</span>
          <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
        </div>
      </div>
    </section>
  );
};
