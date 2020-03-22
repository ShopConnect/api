import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { ItemCategory } from './database/entities/item-category.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Item } from './database/entities/item.entity';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("meta")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  public getHello(): object {
    return this.appService.getHello();
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getCategories(): Promise<ItemCategory[]> {
    return this.appService.getCategories();
  }

  @Get('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getCategory(@Param('id') id: number): Promise<ItemCategory> {
    return this.appService.getCategory(<ItemCategory>{ id: id });
  }

  @Get('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public getItem(@Param('id') id: number): Promise<Item> {
    return this.appService.getItemDetails(<Item>{ id: id });
  }

  //@Get('items')
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  //public getItems(): Promise<Item[]> {
  //  return this.appService.getItems();
  //}
}
