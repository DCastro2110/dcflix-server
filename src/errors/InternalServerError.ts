export class InternalServerError extends Error {
  public statusCode: number;
  constructor() {
    super('Internal server error.');
    this.statusCode = 500;
  }
}
