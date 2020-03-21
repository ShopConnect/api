import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserToken } from './entities/user-token.entity';
import { ItemCategory } from './entities/itemCategory.entity';
import { ShoppingList } from './entities/shoppinglist.entity';
import { ShoppingListItem } from './entities/shoppingListItem.entity';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Item,
      ItemCategory,
      ShoppingList,
      ShoppingListItem,
      UserRepository,
      UserToken
    ])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule { }
