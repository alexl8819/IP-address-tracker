import { RateLimitError } from './error';

export async function getLocation (base = '/', ip = null) {
  const response = await fetch(`${base}api/geo${ip ? `?query=${ip}` : ''}`);
  if (!response.ok() && response.status === 429) {
    throw new RateLimitError('Too many requests');
  }
  const data = await response.json();
  return data;
}
