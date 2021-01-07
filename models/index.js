// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ReasonV2, Post } = initSchema(schema);

export {
  ReasonV2,
  Post
};