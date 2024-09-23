import slug from "slug";
import * as Sequelize from "sequelize";
import { WhereOptions } from "sequelize";
import { GraphQLError } from "graphql";

import {
  PipelineInterface,
  InputPipelineInterface,
  ArgsPipelineInterface,
  InputPipelineMilestoneInterface,
} from "@src/interfaces";
import { PipelineRepository, MilestoneRepository } from "@src/repositories";
import { SequelizeQueryGenerator } from "@src/helpers";
import { defaultCursor, defaultSort } from "@src/config";
import { SortEnum } from "@src/enums";
import Model from "@src/models";

export class PipelineService {
  private repository: PipelineRepository;
  constructor() {
    this.repository = new PipelineRepository();
  }

  public async create(input: InputPipelineInterface): Promise<PipelineInterface> {
    const pipelineSlug = slug(input.name);
    const pipelineSlugExists = await this.repository.findOne({
      where: { slug: pipelineSlug },
    });
    if (pipelineSlugExists)
      throw new GraphQLError(`Pipleline: ${input.name} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Pipleline ${input.name} already exist!`,
          attribute: "name",
        },
      });
    input.slug = pipelineSlug;
    const parentPipeline = input.parentId ? await this.repository.findOne({ where: { id: input.parentId } }) : null;
    const level = parentPipeline ? parentPipeline.level + 1 : 0;
    const createPipeline = await this.repository.create({
      ...input,
      level: level,
    });  
    return createPipeline;
  }
  public async createPipelineMilestones(input: InputPipelineMilestoneInterface): Promise<PipelineInterface> {
    const pipelineSlug = slug(input.name);
    const pipelineSlugExists = await this.repository.findOne({
      where: { slug: pipelineSlug },
    });
    if (pipelineSlugExists)
      throw new GraphQLError(`Pipleline: ${input.name} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Pipleline ${input.name} already exist!`,
          attribute: "name",
        },
      });
    input.slug = pipelineSlug;
    const parentPipeline = input.parentId ? await this.repository.findOne({ where: { id: input.parentId } }) : null;
    const level = parentPipeline ? parentPipeline.level + 1 : 0;
    const createPipeline = await this.repository.create({
      name: input.name,
      slug: input.slug,
      parentId: input.parentId,
      level: level,
      ownerId: input.ownerId,
    });
    const milestones = input.milestones;
    for (const milestone of milestones) {
      const milestoneSlug = slug(`${input.ownerId}-${createPipeline.id}-${milestone}`);
      const index = milestones.indexOf(milestone);
      const milestoneSlugExists = await new MilestoneRepository().findOne({
        where: { slug: milestoneSlug },
      });
      if (milestoneSlugExists)
        throw new GraphQLError(`Milestone: ${milestone} already exist!`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Milestone ${milestone} already exist within pipeline ${createPipeline.id}`,
            attribute: "name",
          },
        });
      const createMilestone = await new MilestoneRepository().create({
        name: milestone,
        pipelineId: createPipeline.id,
        slug: milestoneSlug,
        ownerId: createPipeline.ownerId,
        rank: index + 1,
      });
    }

    return await this.findByPk(createPipeline.id);
  }

  public async findByPk(id: number): Promise<PipelineInterface> {
      const pipelineExists = await this.repository.findByPk(id, {
        include: [
          {
            model: Model.Milestone,
            as: "milestone",
            attributes: ["id", "name", "rank"],
            include: [
              {
                model: Model.Deal,
                as: "deals",
                attributes: ["id", "name", "company", "value", "description", "closingDate", "createdAt"],
                include: [
                  {
                    model: Model.Contact,
                    as: "contact",
                    attributes: ["id", "name"],
                    include: [
                      {
                        model: Model.Media,
                        as: "profile",
                        attributes: ['id', 'mimetype', 'url']
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          [{ model: Model.Milestone, as: 'milestone' }, 'rank', 'ASC'],
        ],
      });
      if (!pipelineExists)
      throw new GraphQLError("Fetch pipeline failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Pipeline with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return pipelineExists;
  }

  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
  }: ArgsPipelineInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: PipelineInterface[];
    cursorOrder?: string | undefined;
    sort?: SortEnum | undefined;
    order?: string | undefined;
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (cursor) {
      if (cursorSort === SortEnum.DESC) {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.lt]: cursor },
        };
      } else {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.gt]: cursor },
        };
      }
    }

    if (query) {
      where = {
        [Sequelize.Op.or]: SequelizeQueryGenerator.searchRegex({
          query,
          columns: ["label"],
        }),
      };
    }

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }

    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where,
        limit,
        order: orderItem,
        include: [
          {
            model: Model.Milestone,
            as: "milestone",
            attributes: ["id", "name", "rank"],
            order: [["id", SortEnum.ASC]],
            include: [
              {
                model: Model.Deal,
                as: "deals",
                attributes: ["id", "name", "company", "value", "description", "closingDate", "createdAt"],
                include: [
                  {
                    model: Model.Contact,
                    as: "contact",
                    attributes: ["id", "name"],
                    include: [
                      {
                        model: Model.Media,
                        as: "profile",
                        attributes: ['id', 'mimetype', 'url']
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    ]);
    return { count, cursorCount, rows };
  }

  public async updateOne(id: number, input: Partial<PipelineInterface>): Promise<PipelineInterface> {
    const pipelineExists = await this.repository.findByPk(id);
    if (!pipelineExists) throw new GraphQLError("Fetch pipeline failed");
    if (input.name) {
      const pipelineSlug = slug(input.name);
      const pipelineSlugExists = await this.repository.findOne({
        where: { slug: pipelineSlug },
      });
      if (pipelineSlugExists)
        throw new GraphQLError(`Failed to update pipeline`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Pipleline ${input.name} already exist!`,
            attribute: "name",
          },
        });
      input.slug = pipelineSlug;
    }
    const parentPipeline = input.parentId ? await this.repository.findOne({ where: { id: input.parentId } }) : null;
    const level = parentPipeline ? parentPipeline.level + 1 : 0;
    input.level = level;
    await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const pipelineExists = await this.repository.findByPk(id);
    if (!pipelineExists)
      throw new GraphQLError("Fetch pipeline failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Pipeline with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
