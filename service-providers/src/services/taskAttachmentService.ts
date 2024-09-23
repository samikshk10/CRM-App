import { TaskAttachmentRepository } from "@src/repositories";
import {
  TaskAttachmentInterface,
  InputTaskAttachmentInterface,
} from "@src/interfaces";
import { GraphQLError } from "graphql";
import Model from "@src/models";

export class TaskAttachmentService {
  private repository: TaskAttachmentRepository;
  constructor() {
    this.repository = new TaskAttachmentRepository();
  }
  public async create(
    input: InputTaskAttachmentInterface
  ): Promise<TaskAttachmentInterface> {
    const attachments = await this.repository.findAll({
      where: { taskId: input.taskId, attachmentId: input.attachmentId},
    });
    if (attachments.length)
      throw new GraphQLError("Upload attachment failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `attachmentId for last upload is provided. Please upload file again and provide it's new id`,
          attribute: "attachmentId",
        },
      });
    return this.repository.create(input);
  }

  public async findAll(taskId: number): Promise<TaskAttachmentInterface[]> {
    const attachments = await this.repository.findAll({
      where: { taskId},
      include: [
        {
          model: Model.Media,
          as: "attachment",
        },
      ],
    });
    if (!attachments)
      throw new GraphQLError("Fetch attachments failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `No attachments available for task  ${taskId}`,
          attribute: "taskId",
        },
      });
    return attachments;
  }
}