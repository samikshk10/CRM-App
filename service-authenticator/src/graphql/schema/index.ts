import { buildSubgraphSchema } from "@apollo/subgraph";
import { authResolvers, roleResolvers } from "../resolvers";
import { authDefs } from "../typeDefs";
import { userDefs } from "../typeDefs/userTypeDefs";
import { roleDefs } from "../typeDefs";

export const schema = buildSubgraphSchema([
  { typeDefs: authDefs, resolvers: authResolvers },
  { typeDefs: userDefs },
  {typeDefs: roleDefs, resolvers: roleResolvers}
]);
