import kv from '@vercel/kv';
import { ipAddress } from '@vercel/edge';

export const config = {
  runtime: 'edge',
};

export default async (request) => {
  const API_KEY = process.env.GEOIP_API_KEY;
  const clientAddress = ipAddress(request);

  const cachedResponse = await kv.get(clientAddress);
  
  if (cachedResponse) {
    return new Response(cachedResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (!clientAddress) {
    return new Response(JSON.stringify({
      message: 'Bad response - Missing client IP'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  let geoIp;

  try {
    geoIp = await locate(clientAddress, API_KEY);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({
      message: 'Bad response - GeoIP query failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const { ip, location, isp } = geoIp;
  const response = JSON.stringify({
    ip,
    location,
    isp
  });
  await kv.set(ip, response);
  return new Response(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

async function locate (ipAddress, apiKey) {
  const geoResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`);
  const data = await geoResponse.json();
  return data;
}
