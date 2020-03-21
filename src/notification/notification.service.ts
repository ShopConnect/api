import { BaseNotificationProvider } from './providers/base-notification.provider';
import { ChatMessage } from '../database/entities/chat-message.entity';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WebsocketProvider } from './providers/websocket.provider';

@Injectable()
export class NotificationService extends BaseNotificationProvider {
    private readonly notificationProviders: BaseNotificationProvider[] = [];
    
    constructor(
        databaseService: DatabaseService,
        private readonly configService: ConfigService,
        private readonly websocketGateway: WebsocketGateway
    ) {
        super(databaseService)
        this.registerProvider(new WebsocketProvider(this.databaseService, this.websocketGateway));
    }

    public sendNotificationToAll(title: string, body: string, icon: string, clickAction: "FLUTTER_NOTIFICATION_CLICK") {
        this.notificationProviders.forEach(notificationProvider => notificationProvider.sendNotificationToAll(title, body, icon, clickAction));
    }

    public sendNotificationToUser(user: User, title: string, body: string, icon: string, clickAction: "FLUTTER_NOTIFICATION_CLICK") {
        this.notificationProviders.forEach(notificationProvider => notificationProvider.sendNotificationToUser(user, title, body, icon, clickAction));
    }

    public sendChatMessageToUser(user: User, chatMessage: ChatMessage) {
        this.notificationProviders.forEach(notificationProvider => notificationProvider.sendChatMessageToUser(user, chatMessage));
    }

    public sendChatMessageToAll(chatMessage: ChatMessage) {
        this.notificationProviders.forEach(notificationProvider => notificationProvider.sendChatMessageToAll(chatMessage));
    }

    private registerProvider(provider: BaseNotificationProvider) {
        this.notificationProviders.push(provider);
    }
}
