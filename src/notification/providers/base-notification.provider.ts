import { ChatMessage } from "../../database/entities/chat-message.entity";
import { DatabaseService } from "src/database/database.service";
import { User } from "../../database/entities/user.entity";

export abstract class BaseNotificationProvider {
    constructor(
        public readonly databaseService: DatabaseService,
    ) {

    }
    
    public abstract sendNotificationToAll(title: string, body: string, icon: string, clickAction: 'FLUTTER_NOTIFICATION_CLICK');
    public abstract sendNotificationToUser(user: User, title: string, body: string, icon: string, clickAction: 'FLUTTER_NOTIFICATION_CLICK');
    public abstract sendChatMessageToUser(user: User, chatMessage: ChatMessage);
    public abstract sendChatMessageToAll(chatMessage: ChatMessage);
}