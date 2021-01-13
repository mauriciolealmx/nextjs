import { DataStore } from '@aws-amplify/datastore';
import { Post, ReasonV2 } from 'models';

export const getPostById = (id) => {
  return DataStore.query(Post, id);
};

export const getReasonsByPostId = async (id) => {
  const reasons = await DataStore.query(ReasonV2);
  const postReasons = reasons.filter((reason) => reason.postID === id);
  return postReasons;
};

export const getReasonById = (id) => {
  return DataStore.query(ReasonV2, id);
};

export const updateReasonById = async (id, callback) => {
  const originalReason = await getReasonById(id);
  return DataStore.save(ReasonV2.copyOf(originalReason, callback));
};
