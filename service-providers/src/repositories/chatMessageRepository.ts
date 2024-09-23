import { InputChatMessageInterface, ChatMessageInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from "@src/repositories";

export class ChatMessageRepository extends BaseRepository<InputChatMessageInterface, ChatMessageInterface> {
    constructor() {
        super(Model.ChatMessage);
    }
}