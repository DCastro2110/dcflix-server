import { z } from 'zod';

export const getLinkToRecoverPasswordSchema  = z.object({
  body: z.object({
    email: z.string().email()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
})

