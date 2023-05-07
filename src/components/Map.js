import L from 'leaflet';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';

// Parcel workaround: https://github.com/parcel-bundler/parcel/issues/973#issuecomment-484470626
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

function LocationMarker ({ coords }) {
  const [position, setPosition] = useState(!coords.length ? null : coords)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export default function Map ({ coords }) {
  if (!coords.length) {
    return null;
  }

  return (
    <MapContainer center={coords} zoom={13} scrollWheelZoom={false} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker coords={coords}></LocationMarker>
    </MapContainer>
  );
}

Map.propTypes = {
  coords: PropTypes.array
};
