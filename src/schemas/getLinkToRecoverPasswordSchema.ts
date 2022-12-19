import * as yup from 'yup';

export const getLinkToRecoverPasswordSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email().required(),
  }),
  query: yup.object().shape({}),
  params: yup.object().shape({}),
});
