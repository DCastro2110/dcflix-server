import * as yup from 'yup';

export const verifyIfRecoverPasswordIdIsValidSchema = yup.object().shape({
  body: yup.object().shape({}),
  query: yup.object().shape({}),
  params: yup.object().shape({
    id: yup.string().required(),
  }),
});
