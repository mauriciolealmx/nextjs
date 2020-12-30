import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Reason {
  readonly title?: string;
  readonly description?: string;
  readonly votes?: number;
  readonly id?: string;
  constructor(init: ModelInit<Reason>);
}

export declare class ReasonV2 {
  readonly id: string;
  readonly postID: string;
  readonly title?: string;
  readonly description?: string;
  readonly votes?: number;
  constructor(init: ModelInit<ReasonV2>);
  static copyOf(source: ReasonV2, mutator: (draft: MutableModel<ReasonV2>) => MutableModel<ReasonV2> | void): ReasonV2;
}

export declare class Post {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly createdAt?: string;
  readonly reasons?: (Reason | null)[];
  readonly reasonsV2?: (ReasonV2 | null)[];
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}