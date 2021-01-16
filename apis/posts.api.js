import { DataStore } from '@aws-amplify/datastore';
import { Post, ReasonV2 } from 'models';

export const getPostById = (id) => {
  return DataStore.query(Post, id);
};

export const getReasonsByPostId = (id) => {
  return DataStore.query(ReasonV2, (r) => r.postID('eq', id));
};

export const getReasonById = (id) => {
  return DataStore.query(ReasonV2, id);
};

export const updateReasonById = async (id, callback) => {
  const originalReason = await getReasonById(id);
  return DataStore.save(ReasonV2.copyOf(originalReason, callback));
};

export const createReasonForPost = ({ postID, title, description }) => {
  return DataStore.save(
    new ReasonV2({
      postID,
      title,
      description,
      votes: 0,
    })
  );
};
