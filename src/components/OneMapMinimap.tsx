import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  MapPin,
  GraduationCap,
  Footprints,
  X,
  Compass,
} from 'lucide-react';
import { School, Property } from '../types';
import { ONEMAP_BASEMAP_TILE_URL, ONEMAP_BASEMAP_OPTIONS, ONEMAP_MAP_STYLES } from '../../api/basemap';

interface OneMapMinimapProps {
  school: School;
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  show1kmZone?: boolean;
  show2kmZone?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Convert school/property mapPos to real Singapore lat/lng
function getSchoolLatLng(school: School): [number, number] {
  if ((school as any).lat && (school as any).lng) {
    return [(school as any).lat, (school as any).lng];
  }
  // Tao Nan School default (49 Marine Crescent, Singapore 449761)
  if (school.id === 'tao-nan') return [1.30472, 103.90972];
  if (school.id === 'rosyth') return [1.3725, 103.8744];
  if (school.id === 'nyps') return [1.3197, 103.8066];
  if (school.id === 'acs-primary') return [1.3184, 103.8378];
  if (school.id === 'chij-st-nicholas') return [1.3732, 103.8344];
  return [1.30472, 103.90972];
}

function getPropertyLatLng(prop: Property, schoolLatLng: [number, number]): [number, number] {
  if ((prop as any).lat && (prop as any).lng) {
    return [(prop as any).lat, (prop as any).lng];
  }
  // 145px ≈ 1000m => 1px ≈ 6.89m => delta lat ≈ 1px * 0.000062
  const centerMapX = 370;
  const centerMapY = 370;
  const deltaX = (prop.mapPos.x - centerMapX) * 0.000062;
  const deltaY = (prop.mapPos.y - centerMapY) * 0.000062;
  return [schoolLatLng[0] - deltaY, schoolLatLng[1] + deltaX];
}

export const OneMapMinimap: React.FC<OneMapMinimapProps> = ({
  school,
  properties,
  selectedProperty,
  onSelectProperty,
  show1kmZone = true,
  show2kmZone = true,
  isExpanded = false,
  onToggleExpand,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeStyle, setActiveStyle] = useState<'Default' | 'Night' | 'Original' | 'Grey'>('Default');
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [isHovered, setIsHovered] = useState(false);

  const schoolLatLng = getSchoolLatLng(school);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: schoolLatLng,
        zoom: isExpanded ? 15 : 14,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // Add OneMap Live Tile Layer using the official SLA configuration
      const basemap = L.tileLayer(ONEMAP_MAP_STYLES[activeStyle] || ONEMAP_BASEMAP_TILE_URL, {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 11,
        attribution: ONEMAP_BASEMAP_OPTIONS.attribution,
      });
      basemap.addTo(map);
      tileLayerRef.current = basemap;

      // Layer groups
      const circlesLayer = L.layerGroup().addTo(map);
      const markersLayer = L.layerGroup().addTo(map);
      circlesLayerRef.current = circlesLayer;
      markersLayerRef.current = markersLayer;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newUrl = ONEMAP_MAP_STYLES[activeStyle];
    tileLayerRef.current.setUrl(newUrl);
  }, [activeStyle]);

  // Handle Resize / Expand
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isExpanded]);

  // Center on school when school changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(schoolLatLng, isExpanded ? 15 : 14);
    }
  }, [school.id, isExpanded]);

  // Render Overlays (Circles & Markers)
  useEffect(() => {
    if (!mapInstanceRef.current || !circlesLayerRef.current || !markersLayerRef.current) return;

    const circlesLayer = circlesLayerRef.current;
    const markersLayer = markersLayerRef.current;

    circlesLayer.clearLayers();
    markersLayer.clearLayers();

    // 2.0km Secondary Buffer Circle
    if (show2kmZone) {
      const circle2km = L.circle(schoolLatLng, {
        radius: 2000,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6, 6',
      });
      circle2km.addTo(circlesLayer);
    }

    // 1.0km Critical Zone Circle
    if (show1kmZone) {
      const circle1km = L.circle(schoolLatLng, {
        radius: 1000,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 2,
      });
      circle1km.addTo(circlesLayer);
    }

    // School Marker
    const schoolIcon = L.divIcon({
      className: 'onemap-school-marker',
      html: `
        <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="background: #0f172a; color: #f59e0b; padding: 6px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div style="background: #0f172a; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            ${school.shortName.toUpperCase()}
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const schoolMarker = L.marker(schoolLatLng, { icon: schoolIcon });
    schoolMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px;">
        <b style="font-size: 13px; color: #0f172a;">${school.name}</b>
        <p style="margin: 4px 0 0; color: #64748b;">${school.type} &bull; ${school.zone}</p>
        <p style="margin: 2px 0 0; color: #059669; font-weight: bold;">1km MOE Priority Balloting Hub</p>
      </div>
    `);
    schoolMarker.addTo(markersLayer);

    // Property Pins
    properties.forEach((prop) => {
      const propLatLng = getPropertyLatLng(prop, schoolLatLng);
      const isSelected = selectedProperty?.id === prop.id;
      const is1km = prop.distanceKm <= 1.0;

      const bgColor = isSelected
        ? '#f59e0b'
        : is1km
        ? prop.dwellingType === 'hdb'
          ? '#0f172a'
          : '#047857'
        : '#ffffff';
      const textColor = isSelected || is1km ? '#ffffff' : '#1e293b';
      const borderColor = isSelected ? '#fbbf24' : is1km ? '#ffffff' : '#cbd5e1';

      const priceText =
        prop.price >= 1000000
          ? `$${(prop.price / 1000000).toFixed(2)}M`
          : `$${(prop.price / 1000).toFixed(0)}k`;

      const propIcon = L.divIcon({
        className: 'onemap-prop-pin',
        html: `
          <div style="transform: translate(-50%, -50%); cursor: pointer; transition: transform 0.15s ease;">
            <div style="background: ${bgColor}; color: ${textColor}; border: 1.5px solid ${borderColor}; padding: ${
          isSelected ? '3px 8px' : '2px 6px'
        }; border-radius: 9999px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 3px;">
              <span style="width: 5px; height: 5px; border-radius: 9999px; background: ${
                is1km ? '#34d399' : '#94a3b8'
              };"></span>
              <span>${priceText}</span>
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker(propLatLng, { icon: propIcon });
      marker.on('click', () => {
        onSelectProperty(prop);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; min-width: 170px;">
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">${prop.name}</div>
          <div style="color: #64748b; font-size: 11px;">${prop.dwellingLabel} &bull; ${prop.sqft} sqft</div>
          <div style="font-weight: 900; color: #0369a1; font-size: 13px; margin: 3px 0;">$${prop.price.toLocaleString()} (${prop.psf} psf)</div>
          <div style="color: #059669; font-size: 11px; font-weight: 600;">${prop.distanceKm}km to school (${prop.walkMinutes} mins walk)</div>
        </div>
      `);

      marker.addTo(markersLayer);
    });
  }, [school.id, properties, selectedProperty?.id, show1kmZone, show2kmZone]);

  const handleCenterSchool = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(schoolLatLng, 15, { duration: 1.2 });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out z-30 shadow-2xl rounded-2xl overflow-hidden border border-slate-300 bg-white flex flex-col ${
        isExpanded
          ? 'absolute inset-3 sm:inset-5 z-40'
          : 'absolute bottom-4 right-4 w-72 sm:w-84 h-56 sm:h-64'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setStyleMenuOpen(false);
      }}
    >
      {/* Minimap Top Header HUD */}
      <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 text-white flex items-center justify-between text-xs z-10 border-b border-slate-700/60 select-none">
        <div className="flex items-center gap-1.5 font-bold truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="truncate">OneMap SLA Live Basemap</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            (z{currentZoom})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Basemap Style Switcher */}
          <div className="relative">
            <button
              onClick={() => setStyleMenuOpen(!styleMenuOpen)}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Change Basemap Style"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            {styleMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 w-28 text-[11px] z-50">
                {(['Default', 'Night', 'Original', 'Grey'] as const).map((styleKey) => (
                  <button
                    key={styleKey}
                    onClick={() => {
                      setActiveStyle(styleKey);
                      setStyleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded cursor-pointer ${
                      activeStyle === styleKey
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {styleKey}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Re-center button */}
          <button
            onClick={handleCenterSchool}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Center on School"
          >
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
          </button>

          {/* Expand / Minimize Toggle */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isExpanded ? 'Minimize map' : 'Expand full map'}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Zoom Controls for Minimap */}
        <div className="absolute bottom-6 right-2 z-10 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 bg-white/95 rounded-md shadow-md border border-slate-200 flex items-center justify-center text-slate-800 text-sm font-black hover:bg-white transition cursor-pointer"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 bg-white/95 rounded-md shadow-md border border-slate-200 flex items-center justify-center text-slate-800 text-sm font-black hover:bg-white transition cursor-pointer"
            title="Zoom out"
          >
            -
          </button>
        </div>

        {/* Bottom Attribution Notice (SLA Mandated) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xs px-2 py-0.5 text-[9px] text-slate-600 flex items-center justify-between border-t border-slate-200/60 z-10 pointer-events-auto">
          <div
            className="flex items-center gap-1 truncate"
            dangerouslySetInnerHTML={{ __html: ONEMAP_BASEMAP_OPTIONS.attribution }}
          />
          <span className="text-[8px] text-slate-400 font-mono shrink-0 pl-1">
            Scroll &amp; drag to explore
          </span>
        </div>
      </div>
    </div>
  );
};
