import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { InputUserInterface, UserInterface } from '@src/interfaces';
import { UserRepository } from '@src/repositories';
import { GraphQLError } from 'graphql';

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
    if (email) {
      where = { ...where, email: email };
    }

    return this.repository.findOne({
      where,
    });
  }
}
