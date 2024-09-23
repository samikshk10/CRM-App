import { GraphQLResolveInfo } from "graphql";
import { Validator, Guard } from "../../middlewares";
import { createRole ,updateRole} from "../../validators";
import { InputRoleInterface, ContextInterface } from "../../interfaces";
import { RoleService } from "../../services";
import { SuccessResponse } from "../../helpers";
export const roleResolvers = {
  Mutation: {
    createRole: async (
      parent: ParentNode,
      args: { input: InputRoleInterface },
      contextValue: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(createRole, args.input);


      const data = await new RoleService().create(args.input);
      return SuccessResponse.send({
        message: "Role is successfully created.",
        data,
      });
    },
    updateRole: async (
      parent: ParentNode,
      args: { id: number; input: InputRoleInterface },
      contextValue: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(updateRole, args.input);
      const data = await new RoleService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Role is successfully updated.',
        data: data,
      });
    },
  },
};
