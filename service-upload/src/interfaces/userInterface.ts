import * as Sequelize from "sequelize";

export interface InputUserInterface {
  sub?: string;
  name?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
}

export interface UserInterface extends InputUserInterface {
  id: Sequelize.CreationOptional<number>;
}
