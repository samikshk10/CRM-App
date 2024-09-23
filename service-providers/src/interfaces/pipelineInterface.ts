import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputPipelineInterface extends OwnerExtendInterface {
  name: string;
  slug: string;
  parentId: number | null;
  level: number;
}

export interface PipelineInterface
  extends ModelTimestampExtend,
    InputPipelineInterface {
  id: Sequelize.CreationOptional<number>;
}
export interface InputPipelineMilestoneInterface extends OwnerExtendInterface {
  name: string;
  slug: string;
  parentId: number | null;
  level: number;
  milestones: string[];
}


export interface PipelineModelInterface
  extends Sequelize.Model<PipelineInterface, Partial<InputPipelineInterface>>,
    PipelineInterface {}

export interface ArgsPipelineInterface extends CursorPaginationOrderSearchExtend{}