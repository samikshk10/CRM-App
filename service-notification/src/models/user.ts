import * as Sequelize from "sequelize";

import { Database } from "../config";
import { UserModelInterface } from "@src/interfaces";

const sequelize = Database.sequelize;

const User = sequelize.define<UserModelInterface>(
  "authenticator_users",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sub: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    ownerId: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "email_verified",
    },
    phoneNumber: {
      type: Sequelize.STRING,
      field: "phone_number",
    },
    phoneNumberVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "phone_number_verified",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: "authenticator_users_email",
        fields: ["email"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

export default User;
