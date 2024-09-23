import { GraphQLResolveInfo } from "graphql";
import { ArgsContactInterface, ContactFilterInterface, InputContactInterface, ContextInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { CursorPagination, SuccessResponse } from "@src/helpers";
import { ContactService } from "@src/services";
import { createContact, updateContact } from "@src/validators";

export const contactResolvers: any = {
  Mutation: {
    createContact: async (
      parent: ParentNode,
      args: { input: InputContactInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createContact, args.input);
      args.input.ownerId = user.ownerId!;
      args.input.createdById = user.id;
      args.input.updatedById = user.id;
      const data = await new ContactService().create(args.input);
      return SuccessResponse.send({
        message: "Contact created Successfully",
        data: data,
      });
    },

    updateContact: async (
      parent: ParentNode,
      args: { id: number; input: Partial<InputContactInterface> },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(updateContact, args.input);
      args.input.updatedById = user.id;
      const data = await new ContactService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Contact updated Successfully",
        data: data,
      });
    },

    deleteContact: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      await new ContactService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Contact Deleted successfully",
      });
    },

    updateContactStatus: async (
      parent: ParentNode,
      args: { id: number; input: Partial<InputContactInterface> },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.updatedById = user.id;
      const data = await new ContactService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Contact status updated successfully",
        data: data,
      });
    },
  },

  Query: {
    contact: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const contact = await new ContactService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Contact fetched Successfully",
        data: contact,
      });
    },

    contacts: async (
      parent: ParentNode,
      args: ArgsContactInterface,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { source, status } = args;
      const { cursor, limit, order, sort, cursorOrder, cursorSort } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });

      const { rows, cursorCount, count } = await new ContactService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorOrder,
        cursorSort,
        source,
        status,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: "Contact list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },

    contactsBySearch: async (
      parent: ParentNode,
      args: { search: string },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const contacts = await new ContactService().findBySearch(args.search);
      return SuccessResponse.send({
        message: "Contacts Fetched sucessfully",
        data: contacts,
      });
    },

    contactsByFilter: async (
      parent: ParentNode,
      args: { input: ContactFilterInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const contacts = await new ContactService().findAll({
        filter: args.input,
      });
      return SuccessResponse.send({
        message: "Contacts fetched successfully",
        data: contacts,
      });
    },
  },
};
