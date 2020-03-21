import { CreateOrderRequestDto, CreateOrderItemRequestDto } from '../_dtos/create-order-request.dto';
import { CreateOrderResponseDto } from '../_dtos/create-order-response.dto';
import { DatabaseService } from '../database/database.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from '../database/entities/order.entity';
import { OrderState } from '../_enums/order-state.enum';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Item } from '../database/entities/item.entity';
import { OrderItem } from '../database/entities/order-item.entity';

@Injectable()
export class OrderService {
  private readonly orderRepository: Repository<Order>;
  private readonly orderItemRepository: Repository<OrderItem>;
  private readonly itemRepository: Repository<Item>;
  
  constructor(
    private readonly databaseService: DatabaseService
  ) {
    this.orderRepository = this.databaseService.orderRepository;
    this.orderItemRepository = this.databaseService.orderItemRepository;
    this.itemRepository = this.databaseService.itemRepository
  }

  public async create(user: User, createOrderRequestDto: CreateOrderRequestDto) {
    let order = this.orderRepository.create({
      owner: user,
      items: createOrderRequestDto.items,
      orderState: OrderState.Ordered,
      maxValue: createOrderRequestDto.maxValue
    });
    
    await this.orderRepository.save(order);
    return new CreateOrderResponseDto(true);
  }

  public async getOrders(requestedUser: User): Promise<Order[]> {
    return (await this.orderRepository.find({
      relations: [
        "owner"
      ]
    })).filter(x => x.owner.id != requestedUser.id);
  }

  public getOrder(order: Order, relations: string[] = []): Promise<Order> {
    return this.orderRepository.findOne({
      where: {
        id: order.id
      },
      relations: relations
    })
  }

  public async addItem(requestUser: User, orderId: number, createOrderItemRequestDto: CreateOrderItemRequestDto) {
    let order = await this.getOrder(<Order>{ id: orderId }, ["items", "items.item"]);
    if (!order) {
      throw new BadRequestException('Invalid Order id');
    }

    if (order.owner != requestUser) {
      throw new BadRequestException('You do not own this order!');
    }
    
    let orderItem = order.items.find(item => item.item.id == createOrderItemRequestDto.itemId);
    if (orderItem) {
      orderItem.quantity = createOrderItemRequestDto.quantity;
      orderItem.isOptional = createOrderItemRequestDto.isOptional;
      await this.orderItemRepository.save(orderItem);
      return true;
    }
    
    let item = await this.itemRepository.findOne({ where: { id: createOrderItemRequestDto.itemId } });
    if (!item) {
      throw new BadRequestException('Invalid item id');
    }
    
    await this.orderItemRepository.save({
      order: order,
      item: item,
      quantity: createOrderItemRequestDto.quantity,
      isOptional: createOrderItemRequestDto.isOptional
    });

    return true;
  }

  public async removeOrder(user: User, orderId: number) {
    await this.orderRepository.remove(<Order>{ id: orderId });
  }

  public async removeOrderItem(user: User, orderId: number, itemId: number) {
    let order = await this.getOrder(<Order>{ id: orderId });
    if (!order) {
      throw new BadRequestException('Invalid order id!');
    }
    
    order.items = order.items.filter(item => item.id != itemId);
    return await this.orderRepository.update({ id: orderId }, order);
  }

  public async changeState(user: User, orderId: number, newState: OrderState) {
    let order = await this.getOrder(<Order>{ id: orderId }, ["owner", "accepter"]);
    if (!order) {
      throw new BadRequestException('Invalid oder id!');
    }

    if (order.orderState == OrderState.Ordered && newState == OrderState.Accepted && order.owner.id != user.id) {
      order.orderState = newState;
      order.accepter = user;
    }
    else if (order.orderState == OrderState.Ordered && newState == OrderState.Drafted && order.owner.id == user.id) {
      order.orderState = newState;
    }
    else if (order.orderState == OrderState.Drafted && newState == OrderState.Ordered && order.owner.id == user.id) {
      order.orderState = newState;
    }
    else if (order.orderState == OrderState.Accepted && (newState == OrderState.Ordered || newState == OrderState.Drafted) && order.owner.id == user.id) {
      order.orderState = newState;
      order.accepter = null;
    }
    else if (order.orderState == OrderState.Accepted && newState == OrderState.Shopping && order.accepter.id == user.id) {
      order.orderState = newState;
    }
    else if (order.orderState == OrderState.Shopping && newState == OrderState.Delivering && order.accepter.id == user.id) {
      order.orderState = newState;
    }
    else if (order.orderState == OrderState.Delivering && newState == OrderState.Delivered && (order.accepter.id == user.id || order.owner.id == user.id)) {
      order.orderState = newState;
    }
    else {
      throw new BadRequestException('Illegal move or not permitted!');
    }
    return await this.orderRepository.update({ id: orderId }, order);
  }
}
