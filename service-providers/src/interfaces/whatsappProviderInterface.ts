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
    phoneId?: string
    accessToken?: string
    options: {
        recipient: {
            id: string
        }
        message: {
            text: string
        }
    }
}

export interface WhatsappSendMessageResponseInterface {
    message_id: string
    recipient_id: string
}
