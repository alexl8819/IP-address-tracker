export async function getLocation (base = '/', ip = null) {
  const response = await fetch(`${base}api/geo${ip ? `?query=${ip}` : ''}`);
  const data = await response.json();
  return data;
}
