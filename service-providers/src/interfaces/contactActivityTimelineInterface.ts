import * as Sequelize from "sequelize";
import { ContactActivityTypeEnum } from "@src/enums";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputContactActivityTimelineInterface {
  contactId: number;
  activityById: number;
  referenceId: number;
  referenceRelation: string;
  type: ContactActivityTypeEnum;
}

export interface ContactActivityTimelineInterface
  extends ModelTimestampExtend,
    Partial<InputContactActivityTimelineInterface> {
  id: Sequelize.CreationOptional<number>;
}

export interface ArgsContactActivityTimelineInterface extends CursorPaginationOrderSearchExtend {
  contactId?: number;
  type?: ContactActivityTypeEnum;
}

export interface ContactActivityTimelineModelInterface
  extends Sequelize.Model<
      ContactActivityTimelineInterface,
      Partial<InputContactActivityTimelineInterface>
    >,
    ContactActivityTimelineInterface {}
