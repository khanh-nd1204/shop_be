import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import { Phone, PhoneDocument } from '../phones/schemas/phone.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Phone.name) private phoneModel: Model<PhoneDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const createdBy = { _id: user._id, email: user.email };
    if (createOrderDto.detail && createOrderDto.detail.length > 0) {
      for (const item of createOrderDto.detail) {
        if (!mongoose.Types.ObjectId.isValid(item._id)) {
          throw new BadRequestException('Invalid product ID');
        }
        const product = await this.phoneModel.findOne({ _id: item._id });
        if (product) {
          await this.phoneModel.updateOne(
            { _id: product._id },
            {
              sold: product.sold + item.quantity,
              remain: product.remain - item.quantity,
            },
          );
        } else {
          throw new NotFoundException('Product not found');
        }
      }
    }
    return await this.orderModel.create({
      ...createOrderDto,
      status: 'Pending',
      createdBy,
    });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const { current, pageSize } = filter;
    if (!current || !pageSize) {
      throw new BadRequestException('Missing current page and page size');
    }
    delete filter.current;
    delete filter.pageSize;

    const skip = (current - 1) * pageSize;
    const total = await this.orderModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const data = await this.orderModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sort as any)
      .sort('-createdAt')
      .populate(population)
      .exec();

    return {
      meta: { current, pageSize, pages, total },
      data,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }
    const result = await this.orderModel.findOne({ _id: id });
    if (!result) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  async update(updateOrderDto: UpdateOrderDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateOrderDto._id)) {
      throw new BadRequestException('Invalid order ID');
    }
    const updatedBy = { _id: user._id, email: user.email };
    const result = await this.orderModel.updateOne(
      { _id: updateOrderDto._id },
      { ...updateOrderDto, updatedBy },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Order not found');
    }
    if (result.modifiedCount === 0) {
      throw new NotFoundException('No order were modified');
    }
    return result;
  }

  async findByUsername(email: string, query: string) {
    const { filter, sort, population } = aqp(query);
    const { current, pageSize } = filter;
    if (!current || !pageSize) {
      throw new BadRequestException('Missing current page and page size');
    }
    delete filter.current;
    delete filter.pageSize;

    const skip = (current - 1) * pageSize;
    const total = await this.orderModel.find({ email }).countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const data = await this.orderModel
      .find({ email })
      .skip(skip)
      .limit(pageSize)
      .sort(sort as any)
      .sort('-createdAt')
      .populate(population)
      .exec();

    return {
      meta: { current, pageSize, pages, total },
      data,
    };
  }

  async remove(id: string, user: IUser) {
    const order = await this.findOne(id);
    if (order) {
      for (const item of order.detail) {
        if (!mongoose.Types.ObjectId.isValid(item._id)) {
          throw new BadRequestException('Invalid product ID');
        }
        const product = await this.phoneModel.findOne({ _id: item._id });
        if (product) {
          await this.phoneModel.updateOne(
            { _id: product._id },
            {
              sold: product.sold - item.quantity,
              remain: product.remain + item.quantity,
            },
          );
        } else {
          throw new NotFoundException('Product not found');
        }
      }
      const canceledBy = { _id: user._id, email: user.email };
      const result = await this.orderModel.updateOne(
        { _id: id },
        { status: 'Canceled', canceledBy, canceledAt: new Date() },
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException('Order not found');
      }
      if (result.modifiedCount === 0) {
        throw new NotFoundException('No order were modified');
      }
      return result;
    }
  }
}
