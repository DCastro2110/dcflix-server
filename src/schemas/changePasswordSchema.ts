import * as yup from 'yup';

export const changePassword = yup.object().shape({
  body: yup.object().shape({
    password: yup
      .string()
      .required('Password field cannot be empty.')
      .min(8, 'The password must have at least 8 characters.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'The format of password is invalid.'
      ),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'Passwords are not the same.'),
  }),
  query: yup.object().shape({}),
  params: yup.object().shape({
    id: yup.string().required(),
  }),
});
