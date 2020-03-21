import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemCategory } from './entities/itemCategory.entity';
import { ShoppingList } from './entities/shoppinglist.entity';
import { ShoppingListItem } from './entities/shoppingListItem.entity';
import { UserRepository } from './repositories/user.repository';
import { UserToken } from './entities/user-token.entity';
import { IdentificationCard } from './entities/identification-card.entity';

@Injectable()
export class DatabaseService {
    private readonly _identificationCardRepository: Repository<IdentificationCard>;

    private readonly _itemCategoryRepository: Repository<ItemCategory>

    private readonly _itemRepository: Repository<Item>

    private readonly _shoppingListRepository: Repository<ShoppingList>

    private readonly _shoppingListItemRepository: Repository<ShoppingListItem>

    private readonly _userRepository: UserRepository;

    private readonly _userTokenRepository: Repository<UserToken>;

    constructor(
        private readonly connection: Connection
    ) {
        this._identificationCardRepository = this.connection.getRepository(IdentificationCard);
        this._itemRepository = this.connection.getRepository(Item);
        this._itemCategoryRepository = this.connection.getRepository(ItemCategory);
        this._shoppingListItemRepository = this.connection.getRepository(ShoppingListItem);
        this._shoppingListRepository = this.connection.getRepository(ShoppingList);
        this._userRepository = this.connection.getCustomRepository(UserRepository);
        this._userTokenRepository = this.connection.getRepository(UserToken);
    }

    public get identificationCardRepository(): Repository<IdentificationCard> {
        return this._identificationCardRepository;
    }
    

    public get itemRepository(): Repository<Item> {
        return this._itemRepository;
    }

    public get itemCategoryRepository(): Repository<ItemCategory> {
        return this._itemCategoryRepository;
    }

    public get shoppingListItemRepository(): Repository<ShoppingListItem> {
        return this._shoppingListItemRepository;
    }

    public get shoppingListRepository(): Repository<ShoppingList> {
        return this._shoppingListRepository;
    }

    public get userRepository(): UserRepository {
        return this._userRepository;
    }

    public get userTokenRepository(): Repository<UserToken> {
        return this._userTokenRepository;
    }
}
