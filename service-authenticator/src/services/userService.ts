import * as Sequelize from "sequelize";
import { WhereOptions } from "sequelize";
import { InputUserInterface, UserInterface } from "../interfaces";
import { UserRepository } from "../repositories";
import { GraphQLError } from "graphql";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async create(input: InputUserInterface): Promise<UserInterface> {
    if (input.email) {
      const emailExists = await this.repository.findOne({
        where: { email: input.email.trim() },
      });
      if (emailExists) {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Email ${input.email} already exists.`,
            attribute: "Email",
          },
        });
      }
    }
    return this.repository.create(input);
  }

  public async updateById(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserInterface>
  ) {
    const userExists = await this.repository.findByPk(id)
    if(!userExists)   throw new GraphQLError(`User does not exists`, {
      extensions: {
        code: "INVALID_USER_ID",
        status: 400,
        message: `User with id ${id} does not exists.`,
        attribute: "id",
      },
    });
    await this.repository.updateOne({
      id,
      input,
    });
  }

  public async update(
    { email }: { email?: string },
    input: Partial<InputUserInterface>
  ): Promise<[number]> {
    let where: WhereOptions<any> = {};

    if (email) {
      where = { ...where, email: email };
    }

    return this.repository.update({
      where,
      input,
    });
  }

  public async findOne({
    email,
    sub,
  }: {
    email?: string;
    sub?: string;
  }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};
    if (email) {
      where = { ...where, email: email };
    }

    return this.repository.findOne({
      where,
    });
  }

  public async findByPk(id: number): Promise<UserInterface> {
    const userExists = await this.repository.findByPk(id);
    if (!userExists) throw new Error(`User: ${id} does not exist!`);
    return userExists;
  }

  public async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserInterface>
  ): Promise<UserInterface> {
    const userExists = await this.repository.findByPk(id);
    if (!userExists)
      if (!userExists) throw new Error(`User: ${id} does not exist!`);

    if (input.email) {
      const emailExists = await this.repository.findOne({
        where: { email: input.email.trim() },
      });
      if (emailExists && emailExists.id !== id)
        throw new Error(`E-mail: ${input.email} is already exists!`);
    }
    await this.repository.updateOne({
      id,
      input,
    });
    return this.findByPk(id);
  }
}
