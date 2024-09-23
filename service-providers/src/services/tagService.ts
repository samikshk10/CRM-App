import { TagRepository } from "@src/repositories";
import slug from "slug";
import { GraphQLError } from "graphql";
import * as Sequelize from "sequelize";
import {
  TagInterface,
  InputTagInterface,
  ArgsTaskInterface,
  ArgsTagInterface,
} from "@src/interfaces";
import { SortEnum } from "@src/enums";
import { WhereOptions } from "sequelize";
import { defaultCursor } from "@src/config";
import { SequelizeQueryGenerator } from "@src/helpers";
import Model from "@src/models";

export class TagService {
  private repository: TagRepository;
  constructor() {
    this.repository = new TagRepository();
  }
  public async findAll(): Promise<TagInterface[]> {
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
  }: ArgsTagInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: TagInterface[];
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

  async findByPK(id: number): Promise<TagInterface> {
    const tagExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
      ],
    });
    if (!tagExists)
      throw new GraphQLError("Finding Tag Failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Tag with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    return await this.repository.findByPk(id);
  }

  public async create(input: InputTagInterface): Promise<TagInterface> {
    const tagSulg = slug(input.name);
    const tagSlugExists = await this.repository.findOne({
      where: { slug: tagSulg },
    });
    if (tagSlugExists)
      throw new GraphQLError(`Tag: ${input.name} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Tag Name ${input.name} does not exists.`,
          attribute: "name",
        },
      });
    input.slug = tagSulg;
    const createTag = await this.repository.create(input);
    return createTag;
  }

  public async updateOne(
    id: number,
    input: InputTagInterface
  ): Promise<TagInterface> {
    const tagExists = await this.repository.findByPk(id);
    if (!tagExists) throw new Error(`Tag: ${id} does not exist!`);

    if (input.name) {
      const tagSulg = slug(input.name);
      const tagSlugExists = await this.repository.findOne({
        where: { slug: tagSulg },
      });
      if (tagSlugExists && tagSlugExists.id !== id)
        throw new GraphQLError(`tag: ${input.name} already exist!`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `tag ${input.name} does not exists.`,
            attribute: "name",
          },
        });
      input.slug = tagSulg;
    }
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0)
      throw new GraphQLError(`Tag: ${id} already exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Tag ${id} does not exists.`,
          attribute: "Tag Id",
        },
      });
    return this.repository.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    const tagExists = await this.repository.findByPk(id);
    if (!tagExists)
      throw new GraphQLError(`Tag: ${id} doesn't exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Tag Name ${id} does not exists.`,
          attribute: "tagId",
        },
      });
    const deleteTag = await this.repository.deleteOne(id);
    return deleteTag === 0 ? false : true;
  }
}
