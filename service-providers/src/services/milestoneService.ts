import slug from "slug";
import {
  MilestoneInterface,
  InputMilestoneInterface,
  UpdatedMilestoneInterface,
  InputMilestoneByMultipleId,
} from "@src/interfaces";
import { GraphQLError } from "graphql";
import { MilestoneRepository } from "@src/repositories";
import Model from "@src/models";
import { defaultCursor } from "@src/config";
import { SortEnum } from "@src/enums";
import { WhereOptions } from "sequelize";

export class MilestoneService {
  private repository: MilestoneRepository;
  constructor() {
    this.repository = new MilestoneRepository();
  }

  public async create(
    input: InputMilestoneInterface
  ): Promise<MilestoneInterface> {
    const milestoneSlug = slug(`${input.ownerId}-${input.pipelineId}-${input.name}`);
    const milestoneSlugExists = await this.repository.findOne({
      where: { slug: milestoneSlug },
    });
    if (milestoneSlugExists)
      throw new GraphQLError(`Milestone: ${input.name} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone ${input.name} already exist within pipeline ${input.pipelineId}`,
          attribute: "name",
        },
      });
    input.slug = milestoneSlug;
    const createMilestone = await this.repository.create(input);
    return createMilestone;
  }

  public async findAll(where?: WhereOptions<any>): Promise<MilestoneInterface[]> {
    return this.repository.findAll({ where });
  }

  public async findByPipelineId(
    input: InputMilestoneByMultipleId
  ): Promise<MilestoneInterface[]> {
    const milestoneExists = await this.repository.findAll({
      where: { pipelineId: input.pipeline },
      order: [[defaultCursor, SortEnum.ASC]],
      include: [
        {
          model: Model.Deal,
          as: "deals",
          include: [
            {
              model: Model.Contact,
              as: 'contact'
            }
          ]
        },
        {
          model: Model.Pipeline,
          as: 'pipeline'
        }
      ],
    });
    if (milestoneExists.length === 0)
      throw new GraphQLError("Fetch milestone failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone with ParentId: ${input.pipeline} does not exists`,
          attribute: "Pipeline ID",
        },
      });
    return milestoneExists;
  }


  public async verifyMilestoneWithinPipeline(
    id: number,
    pipelineId: number,
  ): Promise<MilestoneInterface> {
    const milestoneExists = await this.repository.findOne({
      where: {
        id,
        pipelineId,
      },
    });

    if (!milestoneExists)
      throw new GraphQLError("Fetch milestone failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone with id:${id} doesnot exists within pipeline ${pipelineId}`,
          attribute: "Pipeline & Milestone id",
        },
      });
    return milestoneExists;
  }




  public async findByPk(id: number): Promise<MilestoneInterface> {
    const milestoneExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Deal,
          as: "deals",
          include: [
            {
              model: Model.Contact,
              as: 'contact'
            }
          ]
        },
        {
          model: Model.Pipeline,
          as: 'pipeline'
        }
      ],
    });
    if (!milestoneExists)
      throw new GraphQLError("Fetch milestone failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return milestoneExists;
  }

  public async updateOne(
    id: number,
    input: Partial<UpdatedMilestoneInterface>
  ): Promise<MilestoneInterface> {
    const milestoneExists = await this.repository.findByPk(id);
    if (input.name) {
      const milestoneSlug = slug(`${milestoneExists.ownerId}-${milestoneExists.pipelineId}-${input.name}`);
      const milestoneSlugExists = await this.repository.findOne({
        where: { slug: milestoneSlug },
      });
      if (milestoneSlugExists)
        throw new GraphQLError(`Failed to update milestone`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Milestone ${input.name} already exist within pipeline ${milestoneExists.pipelineId}`,
            attribute: "name",
          },
        });
      input.slug = milestoneSlug;
    }
    if (!milestoneExists)
      throw new GraphQLError("Update milestone failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const milestoneExists = await this.repository.findByPk(id);
    if (!milestoneExists)
      throw new GraphQLError("Fetch milestone failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Milestone with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
