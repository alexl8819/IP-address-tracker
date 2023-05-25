import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { LRUCache } from 'lru-cache';
import { ToastContainer, toast } from 'react-toastify';
import { styled } from '@compiled/react';
import PropTypes from 'prop-types';

import TrackerResults from './components/Result';
import QueryBar from './components/QueryBar';
import { TextLoading } from './components/Loading';

const TrackerMap = lazy(() => import('./components/Map'));

import { getLocation } from './utilities/query';
import { InvalidRequestError, RateLimitError, UpstreamError } from './utilities/error';

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

  @media screen and (width >= 1024px) {
    background-image: var(--bg-desktop-pattern);
  }
`;

const TrackerMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 23.438rem;

  @media screen and (width >= 1024px) {
    max-width: 62rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--white);
  text-align: center;
  margin-bottom: 10px;
`;


const ResultContainer = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  padding-top: 175px;
  padding-left: 25px;
  padding-right: 25px;
  position: relative;
  z-index: 1;

  @media screen and (width >= 1024px) {
    height: 200px;
    padding-top: 150px;
  }

  @media screen and (width >= 1280px) {
    height: 240px;
    padding-top: 125px;
  }
`;

const emptyState = {
  ip: '',
  location: '',
  timezone: '',
  coords: [],
  isp: ''
};

const cache = new LRUCache({ max: 100 }); // cache repeat requests that have already been made

export default function App () {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [geolocation, setGeolocation] = useState(emptyState);
  const toastId = useRef(null);
  
  const runQuery = async () => {
    const existingQuery = cache.get(query); // aggressively cache queries that have already been executed
    if (query && query.length && existingQuery) {
      setGeolocation(existingQuery);
      return;
    }
    const prevState = geolocation; // save previous state in case of error
    setError(false);
    setGeolocation(Object.assign({}, emptyState, {
      coords: geolocation.coords // we don't want to trigger a change in coords prematurely
    }));
    let initialLanding;
    try {
      initialLanding = await getLocation(query);
    } catch (err) {
      console.error(err);
      if (err instanceof RateLimitError) {
        toastId.current = toast.error('Rate limited: Wait 10 seconds and try again.'); 
      } else if (err instanceof InvalidRequestError || err instanceof UpstreamError) {
        toastId.current = toast.error(`Invalid request: "${query}" did not return any results`);
      }
      toastId.current = null;
      setError(true);
      // Rollback prev state
      setGeolocation(prevState);
      return;
    }
    const { ip, location, isp } = initialLanding;
    const { region, city, country, postalCode, lat, lng, timezone } = location;
    const result = Object.freeze({
      ip,
      location: `${city}, ${region} ${country !== 'US' ? country : ''} ${postalCode || ''}`.trim(),
      coords: [lat, lng],
      timezone,
      isp
    });
    cache.set(query || ip, result);
    setGeolocation(result);
  };

  useEffect(() => {
    runQuery();
  }, [query]);

  return (
    <AppContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
      <TrackerMapContainer>
        <ResultContainer>
          <Title>IP Address Tracker</Title>
          <QueryBar updateQuery={setQuery} error={error} result={geolocation.ip} />
          <TrackerResults ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} />
        </ResultContainer>
        <Suspense fallback={<TextLoading />}>
          <TrackerMap coords={geolocation.coords} />
        </Suspense>
      </TrackerMapContainer>
    </AppContainer>
  );
}
