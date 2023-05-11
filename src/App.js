import { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';

import TrackerHeader from './components/Header';
import Map from './components/Map';
import Loading from './components/Loading';

import { getLocation } from './utilities/query';
import { RateLimitError } from './utilities/error';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 320px;
  background-image: var(--bg-mobile-pattern);
  background-repeat: no-repeat;
  background-size: contain;

  @media screen and (min-width: 1024px) {
    background-image: var(--bg-desktop-pattern);
  }
`;

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

export default function App () {
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
  }

  useEffect(() => {
    // runQuery();
  }, []);

  return (
    <AppContainer>
      <TrackerMapContainer>
        <Suspense fallback={Loading}>
          <TrackerHeader ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} runQuery={runQuery} />
          <Map coords={geolocation.coords} />
        </Suspense>
      </TrackerMapContainer>
    </AppContainer>
  );
}
