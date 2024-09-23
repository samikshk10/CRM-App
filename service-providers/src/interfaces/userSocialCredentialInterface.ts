import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface ConfigFacebookInterface {
    appId: string;
    appSecret: string;
    platformId: number;
    callbackURL: string;
    verifyToken: string;
    webhookStatus?: string;
    webhookURL: string;
}

export interface UpdateUserSocialCredentialInterface {
    platformId: number;
    credentials: Record<string, string>;
}

export interface InputUserSocialCredentialInterface extends OwnerExtendInterface {
    appid: string;
    appsecret: string;
    callbackURL: string;
    platformId: number;
    webhookStatus?: string;
    webhookURL: string;
    verifyToken: string;
    accessToken: string;
    userId: string;
    displayName: string;
    businessID?: string;
    credentials: Record<string, string>;
}
export interface ModelInputUserSocialCredentialInterface extends OwnerExtendInterface {
    platformId: number;
    credentials: Record<string, string>;
}
export interface UserSocialCredentialInterface
    extends ModelTimestampExtend,
    ModelInputUserSocialCredentialInterface {
    id: Sequelize.CreationOptional<number>;
}

export interface UserSocialCredentialModelInterface
    extends Sequelize.Model<UserSocialCredentialInterface, Partial<ModelInputUserSocialCredentialInterface>>,
    UserSocialCredentialInterface { }

