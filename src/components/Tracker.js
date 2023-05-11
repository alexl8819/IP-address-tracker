import { useState, useEffect } from 'react';
import styled from 'styled-components';

import TrackerHeader from './Header';
import TrackerMap from './Map';

import { getLocation } from '../utilities/query';
import { RateLimitError } from '../utilities/error';

const TrackerMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 23.438rem;

  @media screen and (min-width: 1024px) {
    max-width: 62rem;
  }
`;

export default function IPAddressTracker () {
  const [geolocation, setGeolocation] = useState({ coords: [] });
  const [error, setError] = useState('');
  
  const runQuery = async (query = null) => {
    let initialLanding;
    try {
      initialLanding = await getLocation('https://ip-address-tracker-eight-blush.vercel.app/', query);
    } catch (err) {
      console.error(err);
      if (err instanceof RateLimitError) {
        setError('RATE_LIMITED'); 
      }
      return;
    }
    const { ip, location, isp } = initialLanding;
    const { region, city, country, postalCode, lat, lng, timezone } = location;
    setGeolocation({
      ip,
      location: `${city}, ${region} ${country !== 'US' ? country : ''} ${postalCode || ''}`.trim(),
      coords: [lat, lng],
      timezone,
      isp
    });
  };

  useEffect(() => {
    runQuery();
  }, []);

  return (
    <TrackerMapContainer>
      <TrackerHeader ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} runQuery={runQuery} />
      <TrackerMap coords={geolocation.coords} />
    </TrackerMapContainer>
  );
}
