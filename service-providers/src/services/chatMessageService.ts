import { InputChatMessageInterface, ChatMessageInterface, ArgsChatMessageInterface } from "@src/interfaces";
import { GraphQLError } from "graphql";
import * as Sequelize from "sequelize";
import { defaultCursor } from "@src/config";
import { SequelizeQueryGenerator } from "@src/helpers";
import { SortEnum } from "@src/enums";
import Model from "@src/models";
import { ChatMessageRepository } from "@src/repositories";
import { WhereOptions } from "sequelize";
export class ChatMessageService {
  private repository: ChatMessageRepository;

  constructor() {
    this.repository = new ChatMessageRepository();
  }

  public async create(input: InputChatMessageInterface): Promise<ChatMessageInterface> {
    return this.repository.create(input);
  }

  public async findByPk(id: number): Promise<ChatMessageInterface> {
    const chatMessage = await this.repository.findByPk(id);
    if (!chatMessage)
      throw new GraphQLError("Fetch chat message failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat message doesnot exist`,
          attribute: "contactId",
        },
      });
    return chatMessage;
  }
  public async findAll(): Promise<ChatMessageInterface[]> {
    const chatMessages = await this.repository.findAll({});
    if (!chatMessages)
      throw new GraphQLError("Fetch chat message failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat message doesnot exist`,
          attribute: "contactId",
        },
      });
    return chatMessages;
  }

  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    chatSessionId,
    senderId,
  }: ArgsChatMessageInterface): Promise<{
    count: number;
    rows: ChatMessageInterface[];
    cursorCount: number;
    cursorOrder?: string | undefined;
    sort?: string | undefined;
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
    if (chatSessionId) {
      where = {
        ...where,
        chatSessionId: chatSessionId,
      };
    }
    if (senderId) {
      where = {
        ...where,
        senderId: senderId,
      };
    }
    if (query) {
      where = {
        [Sequelize.Op.or]: SequelizeQueryGenerator.searchRegex({
          query,
          columns: ["content"],
        }),
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
        where,
        limit,
        order: orderItem,
        include: [
          {
            model: Model.ChatSession,
            as: "chatSession",
            where: cursorWhere,
          },
        ],
      }),
    ]);
    return { count, cursorCount, rows };
  }

  public async updateOne(id: number, input: InputChatMessageInterface): Promise<ChatMessageInterface> {
    const chatMessage = await this.repository.findByPk(id);
    if (!chatMessage)
      throw new GraphQLError("Update chat message failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat message doesnot exist`,
          attribute: "contactId",
        },
      });
    const update = await this.repository.updateOne({ id, input });
    if (!update)
      throw new GraphQLError("Update chat message failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Update chat message failed`,
          attribute: "contactId",
        },
      });
    return this.repository.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    const chatMessage = await this.repository.findByPk(id);
    if (!chatMessage)
      throw new GraphQLError("Delete chat message failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Chat message doesnot exist`,
          attribute: "contactId",
        },
      });
    const remove = await this.repository.deleteOne(id);
    return remove === 0 ? false : true;
  }
}
