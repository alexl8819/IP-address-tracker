import kv from '@vercel/kv';
import { ipAddress } from '@vercel/edge';
import { Ratelimit } from '@upstash/ratelimit';
import cors from 'edge-cors';

const corsConfig = {
  origin: '*',
  methods: 'GET,HEAD',
};

export const config = {
  runtime: 'edge',
};

export default async function handler (request) {
  const API_KEY = process.env.GEOIP_API_KEY;
  const clientAddress = ipAddress(request);

  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, '10 s'),
    analytics: true
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

  const cachedResponse = await kv.get(clientAddress);
  
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
      message: 'Bad response - Missing client IP'
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
  await kv.set(ip, 60 * 60 * 24 * 1, response); // Cached for 24 hrs
  return cors(request, new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }), corsConfig);
}

async function locate (ipAddress, apiKey) {
  const geoResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`);
  const data = await geoResponse.json();
  return data;
}
