import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { UserSocialCredentialModelInterface } from "@src/interfaces";
import Platform from "./platform";
const sequelize = Database.sequelize;

const UserSocialCredential = sequelize.define<UserSocialCredentialModelInterface>(
    "providers_user_social_credentials",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        platformId: {
            type: Sequelize.BIGINT,
            references: {
                model: "providers_platforms",
                key: "id",
            },
            field: "platform_id",
        },
        ownerId: {
            type: Sequelize.INTEGER,
            references: {
                model: "authenticator_users",
                key: "id",
            },
            field: "owner_id",
        },
        credentials: {
            type: Sequelize.JSONB,
            allowNull: false,
        }
    }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_user_social_credentials",
    freezeTableName: true,
    indexes: [
        {
            unique: true,
            name: "providers_user_social_credentials_owner_id_platform_id",
            fields: ["owner_id", "platform_id"],
            where: {
                deletedAt: null,
            },
        },
    ],
}
)

Platform.hasOne(UserSocialCredential, {
    foreignKey: "platformId",
    as: "userSocialCredential",
});

UserSocialCredential.belongsTo(Platform, {
    foreignKey: "platformId",
    as: "platform",
});
export default UserSocialCredential;