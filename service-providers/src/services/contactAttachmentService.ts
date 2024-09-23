import { ContactAttachmentRepository } from "@src/repositories";
import {
  ContactAttachmentInterface,
  InputContactAttachmentInterface,
} from "@src/interfaces";
import { GraphQLError } from "graphql";
import Model from "@src/models";

export class ContactAttachmentService {
  private repository: ContactAttachmentRepository;
  constructor() {
    this.repository = new ContactAttachmentRepository();
  }
  public async create(
    input: InputContactAttachmentInterface
  ): Promise<ContactAttachmentInterface> {
    const attachments = await this.repository.findAll({
      where: { contactId: input.contactId, attachmentId: input.attachmentId},
    });
    if (attachments.length)
      throw new GraphQLError("Upload attachment failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `attachmentId for last upload is provided. Please upload file again and provide it's new id`,
          attribute: "attachmentId",
        },
      });
    return this.repository.create(input);
  }

  public async findAll(contactId: number): Promise<ContactAttachmentInterface[]> {
    const attachments = await this.repository.findAll({
      where: { contactId},
      include: [
        {
          model: Model.Contact,
          as: "contact",
        },
        {
          model: Model.Media,
          as: "attachment",
        },
      ],
    });
    if (!attachments)
      throw new GraphQLError("Fetch attachments failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `No attachments available for contact  ${contactId}`,
          attribute: "contactId",
        },
      });
    return attachments;
  }
}