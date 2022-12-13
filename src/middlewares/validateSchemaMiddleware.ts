import { Request, Response, NextFunction } from 'express';
import { isSchema } from 'yup';
import { SchemaLike } from 'yup/lib/types';

export function validateSchemaMiddleware(schema: SchemaLike) {
  return async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      throw err;
    }
  };
}
