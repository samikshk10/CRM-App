import { buildSubgraphSchema } from "@apollo/subgraph";
import { testTypeDefs } from "../typeDefs";
import { testResolvers } from "../resolvers";

export const schema = buildSubgraphSchema([
  { typeDefs: testTypeDefs, resolvers: testResolvers },
]);
