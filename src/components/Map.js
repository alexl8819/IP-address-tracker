import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import PropTypes from 'prop-types';

import icon from '../images/icon-location.svg';

import 'leaflet/dist/leaflet.css';

const DEFAULT_COORDS = [51.505, -0.09];

const customMarker = createCustomMarkerIcon(icon);

export default function TrackerMap ({ coords }) {
  const usedCoords = !coords.length ? DEFAULT_COORDS : coords;
  return (
    <MapContainer center={usedCoords} zoom={13} scrollWheelZoom={false} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker coords={usedCoords} marker={customMarker}></LocationMarker>
    </MapContainer>
  );
}

TrackerMap.propTypes = {
  coords: PropTypes.array.isRequired
};

function LocationMarker ({ coords, marker }) {
  const map = useMap();
  map.flyTo(coords, map.getZoom());
  
  return !coords.length === null ? null : (
    marker ? <Marker position={coords} icon={marker} /> : <Marker position={coords} />
  );
}

LocationMarker.propTypes = {
  coords: PropTypes.array.isRequired,
  marker: PropTypes.instanceOf(L.Icon)
};

function createCustomMarkerIcon (iconUrl) {
  if (!iconUrl) {
    return null;
  }
  
  const u = new URL(iconUrl);
  return L.icon({ iconUrl: u.pathname + u.search });
}
