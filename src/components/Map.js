import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import PropTypes from 'prop-types';

import icon from '../images/icon-location.svg';

import 'leaflet/dist/leaflet.css';

// Parcel workaround: https://github.com/parcel-bundler/parcel/issues/973#issuecomment-484470626
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
});

const DEFAULT_COORDS = [51.505, -0.09];

export default function TrackerMap ({ coords }) {
  const usedCoords = !coords.length ? DEFAULT_COORDS : coords;
  return (
    <MapContainer center={usedCoords} zoom={13} scrollWheelZoom={false} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker coords={usedCoords}></LocationMarker>
    </MapContainer>
  );
}

TrackerMap.propTypes = {
  coords: PropTypes.array.isRequired
};

function LocationMarker ({ coords }) {
  const map = useMap();
  map.flyTo(coords, map.getZoom());
  
  return !coords.length === null ? null : (
    <Marker position={coords}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

LocationMarker.propTypes = {
  coords: PropTypes.array.isRequired
};
