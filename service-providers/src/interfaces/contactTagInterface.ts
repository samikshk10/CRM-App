import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputContactTagInterface   {
  tagId: number;
  contactId: number;
}

export interface ContactTagInterface
  extends ModelTimestampExtend,
    InputContactTagInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface ContactTagModelInterface
  extends Sequelize.Model<
      ContactTagInterface,
      Partial<InputContactTagInterface>
    >,
    ContactTagInterface {}
