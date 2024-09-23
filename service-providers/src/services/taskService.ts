import * as Sequelize from "sequelize";
import { GraphQLError } from "graphql";
import { WhereOptions } from "sequelize";
import { SubTaskRepository } from "@src/repositories";
import { defaultCursor } from "@src/config";
import { SortEnum } from "@src/enums";
import { SequelizeQueryGenerator } from "@src/helpers";
import { ArgsTaskInterface, InputTaskInterface, TaskInterface, UpdatedTaskInterface } from "@src/interfaces";
import Model from "@src/models";
import { TaskRepository } from "@src/repositories";

export class TaskService {
  private repository: TaskRepository;
  private subTaskRepository: SubTaskRepository;
  constructor() {
    this.repository = new TaskRepository();
    this.subTaskRepository = new SubTaskRepository();
  }
  public async findAll(): Promise<TaskInterface[]> {
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
  }: ArgsTaskInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: TaskInterface[];
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
        where: { ...cursorWhere, ...where },
        limit,
        order: orderCriteria,
        include: [
          {
            model: Model.Tag,
            as: "tags",
            attributes: ["id", "name", "color"],
          },
          {
            model: Model.SubTask,
            as: "subTasks",
            attributes: ["id", "description"],
          },
        ],
      }),
    ]);

    return { count, cursorCount, rows, cursorOrder, sort, order };
  }
  async findByPK(id: number): Promise<TaskInterface> {
    const taskExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Tag,
          as: "tags",
          attributes: ["id", "name", "color"],
        },
        {
          model: Model.SubTask,
          as: "subTasks",
          attributes: ["id", "description"],
        },
        {
          model: Model.TaskAttachment,
          as: "files",
          include: [
            {
              model: Model.Media,
              as: "attachment",
            },
          ],
        },
        {
          model: Model.TaskType,
          as: "taskType",
          attributes: ["id", "label"],
        },
        {
          model: Model.Pipeline,
          as: "pipeline",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!taskExists)
      throw new GraphQLError("Finding Task Failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Task with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return taskExists;
  }

  public async create(input: InputTaskInterface): Promise<TaskInterface> {
    const parentTask = input.parentId ? await this.repository.findOne({ where: { id: input.parentId } }) : null;
    const level = parentTask ? parentTask.level + 1 : 0;
    const createTask = await this.repository.create({
      ...input,
      level: level,
    });
    const subTasks = input.subTasks!;
    for (const subTask of subTasks) {
      const createdSubtask = await new SubTaskRepository().create({
        description: subTask,
        taskId: createTask.id,
        ownerId: input.ownerId,
      });
      const subtaskList = [
        {
          description: createdSubtask.description,
          taskId: createTask.id,
        },
      ];
    }
    return createTask;
  }

  public async updateOne(id: number, input: UpdatedTaskInterface): Promise<TaskInterface> {
    const taskExists = await this.repository.findByPk(id);
    if (!taskExists)
      throw new GraphQLError("Update Task failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Task with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const updatedDeal = await this.repository.updateOne({ id, input });
    return this.repository.findByPk(id);
  }

  public async toggleStar(id: number): Promise<TaskInterface> {
    const taskExists = await this.repository.findByPk(id);
    if (!taskExists)
      throw new GraphQLError("Toggle Task star failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Task with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    await this.repository.updateOne({
      id,
      input: { starred: !taskExists.starred },
    });
    return this.repository.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    const taskExists = await this.repository.findByPk(id);
    if (!taskExists)
      throw new GraphQLError(`Task: ${id} doesn't exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Task Name ${id} does not exists.`,
          attribute: "taskId",
        },
      });
    const deleteTask = await this.repository.deleteOne(id);
    return deleteTask === 0 ? false : true;
  }
}
