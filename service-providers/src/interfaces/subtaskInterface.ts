import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";

export interface InputSubTaskInterface {
  description: string;
  ownerId?: number;
  taskId: number;
  completed: boolean;
}

export interface SubTaskInterface
  extends ModelTimestampExtend,
    InputSubTaskInterface {
  id?: Sequelize.CreationOptional<number>;
}

export interface SubTaskModelInterface
  extends Sequelize.Model<SubTaskInterface, Partial<InputSubTaskInterface>>,
    SubTaskInterface {}
