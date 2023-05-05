import { useState, useEffect, useMemo, Suspense } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
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
`;

const TrackerMapContainer = styled.div`
  max-width: 23.438rem;

  @media screen and (min-width: 1024px) {
  }
`;

export default function App () {
  const [geolocation, setGeolocation] = useState({ coords: [] });

  useEffect(() => {
    async function runInitial () {
      let initialLanding;
      try {
        initialLanding = await getLocation('https://ip-address-tracker-eight-blush.vercel.app/');
      } catch (err) {
        if (err instanceof RateLimitError) {
          // TODO: implement 
        }
        console.error(err);
        return;
      }
      const { ip, location, isp } = initialLanding;
      const { region, city, country, postalCode, lat, lng, timezone } = location;
      setGeolocation({
        ip,
        location: `${city}, ${region} ${country !== 'US' ? country : ''} ${postalCode || ''}`,
        coords: [lat, lng],
        timezone,
        isp
      });
    }
    runInitial();
  }, [geolocation]);

  return (
    <AppContainer>
      <TrackerMapContainer>
        <Suspense fallback={Loading}>
          <Header ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} runQuery={() => {}} />
          <Map coords={geolocation.coords} />
        </Suspense>
      </TrackerMapContainer>
    </AppContainer>
  );
}
