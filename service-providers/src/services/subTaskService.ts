import slug from "slug";
import { SubTaskInterface, InputSubTaskInterface } from "@src/interfaces";
import { GraphQLError } from "graphql";
import { SubTaskRepository } from "@src/repositories";

export class SubTaskService {
  private repository: SubTaskRepository;
  constructor() {
    this.repository = new SubTaskRepository();
  }
  public async findByPK(id: number): Promise<SubTaskInterface> {
    const SubTaskExists = await this.repository.findByPk(id);
    if (!SubTaskExists)
      throw new GraphQLError("Finding SubTask Failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `SubTask with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return SubTaskExists;
  }

  public async findAll(): Promise<SubTaskInterface[]> {
    const SubTasksExists = await this.repository.findAll({
      where: { deletedAt: null },
    });
    if (!SubTasksExists)
      throw new GraphQLError("Fetch SubTask failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `SubTasks doesnot exist`,
          attribute: "id",
        },
      });
    return SubTasksExists;
  }

  public async create(input: InputSubTaskInterface): Promise<SubTaskInterface> {
    const createSubTask = await this.repository.create(input);
    return createSubTask;
  }

  public async updateOne(
    id: number,
    input: InputSubTaskInterface
  ): Promise<SubTaskInterface> {
    const SubTaskExists = await this.repository.findByPk(id);
    if (!SubTaskExists)
      throw new GraphQLError("Update SubTask failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `SubTask with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const updateSubTask = await this.repository.updateOne({ id, input });
    return this.repository.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const SubTaskExists = await this.repository.findByPk(id);
    if (!SubTaskExists)
      throw new GraphQLError("Fetch SubTask failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `SubTask with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
