import { GraphQLError } from "graphql";
import * as Sequelize from "sequelize";
import { WhereOptions } from "sequelize";
import { ChatSessionsRepository } from "@src/repositories";
import { defaultCursor } from "@src/config";
import { SequelizeQueryGenerator } from "@src/helpers";
import { ChatsessionStatusEnum, SortEnum } from "@src/enums";
import { InputChatSessionsInterface, ChatSessionsInterface, ArgsChatSessionsInterface } from "@src/interfaces";
import Model from "@src/models";

export class ChatSessionService {
  private repository: ChatSessionsRepository;
  constructor() {
    this.repository = new ChatSessionsRepository();
  }

  public async create(input: InputChatSessionsInterface): Promise<ChatSessionsInterface> {
    const chatSessionExist = await this.repository.findOne({
      where: {
        contactId: input.contactId,
        status: ChatsessionStatusEnum.OPEN,
      },
    });
    if (chatSessionExist)
      throw new GraphQLError("Chat session already exist", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat session already exist`,
          attribute: "contactId",
        },
      });

    return this.repository.create(input);
  }

  public async findAll(): Promise<ChatSessionsInterface[]> {
    const chatSessions = await this.repository.findAll({});
    if (!chatSessions)
      throw new GraphQLError("Fetch chat session failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat session doesnot exist`,
          attribute: "contactId",
        },
      });
    return chatSessions;
  }

  public async findByPk(id: number): Promise<ChatSessionsInterface> {
    const chatSessionExists = await this.repository.findByPk(id);
    if (!chatSessionExists)
      throw new GraphQLError("Fetch chat session failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat session with id: ${id} does not exists`,
          attributes: "chatSessionId",
        },
      });

    return chatSessionExists;
  }
  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    status,
  }: ArgsChatSessionsInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ChatSessionsInterface[];
    cursorOrder?: string | undefined;
    sort?: SortEnum | undefined;
    order?: string | undefined;
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
          columns: ["sourceOfLead"],
        }),
      };
    }

    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    if (status) {
      where = {
        ...where,
        status,
      };
    }
    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where,
        limit,
        order: orderItem,
        include: [
          {
            model: Model.Contact,
            as: "contact",
          },
        ],
      }),
    ]);
    return { count, cursorCount, rows };
  }
  public async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputChatSessionsInterface>,
  ): Promise<ChatSessionsInterface> {
    const chatSessionExists = await this.repository.findByPk(id);
    if (!chatSessionExists)
      throw new GraphQLError("Update chat session failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat session with id: ${id} does not exists`,
          attributes: "chatSessionId",
        },
      });

    await this.repository.updateOne({
      id,
      input,
    });

    return this.repository.findByPk(id);
  }

  public async deleteOne(id: number): Promise<boolean> {
    const chatSessionExists = await this.repository.findByPk(id);
    if (!chatSessionExists)
      throw new GraphQLError("Delete chat session failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat session with id: ${id} does not exists`,
          attributes: "chatSessionId",
        },
      });

    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
