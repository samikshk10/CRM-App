import { InputSubTaskInterface, SubTaskInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from '.';

export class SubTaskRepository extends BaseRepository<
  InputSubTaskInterface,
  SubTaskInterface
> {
  constructor() {
    super(Model.SubTask);
  }
}
