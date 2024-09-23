import Boom from "@hapi/boom";
import { WhereOptions } from "sequelize";
import { InputUserInterface, UserInterface } from "../interfaces";
import { UserRepository } from "../repositories";
import * as Sequelize from "sequelize";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  findOne({
    email,
    sub,
  }: {
    email?: string;
    sub?: string;
  }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};
    let workspacesWhere: WhereOptions<any> = {};
    if (sub) {
      where = { ...where, sub: sub };
    }
    if (email) {
      where = { ...where, email: email };
    }
    return this.repository.findOne({
      where,
    });
  }

  async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserInterface>
  ): Promise<UserInterface> {
    const userExists = await this.repository.findByPk(id);
    if (!userExists)
      throw Boom.badRequest("User update failed", [
        {
          message: `User ${id} does not exists`,
          path: ["id"],
        },
      ]);

    if (input.email) {
      const emailExists = await this.repository.findOne({
        where: { email: input.email.trim() },
      });
      if (emailExists && emailExists.id !== id)
        throw Boom.badRequest("Update Failed", {
          message: `Email ${input.email} already exists`,
          path: ["email"],
        });
    }

    await this.repository.updateOne({
      id: id,
      input: input,
    });

    return this.findByPk(id);
  }

  async findByPk(id: number): Promise<UserInterface> {
    const userExists = await this.repository.findByPk(id);
    if (!userExists)
      throw Boom.badRequest("User doesn't exists", [
        {
          message: `User ${id} does not exist!`,
          path: ["id"],
        },
      ]);
    return userExists;
  }
}
