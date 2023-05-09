import kv from '@vercel/kv';
import { ipAddress, geolocation } from '@vercel/edge';
import { Ratelimit } from '@upstash/ratelimit';
import cors from 'edge-cors';
import { isIPv4, isIPv6 } from 'is-ip';
import isValidHostname from 'is-valid-hostname';

const corsConfig = {
  origin: '*',
  methods: 'GET,HEAD',
};

export const config = {
  runtime: 'edge',
};

class BalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BalanceError';
  }
}

export default async function handler (request) {
  const API_KEY = process.env.GEOIP_API_KEY;
  const query = new URL(request.url).searchParams.get('query');
  const clientAddress = query ? Buffer.from(query, 'base64').toString() : ipAddress(request);

  // const hashedAddress = await digestMessage(clientAddress); // obtain hex value of hashed address

  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '10 s')
  });

  const { success } = await ratelimit.limit(clientAddress);

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

  if (!isIPv4(clientAddress) && !isIPv6(clientAddress) && !isValidHostname(clientAddress) && clientAddress !== 'localhost') {
    return cors(request, new Response(JSON.stringify({
      message: 'Bad request - Invalid query: Must be a valid IPv4, IPv6 address or hostname'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }), corsConfig);
  }

  let cachedResponse;

  try {
    cachedResponse = await kv.get(clientAddress);
  } catch (err) {
    console.error(err);
  }
  
  if (cachedResponse) {
    console.log(`Cached response for ${clientAddress}`);
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
    if (err instanceof BalanceError) { // use fallback measure
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
  await kv.set(ip, response, { ex: 60 * 60 * 24 * 1, nx: true }); // Cached for 24 hrs to prevent abuse
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
    throw new BalanceError('Credits are near zero');
  }

  const geoResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${isValidHostname(ipAddressOrDomain) ? `domain` : 'ipAddress'}=${ipAddressOrDomain}`);
  const geoData = await geoResponse.json();
  return geoData;
}

/*async function digestMessage (message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}*/
