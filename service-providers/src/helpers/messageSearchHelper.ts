import { FacebookSearchMessageInterface, MessageInterface, MessagesResponseInterface } from "@src/interfaces";

class SearchMessage {
    static instance: SearchMessage;
    constructor() { }

    static get(): SearchMessage {
        if (!SearchMessage.instance) {
            SearchMessage.instance = new SearchMessage();
        }
        return SearchMessage.instance;
    }

    async searchMessage(input: FacebookSearchMessageInterface): Promise<MessageInterface[]> {
        const matchingMessage = [];
        for (const messageObj of input.response.data) {
            if (input.searchKeyword !== undefined && messageObj.message.includes(input.searchKeyword)) {
                matchingMessage.push(messageObj);
            }
        }
        return matchingMessage;
    }
}

const searchMessage = SearchMessage.get();
export { searchMessage as SearchMessage };