import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Helper component to handle center flyTo and resize trigger on selected ward change
function MapController({ selectedWard }) {
  const map = useMap();

  useEffect(() => {
    // Leaflet needs to invalidate its size whenever container width changes (e.g. from 100% to 65%)
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true });
      if (selectedWard) {
        map.flyTo([selectedWard.lat, selectedWard.lng], 12, {
          animate: true,
          duration: 0.8
        });
      } else {
        map.flyTo([7.5629, 4.5199], 10, {
          animate: true,
          duration: 0.8
        });
      }
    }, 450); // wait slightly for the CSS transition (400ms) to complete

    return () => clearTimeout(timer);
  }, [selectedWard, map]);

  return null;
}

function WardMarker({ w, selectedWard, onSelect }) {
  const isSelected = selectedWard?.id === w.id;

  return (
    <CircleMarker
      center={[w.lat, w.lng]}
      radius={isSelected ? 9 : 5}
      pathOptions={{
        color: isSelected ? '#00C896' : '#3B82F6', // Theme colors
        fillColor: isSelected ? '#00C896' : '#3B82F6',
        fillOpacity: isSelected ? 0.9 : 0.7,
        weight: isSelected ? 3 : 1.5,
      }}
      eventHandlers={{
        click: () => onSelect(w),
        mouseover: (e) => {
          e.target.setStyle({
            radius: isSelected ? 11 : 8,
            fillOpacity: 0.95
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            radius: isSelected ? 9 : 5,
            fillOpacity: isSelected ? 0.9 : 0.7
          });
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -6]} className="ward-tooltip" permanent={false}>
        <div className="font-sans text-[12px] font-bold text-[#E8F5EE] mb-1">{w.name}</div>
        <div className="font-mono text-[10px] text-[#A8C4B0]">Votes Cast: <span className="tabular-nums font-semibold">{w.votesCast.toLocaleString('en-NG')}</span></div>
        <div className="font-mono text-[10px] text-[#A8C4B0]">Accredited: <span className="tabular-nums font-semibold">{w.accreditedVoters.toLocaleString('en-NG')}</span></div>
      </Tooltip>
    </CircleMarker>
  );
}

// Function to compute boundary polygon for an LGA by sorting wards by angle and expanding
const getLgaPolygon = (lgaWards) => {
  if (lgaWards.length === 0) return [];
  
  // Find Centroid
  let sumLat = 0, sumLng = 0;
  lgaWards.forEach(w => {
    sumLat += w.lat;
    sumLng += w.lng;
  });
  const cLat = sumLat / lgaWards.length;
  const cLng = sumLng / lgaWards.length;

  // Sort by angle around centroid
  const sorted = [...lgaWards].sort((a, b) => {
    const angleA = Math.atan2(a.lat - cLat, a.lng - cLng);
    const angleB = Math.atan2(b.lat - cLat, b.lng - cLng);
    return angleA - angleB;
  });

  // Map to lat-lng pairs and expand outward from centroid to draw boundary
  return sorted.map(w => {
    const latOffset = w.lat - cLat;
    const lngOffset = w.lng - cLng;
    return [cLat + latOffset * 1.6, cLng + lngOffset * 1.6];
  });
};

export default function MapPane({ theme, wards, selectedWard, onSelect }) {
  // Group wards by LGA to construct boundary polygons
  const wardsByLga = {};
  wards.forEach(w => {
    if (!wardsByLga[w.lga]) {
      wardsByLga[w.lga] = [];
    }
    wardsByLga[w.lga].push(w);
  });

  const lgaPolygons = Object.keys(wardsByLga).map(lgaName => ({
    name: lgaName,
    coords: getLgaPolygon(wardsByLga[lgaName])
  }));

  const isLight = theme === 'light';
  const tileUrl = isLight 
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const polyBorderColor = isLight ? 'rgba(0, 150, 108, 0.35)' : 'rgba(0, 200, 150, 0.2)';
  const polyFillColor = isLight ? 'rgba(0, 150, 108, 0.04)' : 'rgba(0, 200, 150, 0.02)';
  const polyTextColor = isLight ? '#00966C' : '#00C896';

  return (
    <MapContainer 
      center={[7.5629, 4.5199]} 
      zoom={10} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      <MapController selectedWard={selectedWard} />
      
      {/* LGA boundary polygons */}
      {lgaPolygons.map(poly => (
        <Polygon
          key={poly.name}
          positions={poly.coords}
          pathOptions={{
            color: polyBorderColor,
            fillColor: polyFillColor,
            fillOpacity: 0.5,
            weight: 1.5,
            dashArray: '5, 5' // Tech-styled dash borders
          }}
        >
          <Tooltip sticky direction="center" className="ward-tooltip">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: polyTextColor }}>
              {poly.name} LGA Boundary
            </div>
          </Tooltip>
        </Polygon>
      ))}

      {wards.map((w) => (
        <WardMarker 
          key={w.id} 
          w={w} 
          selectedWard={selectedWard} 
          onSelect={onSelect} 
        />
      ))}
    </MapContainer>
  );
}
