import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Module({
    imports: [DatabaseModule],
    providers: [WebsocketGateway],
    exports: [WebsocketGateway]
})
export class WebsocketModule {}
