import { InputChatSessionsInterface, ChatSessionsInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from "@src/repositories";

export class ChatSessionsRepository extends BaseRepository<InputChatSessionsInterface, ChatSessionsInterface> {
  constructor() {
    super(Model.ChatSession);
  }
}
