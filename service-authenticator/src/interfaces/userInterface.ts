import * as Sequelize from 'sequelize'
import { ModelTimestampExtend } from '.';

export interface InputUserInterface {
    sub?: string;
    name?: string;
    ownerId?:number;
    username?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    phoneNumberVerified?: boolean;
    password?: string;
    accessToken?: string;
}

export interface UserInterface extends ModelTimestampExtend, InputUserInterface {
    id: Sequelize.CreationOptional<number>;
}
export interface InputChangePasswordInterface {
    accessToken: string;
    previousPassword: string;
    proposedPassword: string;
}

export interface UserModelInterface extends Sequelize.Model<UserInterface, Partial<InputUserInterface>>, UserInterface { }