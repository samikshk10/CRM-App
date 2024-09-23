import { InputMilestoneInterface, MilestoneInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from '.';

export class MilestoneRepository extends BaseRepository<
  InputMilestoneInterface,
  MilestoneInterface
> {
  constructor() {
    super(Model.Milestone);
  }
}
