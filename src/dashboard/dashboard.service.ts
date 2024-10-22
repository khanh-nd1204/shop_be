import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Brand, BrandDocument } from '../brands/schemas/brand.schema';
import { Phone, PhoneDocument } from '../phones/schemas/phone.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Phone.name) private phoneModel: Model<PhoneDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll() {
    const userTotal = await this.userModel.countDocuments();
    const brandTotal = await this.brandModel.countDocuments();
    const productTotal = await this.phoneModel.countDocuments();
    const orderTotal = await this.orderModel.countDocuments();
    const reports = await this.getOrdersPerMonth();
    const analytics = await this.getOrdersByStatus();
    return { userTotal, brandTotal, productTotal, orderTotal, reports, analytics };
  }

  async getOrdersPerMonth(): Promise<any> {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          }, // Nhóm theo năm và tháng
          count: { $sum: 1 }, // Đếm số lượng đơn hàng
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }, // Sắp xếp theo năm và tháng
      },
    ]);

    // Định dạng lại kết quả trước khi trả về
    return result.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      orderCount: item.count,
    }));
  }

  async getOrdersByStatus(): Promise<any> {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status', // Nhóm theo trạng thái
          orderCount: { $sum: 1 }, // Đếm số lượng đơn hàng
        },
      },
      {
        $sort: { orderCount: 1 }, // Sắp xếp theo số lượng tăng dần (nếu cần)
      },
    ]);

    // Định dạng lại kết quả trước khi trả về
    return result.map((item) => ({
      status: item._id,
      orderCount: item.orderCount,
    }));
  }
}
