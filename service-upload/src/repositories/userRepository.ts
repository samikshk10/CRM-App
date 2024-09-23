import Model from "../models";
import { BaseRepository } from ".";
import { InputUserInterface, UserInterface } from "../interfaces";

export class UserRepository extends BaseRepository<
  InputUserInterface,
  UserInterface
> {
  constructor() {
    super(Model.User);
  }
}
