import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { LRUCache } from 'lru-cache';
import { ToastContainer, toast } from 'react-toastify';
import { styled } from '@compiled/react';
import PropTypes from 'prop-types';

import TrackerResult from './Result';
import { TextLoading } from './Loading';

const TrackerMap = lazy(() => import('./Map'));

import { getLocation } from '../utilities/query';
import { InvalidRequestError, RateLimitError, UpstreamError } from '../utilities/error';

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

const emptyState = { 
  ip: '', 
  location: '', 
  timezone: '', 
  coords: [], 
  isp: '' 
};

const cache = new LRUCache({ max: 100 }); // cache repeat requests that have already been made

export default function IPAddressTracker ({ baseGeoUrl }) {
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
      initialLanding = await getLocation(baseGeoUrl, query);
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
    <>
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
        <TrackerResult ip={geolocation.ip} location={geolocation.location} timezone={geolocation.timezone} isp={geolocation.isp} error={error} updateQuery={setQuery} />
        <Suspense fallback={<TextLoading />}>
          <TrackerMap coords={geolocation.coords} />
        </Suspense>
      </TrackerMapContainer>
    </>
  );
}

IPAddressTracker.propTypes = {
  baseGeoUrl: PropTypes.string.isRequired
};
