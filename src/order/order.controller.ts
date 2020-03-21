import { Controller, Post, Req, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderRequestDto } from '../_dtos/create-order-request.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';

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
}
