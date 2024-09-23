import { InputDealInterface, DealInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class DealRepository extends BaseRepository<
  InputDealInterface,
  DealInterface
> {
  constructor() {
    super(Model.Deal);
  }
}
