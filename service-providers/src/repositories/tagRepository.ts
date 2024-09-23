import { TagInterface, InputTagInterface } from '@src/interfaces';
import { BaseRepository } from '.';
import Model from '@src/models';

export class TagRepository extends BaseRepository<
  InputTagInterface,
  TagInterface
> {
  constructor() {
    super(Model.Tag);
  }
}
