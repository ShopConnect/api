import { BaseNotificationProvider } from "./base-notification.provider";
import { ChatMessage } from "../../database/entities/chat-message.entity";
import { DatabaseService } from "../../database/database.service";
import { User } from "../../database/entities/user.entity";
import { WebsocketGateway } from "../../websocket/websocket.gateway";

export class WebsocketProvider extends BaseNotificationProvider {
    constructor(
        databaseService: DatabaseService,
        private readonly websocketGateway: WebsocketGateway,
    ) { 
        super(databaseService);
    }

    public sendNotificationToAll(title: string, body: string, icon: string, clickAction: "FLUTTER_NOTIFICATION_CLICK") {
        return;
    }

    public sendNotificationToUser(user: User, title: string, body: string, icon: string, clickAction: "FLUTTER_NOTIFICATION_CLICK") {
        return;
    }

    public sendChatMessageToUser(user: User, chatMessage: ChatMessage) {
        this.websocketGateway.sendMessage(chatMessage, user);
    }

    public sendChatMessageToAll(chatMessage: ChatMessage) {
        this.websocketGateway.sendMessageToAll(chatMessage);
    }
}