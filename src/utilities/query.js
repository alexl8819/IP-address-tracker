import { RateLimitError, InvalidRequestError, ServerRelatedError } from './error';

export async function getLocation (base = '/', query = null) {
  const response = await fetch(`${base}api/geo${query ? `?query=${query}` : ''}`);
  if (!response.ok) {
    if (response.status === 429) {
      throw new RateLimitError('Too many requests');
    } else if (response.status === 400) {
      throw new InvalidRequestError('Error in query');
    } else if (response.status === 500) {
      throw new ServerRelatedError('Failed to process request');
    }
  }
  const data = await response.json();
  return data;
}
