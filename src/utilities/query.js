import { RateLimitError, InvalidRequestError, UpstreamError } from './error';
import { Buffer } from 'buffer';

export async function getLocation (base, query = null) {
  const response = await fetch(`${base}api/geo${query ? `?query=${encodeURIComponent(Buffer.from(query).toString('base64'))}` : ''}`);
  if (!response.ok) {
    if (response.status === 429) {
      throw new RateLimitError('Too many requests');
    } else if (response.status === 400) {
      throw new InvalidRequestError('Bad request');
    } else if (response.status === 500) {
      throw new UpstreamError('Upstream API could not process request');
    }
  }
  const data = await response.json();
  return data;
}
