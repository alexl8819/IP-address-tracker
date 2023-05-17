import { useState, useEffect } from 'react';
import { LRUCache } from 'lru-cache';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';

import TrackerResult from './Result';
import TrackerMap from './Map';

import { getLocation } from '../utilities/query';
import { InvalidRequestError, RateLimitError, ServerRelatedError } from '../utilities/error';

import 'react-toastify/dist/ReactToastify.css';

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

const isLocal = window ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') : false;

const emptyState = { 
  ip: '', 
  location: '', 
  timezone: '', 
  coords: [], 
  isp: '' 
};

const cache = new LRUCache({ max: 100 }); // cache repeat requests that have already been made

export default function IPAddressTracker () {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [geolocation, setGeolocation] = useState(emptyState);
  
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
      initialLanding = await getLocation(isLocal ? 'https://ip-address-tracker-eight-blush.vercel.app/' : '/', query);
    } catch (err) {
      console.error(err);
      if (err instanceof RateLimitError) {
        toast.error('Rate limited: Wait 10 seconds and try again.'); 
      } else if (err instanceof InvalidRequestError) {
        toast.error(`Invalid request: "${query}" did not return any results`);
      } else if (err instanceof ServerRelatedError) {
        toast.error('Server-related error occured: Try again later.');
      }
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
        <TrackerMap coords={geolocation.coords} />
      </TrackerMapContainer>
    </>
  );
}
