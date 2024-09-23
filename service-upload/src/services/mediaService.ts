import { WhereOptions } from "sequelize";
import * as Sequelize from "sequelize";
import {
  ArgsMediaInterface,
  InputMediaInterface,
  MediaInterface,
} from "../interfaces";
import { MediaRepository } from "../repositories";

export class MediaService {
  private repository: MediaRepository;

  constructor() {
    this.repository = new MediaRepository();
  }

  public create(input: InputMediaInterface): Promise<MediaInterface> {
    return this.repository.create(input);
  }

  public bulkCreate(input: InputMediaInterface[]): Promise<MediaInterface[]> {
    return this.repository.bulkCreate(input);
  }

  public findAndCountAll({
    offset,
    limit,
    sort,
    order,
  }: ArgsMediaInterface): Promise<{ count: number; rows: MediaInterface[] }> {
    let where: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (order && sort) orderItem = [...orderItem, [order, sort]];

    return this.repository.findAndCountAll({
      where,
      offset,
      limit,
      order: [...orderItem, [order, sort]],
      distinct: true,
    });
  }
}
