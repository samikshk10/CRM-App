import * as Sequelize from 'sequelize'
import { ModelTimestampExtend } from '.';

export interface InputRoleInterface {
    label: string;
    slug: string;
    level: number;
    position: number;
}

export interface RoleInterface extends ModelTimestampExtend, InputRoleInterface {
    id: Sequelize.CreationOptional<number>;
}

export interface RoleModelInterface extends Sequelize.Model<RoleInterface, InputRoleInterface>, RoleInterface { }