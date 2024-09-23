import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputContactNoteInterface extends OwnerExtendInterface {
  description: string;
  contactId: number;
  createdById: number;
  updatedById: number;
}

export interface ContactNoteInterface extends ModelTimestampExtend, InputContactNoteInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface ContactNoteModelInterface
  extends Sequelize.Model<ContactNoteInterface, Partial<InputContactNoteInterface>>,
    ContactNoteInterface {}
export interface ArgsContactNoteInterface extends CursorPaginationOrderSearchExtend {}
