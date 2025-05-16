import * as z from 'zod';

export const changePassword = z.object({
  body: z.object({
    password: z
      .string().nonempty('Password field cannot be empty.')
      .min(8, 'The password must have at least 8 characters.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'The format of password is invalid.'
      ),
    passwordConfirmation: z.string()
  }).refine(schema => {
    return (schema.password === schema.passwordConfirmation)
  }, "The password are not the same!"),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string(),
  })
});
