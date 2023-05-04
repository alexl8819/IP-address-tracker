import { useState, useEffect, useMemo, Suspense } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import Map from './components/Map';
import Loading from './components/Loading';

import { getLocation } from './utilities/query';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100hv;
  min-width: 320px;
`;

const TrackerMapContainer = styled.div`
  max-width: 23.438rem;

  @media screen and (min-width: 1024px) {
  }
`;

export default function App () {
  const [geolocation, setGeolocation] = useState({});

  useEffect(() => {
    async function runInitial () {
      let initialLanding;
      try {
        initialLanding = await getLocation('https://ip-address-tracker-eight-blush.vercel.app/');
      } catch (err) {
        console.error(err);
        return;
      }
      console.log(initialLanding);
      const { ip, location, isp } = initialLanding;
      const { region, city, country, lat, lng, timezone } = location;
      setGeolocation({
        ip,
        location: `${region}, ${city} ${country}`,
        coords: [lat, lng],
        timezone,
        isp
      });
    }
    runInitial();
  }, []);

  return (
    <AppContainer>
      <TrackerMapContainer>
        <Suspense fallback={<Loading />}>
          <Header ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} queryFn={() => {}} />
          { geolocation.coords ? <Map coords={geolocation.coords} /> : null }
        </Suspense>
      </TrackerMapContainer>
    </AppContainer>
  );
}
