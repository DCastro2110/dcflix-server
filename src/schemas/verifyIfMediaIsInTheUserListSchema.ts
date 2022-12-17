import * as yup from 'yup';

export const verifyIfMediaIsInTheUserListSchema = yup.object().shape({
  body: yup.object().shape({}),
  query: yup.object().shape({}),
  params: yup.object().shape({
    mediaId: yup.string().required(),
  }),
});
