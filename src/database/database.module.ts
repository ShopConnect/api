import { ChatMessage } from './entities/chat-message.entity';
import { DatabaseService } from './database.service';
import { IdentificationCard } from './entities/identification-card.entity';
import { Item } from './entities/item.entity';
import { ItemCategory } from './entities/item-category.entity';
import { LogEntry } from './entities/log-entry.entity';
import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Seed } from './entities/seed.entity';
import { SeedingService } from './seeding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from './entities/user-device.entity';
import { UserRepository } from './repositories/user.repository';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      IdentificationCard,
      Item,
      ItemCategory,
      LogEntry,
      Order,
      OrderItem,
      Seed,
      UserRepository,
      UserDevice,
      UserToken
    ])
  ],
  providers: [DatabaseService, SeedingService],
  exports: [DatabaseService, SeedingService]
})
export class DatabaseModule { }
