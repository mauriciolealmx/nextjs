import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Reason {
  readonly title?: string;
  readonly description?: string;
  readonly votes?: number;
  readonly id?: string;
  constructor(init: ModelInit<Reason>);
}

export declare class Post {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly createdAt?: string;
  readonly reasons?: (Reason | null)[];
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}