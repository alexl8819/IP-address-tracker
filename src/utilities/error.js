export class BalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BalanceError';
  }
}

export class UpstreamError extends Error {
  constructor (message) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export class RateLimitError extends Error {
  constructor (message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class InvalidRequestError extends Error {
  constructor (message) {
    super(message);
    this.name = 'InvalidRequestError';
  }
}

// Catch-all error
export class ServerError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ServerError';
  }
}
