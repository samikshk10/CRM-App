import {
  ArgsTaskTypeInterface,
  InputTaskTypeInterface,
  TaskTypeInterface,
} from "@src/interfaces";
import { TaskTypeRepository } from "@src/repositories";
import slug from "slug";
import { GraphQLError } from "graphql";
import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";
import { SortEnum } from "@src/enums";
import { defaultCursor } from "@src/config";
import { SequelizeQueryGenerator } from "@src/helpers";

export class TaskTypeService {
  private repository: TaskTypeRepository;
  constructor() {
    this.repository = new TaskTypeRepository();
  }

  public async findAll(): Promise<TaskTypeInterface[]> {
    return this.repository.findAll({});
  }

  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
  }: ArgsTaskTypeInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: TaskTypeInterface[];
    cursorOrder: string | undefined;
    sort: SortEnum | undefined;
    order: string | undefined;
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];
    const orderCriteria: Sequelize.OrderItem[] = [];

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

    if (sort === SortEnum.ASC || sort === SortEnum.DESC) {
      orderCriteria.push(["label", sort]);
    }

    if (cursorOrder) {
      orderCriteria.push(["label", cursorOrder]);
    }

    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderCriteria,
      }),
    ]);
    return { count, cursorCount, rows, cursorOrder, sort, order };
  }

  async findByPK(id: number): Promise<TaskTypeInterface> {
    const taskExists = await this.repository.findByPk(id);
    if (!taskExists)
      throw new GraphQLError("Finding TaskType Failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `TaskType with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return this.repository.findByPk(id);
  }
  public async create(
    input: InputTaskTypeInterface
  ): Promise<TaskTypeInterface> {
    const TaskTypeSlug = slug(input.label);
    const TaskTypeSlugExists = await this.repository.findOne({
      where: { slug: TaskTypeSlug },
    });
    if (TaskTypeSlugExists)
      throw new GraphQLError(`TaskType: ${input.label} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `label ${input.label} does not exists.`,
          attribute: "label",
        },
      });
    input.slug = TaskTypeSlug;
    const createTaskType = await this.repository.create(input);
    return createTaskType;
  }

  async updateOne(
    id: number,
    input: InputTaskTypeInterface
  ): Promise<TaskTypeInterface> {
    const TaskTypeExists = await this.repository.findByPk(id);
    if (!TaskTypeExists) throw new Error(`TaskType: ${id} does not exist!`);

    if (input.label) {
      const TaskTypeSlug = slug(input.label);
      const TaskTypeSlugExists = await this.repository.findOne({
        where: { slug: TaskTypeSlug },
      });
      if (TaskTypeSlugExists && TaskTypeSlugExists.id !== id)
        throw new GraphQLError(`TaskType: ${input.label} already exist!`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `label ${input.label} does not exists.`,
            attribute: "label",
          },
        });
      input.slug = TaskTypeSlug;
    }
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0)
      throw new GraphQLError(`TaskType: ${id} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `label ${id} does not exists.`,
          attribute: "label",
        },
      });
    return this.repository.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const TaskTypeExists = await this.repository.findByPk(id);
    if (!TaskTypeExists)
      throw new GraphQLError(`TaskType: ${id} doesn't exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `TaskType ${id} does not exists.`,
          attribute: "typeId",
        },
      });
    const deleteTaskType = await this.repository.deleteOne(id);
    return deleteTaskType === 0 ? false : true;
  }
}
