import { ContactInterface, InputContactInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class ContactRepository extends BaseRepository<
  InputContactInterface,
  ContactInterface
> {
  constructor() {
    super(Model.Contact);
  }
}
