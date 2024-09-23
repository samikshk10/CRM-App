import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputTaskTypeInterface {
  label: string;
  slug: string;
  ownerId: number;
}

export interface TaskTypeInterface 
  extends ModelTimestampExtend,
  InputTaskTypeInterface {
  id?: Sequelize.CreationOptional<number>;
}



export interface TaskTypeModelInterface
  extends Sequelize.Model<TaskTypeInterface, Partial<InputTaskTypeInterface>>,
  TaskTypeInterface {}
export interface ArgsTaskTypeInterface extends CursorPaginationOrderSearchExtend{}

