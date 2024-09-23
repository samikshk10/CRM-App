import { TaskTypeInterface, InputTaskTypeInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class TaskTypeRepository extends BaseRepository<
InputTaskTypeInterface,
  TaskTypeInterface
> {
  constructor() {
    super(Model.TaskType);
  }
}
