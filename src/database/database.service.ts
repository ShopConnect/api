import { Connection, Repository } from 'typeorm';

import { IdentificationCard } from './entities/identification-card.entity';
import { Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { ItemCategory } from './entities/item-category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Seed } from './entities/seed.entity';
import { UserRepository } from './repositories/user.repository';
import { UserToken } from './entities/user-token.entity';

@Injectable()
export class DatabaseService {
    private readonly _identificationCardRepository: Repository<IdentificationCard>;

    private readonly _itemRepository: Repository<Item>;

    private readonly _itemCategoryRepository: Repository<ItemCategory>;

    private readonly _orderRepository: Repository<Order>;

    private readonly _orderItemRepository: Repository<OrderItem>;

    private readonly _seedRepository: Repository<Seed>;

    private readonly _userRepository: UserRepository;

    private readonly _userTokenRepository: Repository<UserToken>;

    constructor(
        private readonly connection: Connection
    ) {
        this._identificationCardRepository = this.connection.getRepository(IdentificationCard);
        this._itemRepository = this.connection.getRepository(Item);
        this._itemCategoryRepository = this.connection.getRepository(ItemCategory);
        this._orderRepository = this.connection.getRepository(Order);
        this._orderItemRepository = this.connection.getRepository(OrderItem);
        this._seedRepository = this.connection.getRepository(Seed);
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

    public get orderRepository(): Repository<Order> {
        return this._orderRepository;
    }

    public get orderItemRepository(): Repository<OrderItem> {
        return this._orderItemRepository;
    }

    public get seedRepository(): Repository<Seed> {
        return this._seedRepository;
    }

    public get userRepository(): UserRepository {
        return this._userRepository;
    }

    public get userTokenRepository(): Repository<UserToken> {
        return this._userTokenRepository;
    }
}
