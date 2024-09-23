import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";
import { SourceEnum, StatusEnum } from "@src/enums";

export interface InputContactInterface extends OwnerExtendInterface {
  name?: string;
  email: string;
  address?: string;
  contactNumber?: string;
  companyDomain?: string;
  company?: string;
  status?: StatusEnum;
  source?: SourceEnum;
  createdById?: number;
  updatedById?: number;
  profilePictureId?: number;
}


export interface ContactInterface extends ModelTimestampExtend, Partial<InputContactInterface> {
  id: Sequelize.CreationOptional<number>;
  status?: StatusEnum;
  source: SourceEnum;
}

export interface ContactFilterInterface {
  tagId?: number | number[];
  status?: StatusEnum | StatusEnum[];
}

export interface ContactModelInterface
  extends Sequelize.Model<ContactInterface, Partial<InputContactInterface>>,
    ContactInterface {}

export interface ArgsContactInterface extends CursorPaginationOrderSearchExtend {
  source?: Enumerator;
  status?: Enumerator;
}
