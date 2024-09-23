import { InputUserInterface, UserInterface } from '../interfaces';
import Model from '../models/index';
import { BaseRepository } from './baseRepository';

export class UserRepository extends BaseRepository<
  InputUserInterface,
  UserInterface
> {
  constructor() {
    super(Model.User);
  }
}
