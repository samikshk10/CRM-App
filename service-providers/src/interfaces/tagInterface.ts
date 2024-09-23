import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputTagInterface {
  name: string;
  slug: string;
  color: string;
}

export interface TagInterface
  extends ModelTimestampExtend,
    InputTagInterface,
    OwnerExtendInterface {
  id: Sequelize.CreationOptional<number>;
  ownerId:number;
}

export interface TagModelInterface
  extends Sequelize.Model<TagInterface, InputTagInterface>,
    TagInterface {}
export interface ArgsTagInterface extends CursorPaginationOrderSearchExtend{}