import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputTaskAttachmentInterface   {
  attachmentId: number;
  taskId: number;
}

export interface TaskAttachmentInterface
  extends ModelTimestampExtend,
    InputTaskAttachmentInterface{
  id: Sequelize.CreationOptional<number>;
}

export interface TaskAttachmentModelInterface
  extends Sequelize.Model<
      TaskAttachmentInterface,
      Partial<InputTaskAttachmentInterface>
    >,
    TaskAttachmentInterface {}