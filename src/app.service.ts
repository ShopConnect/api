import * as cats from 'cat-ascii-faces';

import { DatabaseService } from './database/database.service';
import { Injectable } from '@nestjs/common';
import { Item } from './database/entities/item.entity';
import { ItemCategory } from './database/entities/item-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  private readonly itemCategoryRepository: Repository<ItemCategory>;
  private readonly itemRepository: Repository<Item>;

  constructor(
    private readonly databaseService: DatabaseService,
  ) {
    this.itemCategoryRepository = this.databaseService.itemCategoryRepository;
    this.itemRepository = this.databaseService.itemRepository;
  }

  public getHello(): object {
    return {
      message: 'It works!',
      cat: cats()
    };
  }

  public getCategories(): Promise<ItemCategory[]> {
    return this.itemCategoryRepository.find();
  }

  public getCategory(category: ItemCategory): Promise<ItemCategory> {
    return this.itemCategoryRepository.findOne({
      where: {
        id: category.id
      },
      relations: [
        "items"
      ]
    });
  }

  public getItemDetails(item: Item): Promise<Item> {
    return this.itemRepository.findOne({
      where: {
        id: item.id
      }
    });
  }

  public getItems(): Promise<Item[]> {
    return this.itemRepository.find();
  }
}
