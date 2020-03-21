import { Controller, Post, Req, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Param, BadRequestException, Get, Delete } from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderRequestDto, CreateOrderItemRequestDto } from '../_dtos/create-order-request.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { Order } from '../database/entities/order.entity';
import { User } from '../database/entities/user.entity';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('order')
@ApiBearerAuth()
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    public async createOrder(@Req() req: Request, @Body() createOrderRequestDto: CreateOrderRequestDto) {
        return true;
    }

    @Post(':id')
    @UseGuards(JwtAuthGuard)
    public async addItem(@Req() req: Request, @Body() createOrderItemRequestDto: CreateOrderItemRequestDto, @Param('id') id: number) {
        const requestUser = <User>req.user;
        return await this.orderService.addItem(requestUser, id, createOrderItemRequestDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public async getOrder(@Req() user: User, @Param('id') id: number) {
        const order = await this.orderService.getOrder(<Order>{ id: id });
        if (order.owner != user && !user.isAdmin) {
            throw new BadRequestException('You do not own this order!');
        }
        
        return order; 
    }

    @Delete(':id/:itemid')
    @UseGuards(JwtAuthGuard)
    public async removeOrderItem(@Req() user: User, @Param('id') id: number, @Param('itemid') itemid: number) {
        return this.orderService.removeOrderItem(user, id, itemid);
    }  
        
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public async removeOrder(@Req() user: User, @Param('id') id: number) {
        return this.orderService.removeOrder(user, id);
    }    
}
