import { useMemo } from 'react';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import PropTypes from 'prop-types';

import icon from '../images/icon-location.svg';

const DEFAULT_COORDS = [51.505, -0.09];

const customMarker = createCustomMarkerIcon(icon);

export default function TrackerMap ({ coords }) {
  const center = !coords.length ? DEFAULT_COORDS : coords;

  const displayMap = useMemo(() => (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      <LocationMarker center={center} marker={customMarker}></LocationMarker>
    </MapContainer>
  ), [center]);

  return (<>{displayMap}</>);
}

TrackerMap.propTypes = {
  coords: PropTypes.array.isRequired
};

function LocationMarker ({ center, marker }) {
  const map = useMap();
  map.flyTo(center, map.getZoom());
  
  return !center.length === null ? null : (
    marker ? <Marker position={center} icon={marker} /> : <Marker position={center} />
  );
}

LocationMarker.propTypes = {
  center: PropTypes.array.isRequired,
  marker: PropTypes.instanceOf(Icon)
};

function createCustomMarkerIcon (iconUrl) {
  if (!iconUrl) {
    return null;
  }
  
  const u = new URL(iconUrl);
  return new Icon({ iconUrl: u.pathname + u.search });
}
