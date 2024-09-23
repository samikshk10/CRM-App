import { GraphQLError } from "graphql";
import * as Sequelize from "sequelize";
import { ContactNoteRepository } from "@src/repositories";
import {
  ArgsContactNoteInterface,
  ContactNoteInterface,
  InputContactNoteInterface,
} from '@src/interfaces';
import { SortEnum } from '@src/enums';
import { WhereOptions } from "sequelize";
import { defaultCursor, defaultSort } from '@src/config';
import { SequelizeQueryGenerator } from '@src/helpers';

export class ContactNoteService {
  private repository: ContactNoteRepository;
  constructor() {
    this.repository = new ContactNoteRepository();
  }

  public async findAll(): Promise<ContactNoteInterface[]> {
    return this.repository.findAll({});
  }
  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
  }: ArgsContactNoteInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ContactNoteInterface[];
    cursorOrder: string | undefined;
    sort: SortEnum | undefined;
    order: string | undefined;
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];
    const orderCriteria: Sequelize.OrderItem[] = [];

    if (cursor) {
      if (cursorSort === SortEnum.DESC) {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.lt]: cursor },
        };
      } else {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.gt]: cursor },
        };
      }
    }

    if (query) {
      where = {
        [Sequelize.Op.or]: SequelizeQueryGenerator.searchRegex({
          query,
          columns: ["title"],
        }),
      };
    }

    if (sort === SortEnum.ASC || sort === SortEnum.DESC) {
      orderCriteria.push(["title", sort]);
    }

    if (cursorOrder) {
      orderCriteria.push(["title", cursorOrder]);
    }

    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderCriteria,
      }),
    ]);
    return { count, cursorCount, rows, cursorOrder, sort, order };
  }
  
  async findByPK(id: number): Promise<ContactNoteInterface> {
    return await this.repository.findByPk(id);
  }

  public async create(
    input: InputContactNoteInterface
  ): Promise<ContactNoteInterface> {
    return this.repository.create(input);
  }

  public async findByPk(id: number): Promise<ContactNoteInterface> {
    const contactNoteExists = await this.repository.findByPk(id);
    if (!contactNoteExists)
      throw new GraphQLError("Fetch note failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Note with id: ${id} does not exists`,
          attributes: "noteId",
        },
      });

    return contactNoteExists;
  }

  public async findByContact(
    contactId: number
  ): Promise<ContactNoteInterface[]> {
    const contactNoteExists = await this.repository.findAll({
      where: {
        contactId: contactId,
      },
      order: [['updated_at',defaultSort]]
    });
    if (!contactNoteExists)
      throw new GraphQLError("Fetch note failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Note with id: ${contactId} does not exists`,
          attributes: "noteId",
        },
      });
    return contactNoteExists;
  }
  public async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputContactNoteInterface>
  ): Promise<ContactNoteInterface> {
    const contactNoteExists = await this.repository.findByPk(id);

    if (!contactNoteExists)
      throw new GraphQLError("Update note failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Note with id: ${id} does not exists`,
          attributes: "noteId",
        },
      });

    const updatedNote = await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const contactNoteExists = await this.repository.findByPk(id);
    if (!contactNoteExists)
      throw new GraphQLError("Fetch note failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Note with id: ${id} does not exists`,
          attributes: "noteId",
        },
      });

    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
