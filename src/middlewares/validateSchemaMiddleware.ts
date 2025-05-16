import { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod'
import { SchemaError } from '../errors/SchemaError';
import { InvalidRequestError } from '../errors/InvalidRequestError';

export function validateSchemaMiddleware(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      await schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(new SchemaError(err.message));
      }
      next(new InvalidRequestError());
    }
  };
}
