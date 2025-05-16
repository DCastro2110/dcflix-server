import {z} from 'zod'

export const addMediaToUserListSchema = z.object({
  body: z.object({
     title: z.string(),
    poster_path: z.string().url(),
    media_type: z.string(),
    overview: z.string()
  }), 
  query: z.object({}).optional(),
  params: z.object({
     mediaId: z.string(),
  })
})
 