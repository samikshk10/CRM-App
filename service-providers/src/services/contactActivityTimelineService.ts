import { defaultCursor } from "@src/config";
import { SortEnum } from "@src/enums";
import {
  ArgsContactActivityTimelineInterface,
  ContactActivityTimelineInterface,
  InputContactActivityTimelineInterface,
} from "@src/interfaces";
import Model from "@src/models";
import { ContactActivityTimelineRepository } from "@src/repositories";
import { GraphQLError } from "graphql";
import { WhereOptions } from "sequelize";
import * as Sequelize from 'sequelize';
export class ContactActivityTimelineService {
  private repository: ContactActivityTimelineRepository;
  constructor() {
    this.repository = new ContactActivityTimelineRepository();
  }

  public async create(
    input: InputContactActivityTimelineInterface
  ): Promise<ContactActivityTimelineInterface> {
    return await this.repository.create(input);
  }


  public async findByPk(id: number): Promise<ContactActivityTimelineInterface> {
    const activityExists = await this.repository.findByPk(id);
    if (!activityExists)
      throw new GraphQLError("Fetch Activity failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Activity with id: ${id} does not exists`,
          attributes: "activityId",
        },
      });

    return activityExists;
  }

  public async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    contactId,
    type,
  }: ArgsContactActivityTimelineInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ContactActivityTimelineInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

      if (cursor) {
        const cursorMap: Map<string, unknown> | undefined = new Map(
          Object.entries(JSON.parse(cursor!))
        );
  
        if (cursorSort === SortEnum.DESC) {
          if (order && cursorMap.has(order!)) {
            cursorWhere = {
              ...cursorWhere,
              [Sequelize.Op.or]: [
                {
                  [defaultCursor]: {
                    [Sequelize.Op.lt]: cursorMap.get(cursorOrder!),
                  },
                  [order!]: cursorMap.get(order!),
                },
                {
                  [order!]: { [Sequelize.Op.lt]: cursorMap.get(order!) },
                },
              ],
            };
          } else {
            cursorWhere = {
              ...cursorWhere,
              [defaultCursor]: { [Sequelize.Op.lt]: cursorMap.get(cursorOrder!) },
            };
          }
        } else {
          if (order && cursorMap.has(order!)) {
            cursorWhere = {
              ...cursorWhere,
              [Sequelize.Op.or]: [
                {
                  [defaultCursor]: {
                    [Sequelize.Op.gt]: cursorMap.get(cursorOrder!),
                  },
                  [order!]: cursorMap.get(order!),
                },
                {
                  [order!]: { [Sequelize.Op.gt]: cursorMap.get(order!) },
                },
              ],
            };
          } else {
            cursorWhere = {
              ...cursorWhere,
              [defaultCursor]: { [Sequelize.Op.gt]: cursorMap.get(cursorOrder!) },
            };
          }
        }
      }

    if (contactId) {
      where = {
        ...where,
        contactId,
      };
    }

    if (type) {
      where = {
        ...where,
        type,
      };
    }

    if(order && sort) {
      orderItem = [...orderItem, [order,sort]]
    }

    if(cursorOrder && cursorSort){
     orderItem = [...orderItem,[cursorOrder,cursorSort]] 
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
            model: Model.Contact,
            as: 'contact',
          },
          {
            model: Model.User,
            as: 'activityBy'
          },
          {
            model: Model.Note,
            as: "note",
            attributes: ["id", "description"],
          },
          {
            model: Model.Task,
            as: 'task',
          },
          {
            model: Model.ChatSession,
            as: "chatSession",
            include: [
              {
                model: Model.User,
                as: 'assignee'
              }
            ]
          },
        ],
      }),
    ]);
    return { count, cursorCount, rows };
  }
}
