import kv from '@vercel/kv';
import { ipAddress, geolocation } from '@vercel/edge';
import { Ratelimit } from '@upstash/ratelimit';
import cors from 'edge-cors';

import { BalanceError, UpstreamError } from '../src/utilities/error';
import { digestMessage } from '../src/utilities/hash';
import { isValidIP, isValidDomain } from '../src/utilities/net';

export const config = {
  runtime: 'edge',
};

const corsConfig = {
  'origin': '*',
  'methods': 'GET,HEAD'
};

export default async function handler (request) {
  const API_KEY = process.env.GEOIP_API_KEY;
  
  const query = new URL(request.url).searchParams.get('query');
  const clientAddress = query ? Buffer.from(query, 'base64').toString().trim() : ipAddress(request);

  let ratelimit;

  try {
    ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(10, '10 s')
    });
  } catch (err) {
    return cors(request, new Response(JSON.stringify({
      message: 'Initialization Error - please try again later'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  const hashedAddress = await digestMessage(clientAddress); // obtain hex value of hashed address

  const { success } = await ratelimit.limit(hashedAddress);

  if (!success) {
    return cors(request, new Response(JSON.stringify({
      message: 'Rate limited - please try again later'
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  if (!isValidIP(clientAddress) && !isValidDomain(clientAddress)) {
    return cors(request, new Response(JSON.stringify({
      message: 'Bad request - Invalid query: Must be a valid IPv4, IPv6 address or domain name'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  let cachedResponse;

  try {
    cachedResponse = await kv.get(hashedAddress);
  } catch (err) {
    console.error(err);
  }
  
  if (cachedResponse) {
    console.log(`Cached response for ${hashedAddress}`);
    return cors(request, new Response(JSON.stringify(cachedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  if (!clientAddress) {
    return cors(request, new Response(JSON.stringify({
      message: 'Bad response - Missing client address'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  let geoIp;

  try {
    geoIp = await locate(clientAddress, API_KEY);
  } catch (err) {
    console.error(err);
    if (err instanceof BalanceError && !query) { // use fallback measure only for initial request (non-queried)
      const { region, city, country, latitude, longitude } = geolocation(request);
      geoIp = {
        ip: clientAddress,
        location: {
          region,
          city,
          country,
          lat: latitude,
          lng: longitude,
          timezone: 'Unknown'
        },
        isp: 'Unknown'
      }
      return;
    }
    return cors(request, new Response(JSON.stringify({
      message: 'Bad response - GeoIP query failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  const { ip, location, isp } = geoIp;
  const response = JSON.stringify({
    ip,
    location,
    isp
  });
  
  const _ = await kv.set(hashedAddress, response, { ex: 60 * 60 * 24 * 1, nx: true }); // Cached for 24 hrs to prevent abuse
  
  return cors(request, new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }), corsConfig);
}

async function locate (ipAddressOrDomain, apiKey) {
  const balance = await fetch(`https://geo.ipify.org/service/account-balance?apiKey=${apiKey}`);
  const { credits } = await balance.json();

  if (credits <= 10) {
    throw new BalanceError('Credits are near zero: Unable to fulfill request');
  }

  const geoResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${isValidIP(ipAddressOrDomain) ? `ipAddress` : 'domain'}=${ipAddressOrDomain}`);
  
  if (!geoResponse.ok && geoResponse.status === 400) {
    throw new UpstreamError('Bad request: Invalid query');
  }

  const geoData = await geoResponse.json();
  return geoData;
}
