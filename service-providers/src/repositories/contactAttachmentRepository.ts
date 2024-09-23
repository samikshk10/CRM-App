import { ContactAttachmentInterface, InputContactAttachmentInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from "./baseRepository";

export class ContactAttachmentRepository extends BaseRepository<
  InputContactAttachmentInterface,
  ContactAttachmentInterface
> {
  constructor() {
    super(Model.ContactAttachment);
  }
}