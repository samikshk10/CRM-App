import { TaskAttachmentInterface, InputTaskAttachmentInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from "./baseRepository";

export class TaskAttachmentRepository extends BaseRepository<
  InputTaskAttachmentInterface,
  TaskAttachmentInterface
> {
  constructor() {
    super(Model.TaskAttachment);
  }
}