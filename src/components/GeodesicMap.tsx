import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
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
  Layers,
  MapPin,
  CheckCircle2,
  X,
  Compass,
  Map as MapIcon,
} from 'lucide-react';
import { Property, School } from '../types';
import {
  ONEMAP_BASEMAP_TILE_URL,
  ONEMAP_BASEMAP_OPTIONS,
  ONEMAP_MAP_STYLES,
} from '../../api/basemap';
import { OneMapMinimap } from './OneMapMinimap';

interface GeodesicMapProps {
  school: School;
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenGeodesicInfo: () => void;
  customDistance: number;
}

// Convert school ID or mapCoords to real Singapore lat/lng
function getSchoolLatLng(school: School): [number, number] {
  if ((school as any).lat && (school as any).lng) {
    return [(school as any).lat, (school as any).lng];
  }
  if (school.id === 'tao-nan') return [1.30472, 103.90972]; // 49 Marine Crescent
  if (school.id === 'nanyang-primary') return [1.3211, 103.8078]; // 52 King's Road
  if (school.id === 'acs-primary') return [1.3184, 103.8378]; // 50 Barker Road
  if (school.id === 'catholic-high') return [1.3546, 103.8447]; // 9 Bishan Street 22
  if (school.id === 'rosyth') return [1.3725, 103.8744]; // Serangoon North
  if (school.id === 'chij-st-nicholas') return [1.3732, 103.8344]; // Ang Mo Kio
  return [1.30472, 103.90972];
}

// Convert property offset relative to school to Singapore lat/lng
function getPropertyLatLng(prop: Property, schoolLatLng: [number, number]): [number, number] {
  if ((prop as any).lat && (prop as any).lng) {
    return [(prop as any).lat, (prop as any).lng];
  }
  const centerMapX = 370;
  const centerMapY = 370;
  const deltaX = (prop.mapPos.x - centerMapX) * 0.000062;
  const deltaY = (prop.mapPos.y - centerMapY) * 0.000062;
  return [schoolLatLng[0] - deltaY, schoolLatLng[1] + deltaX];
}

// Convert transit / preschool offset
function getPointLatLng(x: number, y: number, schoolLatLng: [number, number]): [number, number] {
  const centerMapX = 370;
  const centerMapY = 370;
  const deltaX = (x - centerMapX) * 0.000062;
  const deltaY = (y - centerMapY) * 0.000062;
  return [schoolLatLng[0] - deltaY, schoolLatLng[1] + deltaX];
}

export const GeodesicMap: React.FC<GeodesicMapProps> = ({
  school,
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenGeodesicInfo,
  customDistance,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const transitLayerRef = useRef<L.LayerGroup | null>(null);
  const preschoolsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [show1kmZone, setShow1kmZone] = useState(true);
  const [show2kmZone, setShow2kmZone] = useState(true);
  const [showMrt, setShowMrt] = useState(true);
  const [showPreschools, setShowPreschools] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isMinimapExpanded, setIsMinimapExpanded] = useState(false);
  const [activeStyle, setActiveStyle] = useState<'Default' | 'Night' | 'Original' | 'Grey'>('Default');
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const schoolLatLng = getSchoolLatLng(school);

  // 1. Initialize Leaflet Map with OneMap SLA Tile Layer & Vercel layout resilience
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // React 18/19 StrictMode cleanup: clear stale leaflet instance from container
    if ((mapContainerRef.current as any)._leaflet_id != null) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: schoolLatLng,
        zoom: 15,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // OneMap SLA Live Tile Layer with cross-origin
      const basemap = L.tileLayer(ONEMAP_MAP_STYLES[activeStyle] || ONEMAP_BASEMAP_TILE_URL, {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 11,
        attribution: ONEMAP_BASEMAP_OPTIONS.attribution,
        crossOrigin: true,
      });
      basemap.addTo(map);
      tileLayerRef.current = basemap;

      // Layer groups for clean management
      const circlesLayer = L.layerGroup().addTo(map);
      const transitLayer = L.layerGroup().addTo(map);
      const preschoolsLayer = L.layerGroup().addTo(map);
      const markersLayer = L.layerGroup().addTo(map);

      circlesLayerRef.current = circlesLayer;
      transitLayerRef.current = transitLayer;
      preschoolsLayerRef.current = preschoolsLayer;
      markersLayerRef.current = markersLayer;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;

      // Ensure Leaflet tiles render reliably after CSS calculation on Vercel
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
      const t1 = setTimeout(() => map.invalidateSize(), 150);
      const t2 = setTimeout(() => map.invalidateSize(), 600);

      let observer: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        observer = new ResizeObserver(() => {
          mapInstanceRef.current?.invalidateSize();
        });
        observer.observe(mapContainerRef.current);
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        observer?.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if (mapContainerRef.current) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }
      };
    }
  }, []);

  // 2. Change Tile Style when activeStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newUrl = ONEMAP_MAP_STYLES[activeStyle];
    tileLayerRef.current.setUrl(newUrl);
  }, [activeStyle]);

  // 3. Re-center map when school changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(schoolLatLng, 15);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [school.id]);

  // 4. Update Geodesic Distance Rings (1km, 2km, and custom)
  useEffect(() => {
    if (!mapInstanceRef.current || !circlesLayerRef.current) return;
    const circlesLayer = circlesLayerRef.current;
    circlesLayer.clearLayers();

    // 2.0km Secondary Buffer Ring
    if (show2kmZone) {
      const circle2km = L.circle(schoolLatLng, {
        radius: 2000,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        weight: 2,
        dashArray: '8, 8',
      });
      circle2km.bindTooltip('2.0km Secondary Buffer Zone', {
        permanent: false,
        direction: 'top',
        className: 'onemap-ring-tooltip',
      });
      circle2km.addTo(circlesLayer);
    }

    // 1.0km Critical Home-School Priority Zone Ring
    if (show1kmZone) {
      const circle1km = L.circle(schoolLatLng, {
        radius: 1000,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.09,
        weight: 2.5,
      });
      circle1km.bindTooltip('1.0km Critical Home-School Priority Zone', {
        permanent: false,
        direction: 'top',
        className: 'onemap-ring-tooltip',
      });
      circle1km.addTo(circlesLayer);
    }

    // Custom Distance Radius if set
    if (
      customDistance &&
      Math.abs(customDistance - 1.0) > 0.05 &&
      Math.abs(customDistance - 2.0) > 0.05
    ) {
      const customCircle = L.circle(schoolLatLng, {
        radius: customDistance * 1000,
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: 0.04,
        weight: 1.5,
        dashArray: '4, 4',
      });
      customCircle.addTo(circlesLayer);
    }
  }, [school.id, show1kmZone, show2kmZone, customDistance]);

  // 5. Update Transit & Preschool Overlays
  useEffect(() => {
    if (!transitLayerRef.current || !preschoolsLayerRef.current) return;

    const transitLayer = transitLayerRef.current;
    const preschoolsLayer = preschoolsLayerRef.current;

    transitLayer.clearLayers();
    preschoolsLayer.clearLayers();

    // MRT Stations
    if (showMrt && school.mrtStations) {
      school.mrtStations.forEach((mrt) => {
        const mrtLatLng = getPointLatLng(mrt.x, mrt.y, schoolLatLng);
        const mrtIcon = L.divIcon({
          className: 'onemap-mrt-marker',
          html: `
            <div style="transform: translate(-50%, -50%); display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.95); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 8px; border: 1.5px solid #d97706; box-shadow: 0 2px 6px rgba(0,0,0,0.18); font-size: 11px; font-weight: 800; color: #78350f; white-space: nowrap;">
              <span style="width: 7px; height: 7px; border-radius: 9999px; background: #b45309;"></span>
              <span>${mrt.code} ${mrt.name}</span>
            </div>
          `,
          iconSize: [0, 0],
        });
        const marker = L.marker(mrtLatLng, { icon: mrtIcon });
        marker.bindPopup(`<b>${mrt.name} MRT Station</b><br/>Line: ${mrt.line} (${mrt.code})`);
        marker.addTo(transitLayer);
      });
    }

    // Preschools
    if (showPreschools && school.preschools) {
      school.preschools.forEach((pre) => {
        const preLatLng = getPointLatLng(pre.x, pre.y, schoolLatLng);
        const preIcon = L.divIcon({
          className: 'onemap-preschool-marker',
          html: `
            <div style="transform: translate(-50%, -50%); display: flex; align-items: center; gap: 4px; background: #faf5ff; border: 1.5px solid #c084fc; padding: 2px 7px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-size: 10px; font-weight: 700; color: #581c87; white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background: #9333ea;"></span>
              <span>${pre.name}</span>
            </div>
          `,
          iconSize: [0, 0],
        });
        const marker = L.marker(preLatLng, { icon: preIcon });
        marker.bindPopup(`<b>${pre.name}</b><br/>Preschool / Early Childhood Centre`);
        marker.addTo(preschoolsLayer);
      });
    }
  }, [school.id, showMrt, showPreschools]);

  // 6. Update Target School & Transaction Property Pins
  useEffect(() => {
    if (!markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // Central School Marker
    const schoolIcon = L.divIcon({
      className: 'onemap-target-school-pin',
      html: `
        <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer; z-index: 50;">
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(15, 23, 42, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <div style="width: 38px; height: 38px; border-radius: 14px; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0,0,0,0.35); border: 2.5px solid #ffffff;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
          </div>
          <div style="margin-top: 3px; padding: 3px 8px; background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 800; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 1px solid #334155; white-space: nowrap; letter-spacing: 0.3px;">
            ${school.shortName.toUpperCase()}
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const schoolMarker = L.marker(schoolLatLng, { icon: schoolIcon, zIndexOffset: 1000 });
    schoolMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; min-width: 200px;">
        <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">${school.name}</div>
        <div style="color: #64748b; font-size: 11px;">${school.type} &bull; ${school.district}</div>
        <div style="margin-top: 6px; padding: 4px 8px; background: #ecfdf5; border-radius: 6px; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 700;">
          1.0km / 2.0km Geodesic Priority Anchor
        </div>
      </div>
    `);
    schoolMarker.addTo(markersLayer);

    // Property Transaction Pins within 1km and 2km
    properties.forEach((prop) => {
      const propLatLng = getPropertyLatLng(prop, schoolLatLng);
      const isSelected = selectedProperty?.id === prop.id;
      const is1km = prop.distanceKm <= 1.0;

      const priceText =
        prop.price >= 1000000
          ? `$${(prop.price / 1000000).toFixed(2)}M`
          : `$${(prop.price / 1000).toFixed(0)}k`;

      let bgColor = '#ffffff';
      let textColor = '#0f172a';
      let borderColor = '#cbd5e1';

      if (isSelected) {
        bgColor = '#f59e0b';
        textColor = '#ffffff';
        borderColor = '#fbbf24';
      } else if (is1km) {
        if (prop.dwellingType === 'hdb') {
          bgColor = '#0f172a';
          textColor = '#ffffff';
          borderColor = '#ffffff';
        } else {
          bgColor = '#047857';
          textColor = '#ffffff';
          borderColor = '#ffffff';
        }
      }

      const dotColor = isSelected ? '#ffffff' : is1km ? '#34d399' : '#94a3b8';

      const propIcon = L.divIcon({
        className: 'onemap-property-pin',
        html: `
          <div style="transform: translate(-50%, -50%); cursor: pointer; transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); z-index: ${
            isSelected ? 500 : 100
          };">
            <div style="background: ${bgColor}; color: ${textColor}; border: 2px solid ${borderColor}; padding: ${
          isSelected ? '4px 10px' : is1km ? '3px 8px' : '2px 7px'
        }; border-radius: 9999px; font-size: ${
          isSelected ? '12px' : '11px'
        }; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.22); display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background: ${dotColor};"></span>
              <span>${priceText}</span>
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker(propLatLng, {
        icon: propIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      marker.on('mouseover', () => {
        setHoveredProperty(prop);
      });

      marker.on('mouseout', () => {
        setHoveredProperty(null);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${
              is1km ? '#047857' : '#2563eb'
            }; background: ${is1km ? '#ecfdf5' : '#eff6ff'}; padding: 2px 6px; border-radius: 4px;">
              ${prop.distanceKm} km to School (${is1km ? '1km Priority' : '2km Buffer'})
            </span>
            <span style="font-size: 10px; color: #64748b;">${prop.dwellingLabel}</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${prop.name}</div>
          <div style="font-size: 14px; font-weight: 900; color: #0369a1; margin: 3px 0;">
            $${prop.price.toLocaleString()} <span style="font-size: 11px; font-weight: normal; color: #64748b;">($${prop.psf} psf)</span>
          </div>
          <div style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 4px; margin-top: 4px;">
            <span>🚶 ${prop.walkMinutes} mins walk (${prop.walkDistanceMeters}m)</span>
          </div>
        </div>
      `);

      marker.addTo(markersLayer);
    });
  }, [school.id, properties, selectedProperty?.id]);

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

  const propertiesWithin1km = properties.filter((p) => p.distanceKm <= 1.0);
  const propertiesWithin2km = properties.filter((p) => p.distanceKm > 1.0 && p.distanceKm <= 2.0);

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[750px] relative"
      data-purpose="onemap-live-geodesic-map-view"
    >
      {/* Map Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Zones Filter */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShow1kmZone(!show1kmZone)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-2 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              show1kmZone
                ? 'bg-white/95 text-slate-800 border-slate-200 shadow-sm'
                : 'bg-slate-100/90 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ring-2 ${
                show1kmZone ? 'bg-emerald-500 ring-emerald-200' : 'bg-slate-300 ring-slate-200'
              }`}
            ></span>
            <span>1.0km Priority ({propertiesWithin1km.length})</span>
          </button>

          <button
            onClick={() => setShow2kmZone(!show2kmZone)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-2 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              show2kmZone
                ? 'bg-white/95 text-slate-800 border-slate-200 shadow-sm'
                : 'bg-slate-100/90 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ring-2 ${
                show2kmZone ? 'bg-blue-500 ring-blue-200' : 'bg-slate-300 ring-slate-200'
              }`}
            ></span>
            <span>2.0km Buffer ({propertiesWithin2km.length})</span>
          </button>
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Minimap Toggle */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              showMinimap
                ? 'bg-sky-50 text-sky-900 border-sky-300 shadow-sm'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle OneMap Realtime SLA Minimap"
          >
            <Compass className={`w-3.5 h-3.5 ${showMinimap ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>SLA Minimap</span>
          </button>

          {/* Basemap Style Switcher */}
          <div className="relative">
            <button
              onClick={() => setStyleMenuOpen(!styleMenuOpen)}
              className="px-3 py-1.5 bg-white/95 text-slate-800 border border-slate-200 rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white cursor-pointer"
              title="Change OneMap Basemap Style"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>{activeStyle} Style</span>
            </button>
            {styleMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-32 text-xs z-50">
                {(['Default', 'Night', 'Original', 'Grey'] as const).map((styleKey) => (
                  <button
                    key={styleKey}
                    onClick={() => {
                      setActiveStyle(styleKey);
                      setStyleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
                      activeStyle === styleKey
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {styleKey}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transit MRT Button */}
          <button
            onClick={() => setShowMrt(!showMrt)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              showMrt
                ? 'bg-white/95 text-slate-800 border-slate-200 shadow-sm'
                : 'bg-slate-100/80 text-slate-400 border-slate-200'
            }`}
          >
            <Train className={`w-3.5 h-3.5 ${showMrt ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>MRT</span>
          </button>

          {/* Preschools Button */}
          <button
            onClick={() => setShowPreschools(!showPreschools)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition cursor-pointer ${
              showPreschools
                ? 'bg-purple-50 text-purple-900 border-purple-200 shadow-sm'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Baby
              className={`w-3.5 h-3.5 ${showPreschools ? 'text-purple-600' : 'text-slate-500'}`}
            />
            <span>Preschools</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Stage: OneMap SLA Live Basemap */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing min-h-[500px] bg-slate-100">
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[500px]"
          style={{ width: '100%', height: '100%', minHeight: '500px' }}
        />

        {/* Realtime SLA Minimap Floating Widget */}
        {showMinimap && (
          <OneMapMinimap
            school={school}
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={onSelectProperty}
            show1kmZone={show1kmZone}
            show2kmZone={show2kmZone}
            isExpanded={isMinimapExpanded}
            onToggleExpand={() => setIsMinimapExpanded(!isMinimapExpanded)}
            onClose={() => setShowMinimap(false)}
          />
        )}

        {/* Re-open Minimap floating button if closed */}
        {!showMinimap && (
          <button
            onClick={() => setShowMinimap(true)}
            className="absolute bottom-8 right-4 z-30 px-3 py-2 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer backdrop-blur"
            title="Open OneMap Realtime SLA Minimap"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Open OneMap SLA Minimap</span>
          </button>
        )}

        {/* Hovered Property Tooltip Card */}
        {hoveredProperty && !selectedProperty && (
          <div className="absolute top-20 left-4 z-40 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-xl p-3 w-64 pointer-events-none transition-all">
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
              <span>
                {hoveredProperty.walkMinutes} mins walk ({hoveredProperty.walkDistanceMeters}m)
              </span>
            </div>
          </div>
        )}

        {/* Selected Property Floating Detail Dock */}
        {selectedProperty && (
          <div className="absolute bottom-12 left-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-4 w-76 sm:w-88 transition-all pointer-events-auto">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                    selectedProperty.distanceKm <= 1.0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedProperty.distanceKm} km from {school.shortName}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {selectedProperty.name}
                </h4>
                <p className="text-xs text-slate-500">{selectedProperty.location}</p>
              </div>
              <button
                onClick={() => onSelectProperty(null as any)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Deselect property"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Price &amp; PSF</span>
                <div className="text-base font-black text-sky-700">
                  ${selectedProperty.price.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    (${selectedProperty.psf} psf)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Walking Route</span>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{selectedProperty.walkMinutes} mins ({selectedProperty.walkDistanceMeters}m)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Zoom & Location Floating Buttons (shown when minimap is not expanded) */}
        {!isMinimapExpanded && (
          <div className="absolute top-18 right-4 z-30 flex flex-col gap-1.5">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in on OneMap tiles"
              className="w-9 h-9 bg-white/95 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out on OneMap tiles"
              className="w-9 h-9 bg-white/95 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleCenterSchool}
              aria-label="Center on school"
              title="Re-center on Target School"
              className="w-9 h-9 bg-white/95 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white transition mt-1 cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-sky-600" />
            </button>
          </div>
        )}

        {/* Bottom Geodesic Legal Footnote & Attribution */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] text-slate-500 border-t border-slate-200 flex items-center justify-between z-20">
          <div
            onClick={onOpenGeodesicInfo}
            className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 transition truncate"
          >
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Distances computed from school perimeter boundary under 2022 MOE revision
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </div>

          <div
            className="flex items-center gap-1.5 pl-2 shrink-0"
            dangerouslySetInnerHTML={{ __html: ONEMAP_BASEMAP_OPTIONS.attribution }}
          />
        </div>
      </div>
    </section>
  );
};
