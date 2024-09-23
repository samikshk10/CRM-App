import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";

export interface InputTaskTagInterface   {
  tagId: number[];
  taskId: number;
}

export interface TaskTagInterface
  extends ModelTimestampExtend,
  InputTaskTagInterface {
  id: Sequelize.CreationOptional<number>;
} 

export interface TaskTagModelInterface
  extends Sequelize.Model<
      TaskTagInterface,
      Partial<InputTaskTagInterface>
    >,
    TaskTagInterface {}
