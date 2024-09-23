import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { ContactSocialIdentitiesModelInterface } from "@src/interfaces";
import UserSocialCredential from "./userSocialCredential";
import Platform from "./platform";
const sequelize = Database.sequelize;

const ContactSocialIdentities = sequelize.define<ContactSocialIdentitiesModelInterface>(
    "providers_contact_social_identities",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        ownerId: {
            type: Sequelize.INTEGER,
            references: {
                model: "authenticator_users",
                key: "id",
            },
            field: "owner_id",
        },
        userSocialCredentialId: {
            type: Sequelize.BIGINT,
            references: {
                model: "providers_user_social_credentials",
                key: "id",
            },
            field: "user_social_credential_id",
        },
        contactAccessId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            field: "contact_access_id",
        },
        meta: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
    }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_contact_social_identities",
    freezeTableName: true,
    indexes: [
        {
            unique: true,
            name: "providers_contact_social_identities_owner_id_user_social_credential_id",
            fields: ["owner_id", "user_social_credential_id"],
            where: {
                deletedAt: null,
            },
        },
    ],
}
)


UserSocialCredential.hasMany(ContactSocialIdentities, {
    foreignKey: "userSocialCredentialId",
    as: "contactSocialCredential",
});

ContactSocialIdentities.belongsTo(UserSocialCredential, {
    foreignKey: "userSocialCredentialId",
    as: "userSocialCredential",
});
export default ContactSocialIdentities