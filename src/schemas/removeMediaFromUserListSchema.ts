import { z } from 'zod';

export const removeMediaFromUserListSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({mediaId: z.string()})
})