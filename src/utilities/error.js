export class BalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BalanceError';
  }
}