import { withFilter } from "graphql-subscriptions";

import { PubSub } from "../../config";

export const testResolvers = {
  Subscription: {
    hello: {
      subscribe: withFilter(
        () => PubSub.RedisPubSub.asyncIterator("Hello"),
        (payload, variables) => {
          if (payload && payload.hello !== null) {
            return true;
          }
          return false;
        }
      ),
      resolve: (payload: any) => {
        return payload;
      },
    },
  },
  // ...other resolvers...
};
