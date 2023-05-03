import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export default function Map ({ coords }) {
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
