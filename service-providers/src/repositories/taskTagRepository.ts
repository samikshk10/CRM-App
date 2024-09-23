import { WhereOptions } from "sequelize";
import { TaskTagInterface, InputTaskTagInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class TaskTagRepository extends BaseRepository<
  InputTaskTagInterface,
  TaskTagInterface
> {
  constructor() {
    super(Model.TaskTag);
  }
  
}
