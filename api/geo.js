export const config = {
  runtime: 'edge',
};

export default async (request) => {
  const API_KEY = process.env.GEOIP_API_KEY;
  const clientAddress = request.headers['x-real-ip'];
  const { ip, location, isp } = await locate(clientAddress, API_KEY);
  console.log(`${clientAddress} -> ${ip} ${isp}`);
  return new Response(JSON.stringify({
    ip,
    location,
    isp
  }), {
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
