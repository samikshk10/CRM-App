import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputDealInterface extends OwnerExtendInterface {
  name: string;
  contactId: number;
  company: string;
  value: number;
  pipelineId: number;
  milestoneId: number;
  closingDate: Date;
  description: string;
  assigneeId: number;
  reporterId: number;
  decision: {
    won: boolean;
    price?: number;
    description?: string;
  }
  rank: number;

}

export interface UpdatedDealInterface {
  name: string;
  company: string;
  value: number;
  closingDate: Date;
  description: string;
  milestoneId?: number;
  rank: number;

}

export interface DealInterface
  extends ModelTimestampExtend,
    InputDealInterface,
    OwnerExtendInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface DealModelInterface
  extends Sequelize.Model<DealInterface, Partial<InputDealInterface>>,
    DealInterface {}

export interface InputUpdateDealMilestone {
  milestoneId: number;
  pipelineId: number;
  rank: number;
}

export interface InputUpdateDealDecision {
  won: boolean;
  price?: number;
  description?: string;
}
export interface InputDealsByMultipleId {
  pipeline?: number[];
  milestone?: number[];
};