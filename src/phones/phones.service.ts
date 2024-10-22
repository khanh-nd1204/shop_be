import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Phone, PhoneDocument } from './schemas/phone.schema';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class PhonesService {
  constructor(
    @InjectModel(Phone.name) private phoneModel: Model<PhoneDocument>,
  ) {}

  async create(createPhoneDto: CreatePhoneDto, user: IUser) {
    if (createPhoneDto.sold > createPhoneDto.quantity) {
      throw new BadRequestException('Sold must be less than quantity');
    }
    const createdBy = { _id: user._id, email: user.email };
    return await this.phoneModel.create({
      ...createPhoneDto,
      remain: createPhoneDto.quantity - createPhoneDto.sold,
      amount:
        createPhoneDto.price -
        (createPhoneDto.price * createPhoneDto.discount) / 100,
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
    const total = await this.phoneModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const data = await this.phoneModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: { current, pageSize, pages, total },
      data,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const result = await this.phoneModel.findOne({ _id: id });
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async update(updatePhoneDto: UpdatePhoneDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updatePhoneDto._id)) {
      throw new BadRequestException('Invalid product ID');
    }
    if (updatePhoneDto.sold > updatePhoneDto.quantity) {
      throw new BadRequestException('Product sold must be less than quantity');
    }
    const updatedBy = { _id: user._id, email: user.email };
    const result = await this.phoneModel.updateOne(
      { _id: updatePhoneDto._id },
      {
        ...updatePhoneDto,
        remain: updatePhoneDto.quantity - updatePhoneDto.sold,
        amount:
          updatePhoneDto.price -
          (updatePhoneDto.price * updatePhoneDto.discount) / 100,
        updatedBy,
      },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Product not found');
    }
    if (result.modifiedCount === 0) {
      throw new NotFoundException('No product were modified');
    }
    return result;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const result = await this.phoneModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
    if (result.acknowledged === false) {
      throw new NotFoundException('No product were deleted');
    }
    return result;
  }

  async findAllNames() {
    const products = await this.phoneModel.find({}, 'name').sort('name').exec();
    const result = products.map((product) => product.name);
    return result;
  }
}
