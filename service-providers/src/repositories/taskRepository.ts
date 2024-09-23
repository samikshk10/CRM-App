import { TaskInterface, InputTaskInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class TaskRepository extends BaseRepository<
InputTaskInterface,
  TaskInterface
> {
  constructor() {
    super(Model.Task);
  }
}
