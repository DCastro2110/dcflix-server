import { Request, Response, NextFunction } from 'express';
import { isSchema, ValidationError } from 'yup';
import { SchemaLike } from 'yup/lib/types';

import { SchemaError } from '../errors/SchemaError';
import { InvalidRequestError } from '../errors/InvalidRequestError';

export function validateSchemaMiddleware(schema: SchemaLike) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return next(new SchemaError(err.message));
      }
      next(new InvalidRequestError());
    }
  };
}
