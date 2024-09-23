import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputMilestoneInterface extends OwnerExtendInterface {
  pipelineId: number;
  name: string;
  slug: string;
  rank: number;
}
export interface UpdatedMilestoneInterface {
  name: string;
  slug: string;
  rank: number;
}

export interface MilestoneInterface
  extends ModelTimestampExtend,
    InputMilestoneInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface InputMilestoneByMultipleId {
  pipeline?: number[];
};

export interface MilestoneModelInterface
  extends Sequelize.Model<MilestoneInterface, Partial<InputMilestoneInterface>>,
    MilestoneInterface {}
