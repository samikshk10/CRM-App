export interface AccessTokenInterface {
  appId: string;
  appSecret: string;
  accessToken?: string;
}
export interface FacebookMessageInterface {
  pageId?: string;
  pageAccessToken?: string;
  conversationId?: string;
}

export interface PageDetailInterface {
  userId?: string;
  accessToken?: string;
}
export interface FacebookUserDetailInterface {
  psId: string;
  accessToken: string;
}
export interface FacebookConversationIdInterface {
  pageId: string;
  senderId: string;
  pageAccessToken: string;
}

export interface SenderDetailsInterface {
  psId: string;
  accessToken: string;
}

export interface FacebookSenderResultInterface {
  first_name: string;
  last_name: string;
  profile_pic: string;
  gender: string;
}

export interface FacebookLongLivedTokenInterface {
  appId: string;
  appSecret: string;
  accessToken: string;
}

export interface FacebookPagesInterface {
  userId: string;
  accessToken: string;
}

export interface FacebookAppAccessInterface {
  appId: string;
  appSecret: string;
}

export interface FacebookWebhookPageSubscriptionInterface {
  pageId: string;
  pageAccessToken: string;
}

export interface WebhookSubscriptionInterface {
  pageId?: string;
  pageAccessToken?: string;
  appId?: string;
  verifyToken?: string;
  accessToken?: string;
}

export interface FacebookSendMessageInterface {
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
}

export interface FacebookSendMessageResponseInterface {
  message_id: string;
  recipient_id: string;
}
export interface FacebookGetMessageInterface {
  senderId: string;
  after?: string;
  before?: string;
}
export interface GetMessageInputInterface {
  contactId: number;
  after?: string;
  before?: string;
  searchKeyword?: string;
}
export interface MessagesResponseInterface {
  data: MessageInterface[];
  paging?: {
    cursors: {
      before?: string;
      after?: string;
    };
    next?: string;
    previous?: string;
  };
}
export interface UserData {
  name: string;
  id: string;
  email: string;
}
export interface ToUserDataInterface {
  data: UserData;
}

export interface MessageInterface {
  id: string;
  message: string;
  to: ToUserDataInterface;
  from: UserData;
}

export interface FacebookSearchMessageInterface {
  response: MessagesResponseInterface;
  searchKeyword?: string;
}


export interface WhatsappWebhookPageSubscriptionInterface {
  pageId: string
  pageAccessToken: string
}

export interface WhatsappWebhookSubscriptionInterface {
  appId: string
  options: {
    "callback_url": string
    "verify_token": string
    "access_token": string
  }
}

export interface WhatsappGetSenderDetailsInterface {
  whatsappBusinessID: string
  accessToken: string
}

export interface WhatsappSenderResultInterface {
  verified_name: string
  display_phone_number: string
  id: string
}

export interface WhatsappUserDetailInterface {
  whatsappBusinessID: string
  accessToken: string
}

export interface WhatsappSendMessageInterface {
  recipient: {
    id: string
  }
  message: {
    text: string
  }

}

export interface WhatsappSendMessageResponseInterface {
  recipient_id: String
  message_id: String
}

export interface WhatsappBusinessInterface {
  businessID?: string
  accessToken: string
}


export interface WhatsappMessageInterface {
  phoneId?: string
  accessToken?: string
}


