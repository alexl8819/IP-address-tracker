export const config = {
  runtime: 'edge',
};

export default async (request) => {
  const API_KEY = process.env.GEOIP_API_KEY;
  const clientAddress = '8.8.8.8'; //request.headers['x-real-ip'];
  console.log(request.headers);
  let geoIp; 
  try {
    geoIp = await locate(clientAddress, API_KEY);
  } catch (err) {
    return new Response(JSON({
      message: 'Bad response'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const { ip, location, isp } = geoIp;
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
