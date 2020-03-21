import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [DatabaseModule, ConfigModule, WebsocketModule],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
