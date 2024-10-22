import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles, User } from '../decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../enum/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    const result = await this.ordersService.create(createOrderDto, user);
    return {
      data: {
        _id: result._id,
        name: result.name,
      },
      message: 'Order created successfully',
    };
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: string) {
    const result = await this.ordersService.findAll(query);
    return {
      data: result,
      message: 'Orders fetched successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.ordersService.findOne(id);
    return {
      data: result,
      message: 'Order fetched successfully',
    };
  }

  @Patch()
  @Roles(Role.Admin)
  async update(@Body() updateOrderDto: UpdateOrderDto, @User() user: IUser) {
    const result = await this.ordersService.update(updateOrderDto, user);
    return {
      data: result,
      message: 'Order updated successfully',
    };
  }

  @Post('/user')
  async findByUser(@User() user: IUser, @Query() query: string) {
    const result = await this.ordersService.findByUsername(user.email, query);
    return {
      data: result,
      message: 'Order fetched successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    const result = await this.ordersService.remove(id, user);
    return {
      data: result,
      message: 'Order canceled successfully',
    };
  }
}
