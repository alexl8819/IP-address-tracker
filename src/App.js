import { useState, useEffect, useMemo } from 'react';
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
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [isp, setIsp] = useState('');

  useEffect(async () => {
    let initialLanding;
    try {
      initialLanding = await getLocation();
    } catch (err) {
      console.error(err);
      return;
    }
    const { ip, location, isp } = initialLanding;
    const { region, city, country, lat, lng, timezone } = location;
    setIp(ip);
    setLocation(`${region}, ${city} ${country}`);
    setCoords([lat, lng]);
    setTimezone(timezone);
    setIsp(isp);
  }, []);

  return (
    <AppContainer>
      <TrackerMapContainer>
        <Suspense fallback={<Loading />}>
          <Header ip={ip} location={location} timezone={timezone} isp={isp} queryFn={fetchLocation} />
          <Map coords={coords} />
        </Suspense>
      </TrackerMapContainer>
    </AppContainer>
  );
}
