import { WhereOptions } from "sequelize";
import { ContactTagInterface, InputContactTagInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class ContactTagRepository extends BaseRepository<
  InputContactTagInterface,
  ContactTagInterface
> {
  constructor() {
    super(Model.ContactTag);
  }
  async destroy(options: WhereOptions): Promise<number> {
    return this.model.destroy(options);
  }
}
