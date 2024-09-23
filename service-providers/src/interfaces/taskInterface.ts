import * as Sequelize from "sequelize";
import {
  CursorPaginationOrderSearchExtend, ModelTimestampExtend
} from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputTaskInterface extends OwnerExtendInterface {
  title: string;
  contactId: number;
  description: string;
  typeId: number;
  assigneeId: number;
  dueDate: Date;
  parentId: number;
  reminderDate: Date;
  ownerId: number;
  completedDate: Date;
  reporterId: number;
  pipelineId: number;
  level: number;
  tagId: number;
  starred: boolean;
  createdById: number;
  updatedById: number;
  subTasks?: string[];
}

export interface UpdatedTaskInterface {
  title: string;
  description: string;
  contactId: number;
  typeId: number;
  assigneeId: number;
  dueDate: Date;
  reminderDate: Date;
  completedDate: Date;
  pipelineId: number;
  starred: boolean;
  level: number;
  tagId: number;
  updatedById: number;
  subTasks?: string[];
}

export interface TaskInterface extends ModelTimestampExtend, InputTaskInterface, UpdatedTaskInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface TaskModelInterface
  extends Sequelize.Model<TaskInterface, Partial<InputTaskInterface>>,
  TaskInterface { }
export interface ArgsTaskInterface extends CursorPaginationOrderSearchExtend { }
