import { InputRoleInterface, RoleInterface } from "@src/interfaces";
import { RoleRepository } from "./../repositories/roleRepository";
import slug from "slug";
import { GraphQLError } from "graphql";

export class RoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }
  async create(input: InputRoleInterface): Promise<RoleInterface> {
    const roleSulg = slug(input.label);
    const roleSlugExists = await this.repository.findOne({
      where: { slug: roleSulg },
    });
    if (roleSlugExists)
      throw new GraphQLError(`Role: ${input.label} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `label ${input.label} does not exists.`,
          attribute: "label",
        },
      });
    input.slug = roleSulg;
    return this.repository.create(input);
  }

  async updateOne(
    id: number,
    input: InputRoleInterface
  ): Promise<RoleInterface> {
    const roleExists = await this.repository.findByPk(id);
    if (!roleExists) throw new Error(`Role: ${id} does not exist!`);

    if (input.label) {
      const roleSulg = slug(input.label);
      const roleSlugExists = await this.repository.findOne({
        where: { slug: roleSulg },
      });
      if (roleSlugExists && roleSlugExists.id !== id)
        throw new GraphQLError(`Role: ${input.label} already exist!`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `label ${input.label} does not exists.`,
            attribute: "label",
          },
        });
      input.slug = roleSulg;
    }
    const update = await this.repository.updateOne({ id, input });
    //checks if updating the role matches the existing role id
    if (update[0] === 0)
      // throw new GraphQLError(`Role: ${id} does not exist!`);
      throw new GraphQLError(`Role: ${id} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `label ${id} does not exists.`,
          attribute: "label",
        },
      });
    return this.repository.findByPk(id);
  }
}
