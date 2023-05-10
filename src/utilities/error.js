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

export class ServerRelatedError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ServerRelatedError';
  }
}
