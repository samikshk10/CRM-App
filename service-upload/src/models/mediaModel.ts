import * as Sequelize from "sequelize";
import { Database } from "../config";
import { MediaModelInterface } from "../interfaces";
const sequelize = Database.sequelize;

const Media = sequelize.define<MediaModelInterface>(
  "medias",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    originalname: {
      type: Sequelize.STRING,
    },
    mimetype: {
      type: Sequelize.STRING(50),
    },
    size: {
      type: Sequelize.INTEGER,
    },
    key: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    log: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "upload_medias",
    freezeTableName: true,
  }
);

export default Media;
