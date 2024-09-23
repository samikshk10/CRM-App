import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputContactAttachmentInterface   {
  attachmentId: number;
  contactId: number;
}

export interface ContactAttachmentInterface
  extends ModelTimestampExtend,
    InputContactAttachmentInterface{
  id: Sequelize.CreationOptional<number>;
}

export interface ContactAttachmentModelInterface
  extends Sequelize.Model<
      ContactAttachmentInterface,
      Partial<InputContactAttachmentInterface>
    >,
    ContactAttachmentInterface {}