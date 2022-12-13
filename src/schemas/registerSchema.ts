import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'Passwords are not the same.'),
  }),
  query: yup.object().shape({}),
  params: yup.object().shape({}),
});
