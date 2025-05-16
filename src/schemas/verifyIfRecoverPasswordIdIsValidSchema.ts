import { z } from 'zod';

export const verifyIfRecoverPasswordIdIsValidSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({id: z.string()}).optional()
})

;
