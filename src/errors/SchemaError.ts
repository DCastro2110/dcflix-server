export class SchemaError extends Error {
  public statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = 400;
  }
}
