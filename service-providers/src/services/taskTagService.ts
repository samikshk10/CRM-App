import { GraphQLError } from "graphql";
import {
  InputTaskTagInterface, TaskTagInterface,
} from "../interfaces";
import { TaskTagRepository } from "@src/repositories";

export class TaskTagService {
  private repository: TaskTagRepository;
  constructor() {
    this.repository = new TaskTagRepository();
  }
  public async create(
    input: InputTaskTagInterface
  ): Promise<TaskTagInterface[]> {
    const { taskId, tagId } = input;
const payload = tagId.map((item: any) => {
        return {
          tagId: item,
          taskId: input.taskId
        };
      });
  
    try {
      const taskTags = await this.repository.bulkCreate(payload);

      if (!taskTags || taskTags.length === 0) {
        throw new GraphQLError(`TaskTag with TaskId: ${taskId} and tagIds: ${tagId.join(', ')} does not exist`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            attributes: "TaskTagId",
          },
        });
      }
      return taskTags;
    } catch (error) {
      throw new GraphQLError(`Failed to create TaskTag: ${error}`, {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }
}
