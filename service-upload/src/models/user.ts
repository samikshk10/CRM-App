import * as Sequelize from "sequelize";

import { Database } from "../config";
const sequelize = Database.sequelize;

const User = sequelize.define(
  "users",
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
    ownerId: {
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
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
    tableName: "authenticator_users",
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
