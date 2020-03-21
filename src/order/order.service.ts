import { CreateOrderRequestDto } from '../_dtos/create-order-request.dto';
import { CreateOrderResponseDto } from '../_dtos/create-order-response.dto';
import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { Order } from '../database/entities/order.entity';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class OrderService {
  private readonly orderRepository: Repository<Order>;

  constructor(
    private readonly databaseService: DatabaseService
  ) {
    this.orderRepository = this.databaseService.orderRepository;
  }

  public async create(user: User, createOrderRequestDto: CreateOrderRequestDto) {
    const order = this.orderRepository.create({
      owner: user,
      maxValue: createOrderRequestDto.maxValue
    });
    await this.orderRepository.save(order);
        return new CreateOrderResponseDto(true);
    }
}
