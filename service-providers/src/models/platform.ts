import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { PlatfromModelInterface } from "@src/interfaces";

const sequelize = Database.sequelize;
const Platform = sequelize.define<PlatfromModelInterface>(
    "providers_platforms",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        avatarUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            field: "avatar_url",
        },
    },
    {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: "providers_platforms",
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                name: "providers_platforms_slug",
                fields: ["slug"],
                where: {
                    deletedAt: null,
                },
            },
        ],
    }
);


export default Platform;