import { DatabaseService } from './database.service';
import { IdentificationCard } from './entities/identification-card.entity';
import { Item } from './entities/item.entity';
import { ItemCategory } from './entities/item-category.entity';
import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IdentificationCard,
      Item,
      ItemCategory,
      Order,
      OrderItem,
      UserRepository,
      UserToken
    ])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule { }
