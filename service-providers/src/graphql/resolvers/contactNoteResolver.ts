import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, InputContactNoteInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { createContactNote, deleteContactNote, updateContactNote } from "@src/validators";
import { ContactNoteService } from "@src/services";
import { SuccessResponse } from "@src/helpers";

export const contactNoteResolvers = {
  Mutation: {
    createContactNote: async (
      parent: ParentNode,
      args: { input: InputContactNoteInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createContactNote, args.input);
      args.input.ownerId = user.ownerId!;
      args.input.createdById = user.id;
      args.input.updatedById = user.id;
      const createdContactNote = await new ContactNoteService().create(args.input);
      return SuccessResponse.send({
        message: "Note created successfully",
        data: createdContactNote,
      });
    },
    updateContactNote: async (
      parent: ParentNode,
      args: { id: number; input: InputContactNoteInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(updateContactNote, args.input);
      args.input.updatedById = user.id;
      const note = await new ContactNoteService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Note updated successfully",
        data: note,
      });
    },
    deleteContactNote: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(deleteContactNote, args);

      await new ContactNoteService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Note deleted successfully",
      });
    },
  },

  Query: {
    contactNote: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const note = await new ContactNoteService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Note fetched successfully",
        data: note,
      });
    },
    contactNotes: async (
      parent: ParentNode,
      args: { contactId: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const notes = await new ContactNoteService().findByContact(args.contactId);
      return SuccessResponse.send({
        message: "Notes fetched successfully",
        data: notes,
      });
    },
  },
};
