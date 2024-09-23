import {
  DealInterface,
  InputDealInterface,
  InputDealsByMultipleId,
  InputUpdateDealDecision,
  UpdatedDealInterface,
} from "@src/interfaces";
import { GraphQLError } from "graphql";
import { DealRepository, MilestoneRepository } from "@src/repositories";
import { Op, WhereOptions } from "sequelize";
import Model from "@src/models";
import { defaultCursor, defaultSort } from "@src/config";
import slug from "slug";

export class DealService {
  private repository: DealRepository;
  constructor() {
    this.repository = new DealRepository();
  }

  public async create(input: InputDealInterface): Promise<DealInterface> {
    const createDeal = await this.repository.create(input);
    return createDeal;
  }

  public async findByPk(id: number): Promise<DealInterface> {
    const dealExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: Model.Milestone,
          as: "milestone",
          include: [
            {
              model: Model.Pipeline,
              as: "pipeline",
            },
          ],
        },
      ],
    });
    if (!dealExists)
      throw new GraphQLError("Fetch deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return dealExists;
  }

  public async findAll({ where }: { where?: WhereOptions<any> }): Promise<DealInterface[]> {
    const dealExists = await this.repository.findAll({
      where: { decision: null, ...where },
      order: [[defaultCursor, defaultSort]],
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: Model.Milestone,
          as: "milestone",
          include: [
            {
              model: Model.Pipeline,
              as: "pipeline",
            },
          ],
        },
      ],
    });
    if (!dealExists)
      throw new GraphQLError("Fetch deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deals does not exists`,
          attribute: "id",
        },
      });
    return dealExists;
  }

  public async findByPipelineMilestoneId(pipelineId: number, milestoneId: number): Promise<DealInterface[]> {
    const dealExists = await this.repository.findAll({
      where: {
        [Op.and]: [{ pipelineId: pipelineId }, { milestoneId: milestoneId }],
      },
      order: [[defaultCursor, defaultSort]],
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: Model.Milestone,
          as: "milestone",
          include: [
            {
              model: Model.Pipeline,
              as: "pipeline",
            },
          ],
        },
      ],
    });
    if (!dealExists)
      throw new GraphQLError("Fetch deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with ParentId: ${milestoneId} does not exists`,
          attribute: "Milestone ID",
        },
      });
    return dealExists;
  }
  public async findByMultipleId(input: InputDealsByMultipleId) {
    const { milestone, pipeline } = input;
    const where: { [Op.or]: object[] } = {
      [Op.or]: [],
    };

    if (pipeline && milestone) {
      where[Op.or].push({
        [Op.and]: [{ pipelineId: pipeline }, { milestoneId: milestone }],
      });
    } else {
      if (pipeline) where[Op.or].push({ pipelineId: pipeline });
      if (milestone) where[Op.or].push({ milestoneId: milestone });
    }

    const dealExists = await this.repository.findAll({
      where,
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: Model.Milestone,
          as: "milestone",
          include: [
            {
              model: Model.Pipeline,
              as: "pipeline",
            },
          ],
        },
      ],
    });

    if (!dealExists.length)
      throw new GraphQLError("Fetch deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `No deal matches the specified criteria. ${pipeline ? `A deal with Pipeline id: ${pipeline}` : ""}${
            pipeline && milestone ? " or " : ""
          }${milestone ? `A deal with Milestone id: ${milestone}` : ""} does not exist.`,
          attribute: "id",
        },
      });
    return dealExists;
  }

  public async updateOne(id: number, input: Partial<UpdatedDealInterface>): Promise<DealInterface> {
    const dealExists = await this.repository.findByPk(id);
    if (!dealExists)
      throw new GraphQLError("Update deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const updatedDeal = await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async bulkUpdate(ids: number[], input: Partial<UpdatedDealInterface>): Promise<DealInterface[]> {
    const dealsExists = await this.repository.findAll({ where: { id: ids } });
    const existingIds = dealsExists.map((deal) => deal.id);
    if (dealsExists.length !== ids.length) {
      const nonExistingIds = ids.filter((id) => !existingIds.includes(id));
      throw new GraphQLError("Update deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `One or more deals do not exist for ids: ${nonExistingIds.join(", ")}`,
          attribute: "id",
        },
      });
    }
    for (const id of existingIds) {
      await this.repository.updateOne({ id, input });
    }
    return await this.repository.findAll({ where: { id: existingIds } });
  }

  public async delete(ids: number[]): Promise<boolean> {
    const dealsExists = await this.repository.findAll({ where: { id: ids } });
    const existingIds = dealsExists.map((deal) => deal.id);
    if (dealsExists.length !== ids.length) {
      const nonExistingIds = ids.filter((id) => !existingIds.includes(id));
      throw new GraphQLError("Update deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `One or more deals do not exist for ids: ${nonExistingIds.join(", ")}`,
          attribute: "id",
        },
      });
    }
    const remove = await this.repository.deleteMany({ where: { id: ids } });
    return remove === 0 ? false : true;
  }

  public async verifyDealWithinPipeline(id: number[], pipelineId: number): Promise<DealInterface[]> {
    const dealItems = await this.repository.findAll({
      where: {
        id,
      },
    });

    const verifyDeal = dealItems
      .filter((item) => {
        return item.pipelineId !== pipelineId;
      })
      .map((item) => item.id);

    if (verifyDeal.length !== 0)
      throw new GraphQLError("Fetch Deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with id:${verifyDeal.join(" ,")} doesnot exists within pipeline ${pipelineId}`,
          attribute: "Pipeline & Deal id",
        },
      });

    return dealItems;
  }

  public async updateCloseDate(id: number): Promise<DealInterface> {
    const dealExists = await this.repository.findByPk(id);
    const currentDate = new Date();
    if (!dealExists)
      throw new GraphQLError("Fetch deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    await this.repository.updateOne({
      id,
      input: {
        closingDate: currentDate,
      },
    });
    return this.findByPk(id);
  }

  public async findBySearch(search: string): Promise<DealInterface[]> {
    const deals = await this.repository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { company: { [Op.like]: `%${search}%` } },
          { value: { [Op.eq]: parseInt(search) || 0 } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: Model.Milestone,
          as: "milestone",
          include: [
            {
              model: Model.Pipeline,
              as: "pipeline",
            },
          ],
        },
      ],
    });
    return deals;
  }

  public async updateDecision(id: number, input: InputUpdateDealDecision) {
    const dealExists = await this.repository.findByPk(id);
    if (!dealExists)
      throw new GraphQLError("Update deal failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Deal with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    let milestoneSlug = slug(`${dealExists.ownerId}-${dealExists.pipelineId}-${input.won ? "won" : "lost"}`);

    let milestoneExists = await new MilestoneRepository().findOne({
      where: { slug: milestoneSlug },
    });
    if (!milestoneExists) {
      milestoneExists = await new MilestoneRepository().create({
        name: input.won ? "Won" : "Lost",
        pipelineId: dealExists.pipelineId,
        slug: milestoneSlug,
        ownerId: dealExists.ownerId,
      });
    }
    const updatedDeal = await this.repository.updateOne({
      id,
      input: { decision: input, milestoneId: milestoneExists.id },
    });
    return this.findByPk(id);
  }
}
