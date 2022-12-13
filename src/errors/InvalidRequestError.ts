export class InvalidRequestError extends Error {
  public statusCode: number;
  constructor(msg?: string) {
    super(msg || 'Invalid request.');
    this.statusCode = 400;
  }
}
