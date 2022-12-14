import * as yup from 'yup';

export const addMediaToUserListSchema = yup.object().shape({
  body: yup.object().shape({
    title: yup.string().required(),
    poster_path: yup.string().url(),
    media_type: yup.string(),
  }),
  query: yup.object().shape({}),
  params: yup.object().shape({
    mediaId: yup.string().required(),
  }),
});
