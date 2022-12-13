import { Request, Response, NextFunction } from 'express';

interface IRequestError {
  message: string;
  statusCode: number;
}

export function errorsTreatmentMiddleware(
  err: IRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err && err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  next();
}
