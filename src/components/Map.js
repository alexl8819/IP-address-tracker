import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

import 'leaflet/dist/leaflet.css';

export default function Map ({ coords }) {
  if (!coords.length) {
    return null;
  }
  return (
    <MapContainer center={coords} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}></Marker>
    </MapContainer>
  );
}

Map.propTypes = {
  coords: PropTypes.array
};
