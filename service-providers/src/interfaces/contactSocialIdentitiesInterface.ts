import * as Sequelize from "sequelize";
import { ModelTimestampExtend, UserSocialCredentialModelInterface } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputContactSocialIdentitiesInterface extends OwnerExtendInterface {
    contactAccessId: string;
    userSocialCredentialId: number;
    meta: Record<string, string>;
}

export interface ModelInputContactSocialIdentitiesInterface extends OwnerExtendInterface {
    ownerId: number;
    contactAccessId: string;
    userSocialCredentialId: number;
    meta: Record<string, string>;
}
export interface ContactSocialIdentitiesInterface
    extends ModelTimestampExtend,
    ModelInputContactSocialIdentitiesInterface {
    id: Sequelize.CreationOptional<number>;
    userSocialCredential?: UserSocialCredentialModelInterface
}

export interface ContactSocialIdentitiesModelInterface
    extends Sequelize.Model<ContactSocialIdentitiesInterface, Partial<ModelInputContactSocialIdentitiesInterface>>,
    ContactSocialIdentitiesInterface { }