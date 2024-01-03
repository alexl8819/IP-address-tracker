import { RateLimitError, InvalidRequestError, UpstreamError, ServerError } from './error';
import { Buffer } from 'buffer';

export async function getLocation (query = null, baseUrl = 'https://ip-address-tracker-rho-mauve.vercel.app/') {
  const response = await fetch(`${baseUrl}api/geo${query ? `?query=${encodeURIComponent(Buffer.from(query).toString('base64'))}` : ''}`);
  if (!response.ok) {
    if (response.status === 429) {
      throw new RateLimitError('Too many requests');
    } else if (response.status === 400) {
      throw new InvalidRequestError('Bad request');
    } else if (response.status === 500) {
      throw new UpstreamError('Upstream API could not process request');
    } else if (response.status === 502) {
      throw new ServerError('Failed to process request. Try again later');
    }
  }
  const data = await response.json();
  return data;
}
