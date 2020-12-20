// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, Reason } = initSchema(schema);

export {
  Post,
  Reason
};