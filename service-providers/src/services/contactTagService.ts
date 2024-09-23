import { GraphQLError } from "graphql";
import { ContactTagRepository } from "@src/repositories";
import {
  InputContactTagInterface,
} from "../interfaces";

export class ContactTagService {
  private repository: ContactTagRepository;
  constructor() {
    this.repository = new ContactTagRepository();
  }
  public async create(
    input: InputContactTagInterface
  ): Promise<InputContactTagInterface> {
    return this.repository.create(input);
  }

  public async findOne(
    contactId: number,
    tagId: number
  ): Promise<InputContactTagInterface> {
    const contactTagExists = await this.repository.findOne({
      where: { contact_id: contactId, tag_id: tagId },
    });

    if (!contactTagExists) {
      throw new GraphQLError("Fetch contactTag failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `ContactTag with contactId: ${contactId} and tagId: ${tagId} does not exist`,
          attributes: "contactTagId",
        },
      });
    }
    return contactTagExists;
  }

  
  public async delete(contactId: number, tagId: number): Promise<boolean> {
    const contactTagExists = await this.repository.findOne({
      where: { contactId, tagId },
    });

    if (!contactTagExists) {
      throw new GraphQLError("Fetch contactTag failed", {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `ContactTag with contactId: ${contactId} and tagId: ${tagId} does not exist`,
          attributes: "contactTagId",
        },
      });
    }
    const remove = await this.repository.destroy({
      where: { contact_id: contactId, tag_id: tagId },
    });
    return remove === 0 ? false : true;
  }
}