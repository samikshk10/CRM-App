import * as Sequelize from "sequelize";
import { WhereOptions } from "sequelize";
import { GraphQLError } from "graphql";
import { Op } from "sequelize";
import { ArgsContactInterface, ContactFilterInterface, ContactInterface, InputContactInterface } from "@src/interfaces";
import { ContactRepository, TaskRepository } from "@src/repositories";
import { SequelizeQueryGenerator } from "@src/helpers";
import { defaultCursor, defaultSort } from "@src/config";
import { SortEnum, StatusEnum } from "@src/enums";
import Model from "@src/models";

export class ContactService {
  private repository: ContactRepository;
  private taskRepository: TaskRepository;
  constructor() {
    this.repository = new ContactRepository();
    this.taskRepository = new TaskRepository();
  }

  public async create(input: InputContactInterface): Promise<ContactInterface> {
    const contactExist = await this.repository.findOne({
      where: {
        email: input.email,
      },
    });
    if (contactExist)
      throw new GraphQLError("Contact already exist", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Contact already exist`,
          attribute: "email",
        },
      });
    const createContact = await this.repository.create(input);
    return createContact;
  }

  public async findAll({
    where,
    filter,
  }: {
    where?: WhereOptions<any>;
    filter?: ContactFilterInterface;
  }): Promise<ContactInterface[]> {
    if (filter?.tagId) {
      where = {
        ...where,
        "$tags.id$": filter.tagId,
      };
    }

    if (filter?.status) {
      where = {
        ...where,
        status: filter.status,
      };
    }

    const contacts = await this.repository.findAll({
      where,
      order: [[defaultCursor, defaultSort]],
      include: [
        {
          model: Model.Note,
          as: "notes",
          attributes: ["id", "description"],
        },
        {
          model: Model.Task,
          as: "tasks",
        },
        {
          model: Model.Tag,
          as: "tags",
          attributes: ["id", "name", "color"],
        },
      ],
    });
    if (!contacts)
      throw new GraphQLError("Fetch contact failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Contacts doesnot exist`,
          attribute: "id",
        },
      });
    return contacts;
  }

  public async findByPk(id: number): Promise<ContactInterface> {
    const currentDate = new Date();
    const taskWhere = { completedDate: null };
    const contactExist = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Note,
          as: "notes",
          attributes: ["id", "description"],
        },
        {
          model: Model.Tag,
          as: "tags",
          attributes: ["id", "name", "color"],
        },
        {
          model: Model.Task,
          as: "tasks",
          // ...(Object.keys(taskWhere).length > 0 && { where: taskWhere }),
        },
        {
          model: Model.Media,
          as: "profile",
        },
        {
          model: Model.ContactAttachment,
          as: "files",
          include: [
            {
              model: Model.Media,
              as: "attachment",
            },
          ],
        },
      ],
    });

    if (!contactExist)
      throw new GraphQLError("Fetch contact failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Contact with id: ${id} does not exists`,
          attribute: "id",
        },
      });

    return contactExist;
  }

  public async findBySearch(search: string): Promise<ContactInterface[]> {
    const contacts = await this.repository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { company: { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: Model.Note,
          as: "notes",
          attributes: ["id", "description"],
        },
      ],
    });
    if (!contacts)
      throw new GraphQLError("Fetch contact failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Contacts doesnot exist with search: ${search}`,
          attribute: "id",
        },
      });
    return contacts;
  }

  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    source,
    status,
  }: ArgsContactInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ContactInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

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
          columns: ["label"],
        }),
      };
    }

    if (source) {
      where = {
        ...where,
        source,
      };
    }

    if (status) {
      where = {
        ...where,
        status,
      };
    }

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }

    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: [["updated_at", SortEnum.DESC]],
        include: [
          {
            model: Model.Note,
            as: "notes",
            attributes: ["id", "description"],
          },
          {
            model: Model.Tag,
            as: "tags",
            attributes: ["id", "name", "color"],
          },
          {
            model: Model.Task,
            as: "tasks",
          },
          {
            model: Model.Media,
            as: "profile",
          },
          {
            model: Model.ContactAttachment,
            as: "files",
            include: [
              {
                model: Model.Media,
                as: "attachment",
              },
            ],
          },
        ],
      }),
    ]);
    return { count, cursorCount, rows };
  }

  public async updateOne(id: number, input: Partial<InputContactInterface>): Promise<ContactInterface> {
    const contactExist = await this.repository.findByPk(id);
    if (!contactExist) {
      throw new GraphQLError(`Contact doesnot exist`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `: Id ${id} does not exists.`,
          attribute: ["id"],
        },
      });
    }
    if (input?.email) {
      const emailExist = await this.repository.findOne({
        where: { email: input.email },
      });
      if (emailExist && emailExist.id !== id) {
        throw new GraphQLError(`Email already exist`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `: Email ${input.email} already exist.`,
            attribute: ["email"],
          },
        });
      }
    }
    await this.repository.updateOne({
      id,
      input,
    });

    return this.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const contactExists = await this.repository.findByPk(id);
    if (!contactExists)
      throw new GraphQLError("Fetch contact failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Contact with id: ${id} does not exists`,
          attribute: "id",
        },
      });
    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
