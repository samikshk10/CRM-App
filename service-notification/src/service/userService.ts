import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { InputUserInterface, UserInterface } from '../interfaces';
import { GraphQLError } from 'graphql';
import { UserRepository } from '../repository/index';

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
