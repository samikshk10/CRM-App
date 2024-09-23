import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, UserSocialCredentialModelInterface } from ".";
export interface InputPlatformInterface {
    name: string;
    slug: string;
    active: boolean;
    avatarUrl: string;
}

export interface PlatformInterface
    extends ModelTimestampExtend,
    InputPlatformInterface {
    id: Sequelize.CreationOptional<number>;
    userSocialCredential?: UserSocialCredentialModelInterface
}

export interface PlatfromModelInterface
    extends Sequelize.Model<PlatformInterface, Partial<InputPlatformInterface>>,
    PlatformInterface { }

export interface ArgsPlatformInterface
    extends CursorPaginationOrderSearchExtend { }