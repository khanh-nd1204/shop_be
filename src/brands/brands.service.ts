import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import aqp from 'api-query-params';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {}

  async create(createBrandDto: CreateBrandDto, user: IUser) {
    const isExist = await this.brandModel.findOne({
      name: createBrandDto.name,
    });
    if (isExist) {
      throw new BadRequestException('Brand name already exists');
    }
    const createdBy = { _id: user._id, email: user.email };
    return await this.brandModel.create({
      ...createBrandDto,
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
    const total = await this.brandModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const data = await this.brandModel
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

  async getAll() {
    return await this.brandModel.find().sort('name').exec();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid brand ID');
    }
    const result = await this.brandModel.findOne({ _id: id });
    if (!result) {
      throw new NotFoundException('Brand not found');
    }
    return result;
  }

  async update(updateBrandDto: UpdateBrandDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateBrandDto._id)) {
      throw new BadRequestException('Invalid brand ID');
    }
    const isExist = await this.brandModel.findOne({
      name: updateBrandDto.name,
    });
    if (isExist && isExist._id.toString() !== updateBrandDto._id) {
      throw new BadRequestException('Brand name already exists');
    }
    const updatedBy = { _id: user._id, email: user.email };
    const result = await this.brandModel.updateOne(
      { _id: updateBrandDto._id },
      { ...updateBrandDto, updatedBy },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Brand not found');
    }
    if (result.modifiedCount === 0) {
      throw new NotFoundException('No brand were modified');
    }
    return result;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid brand ID');
    }
    const result = await this.brandModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Brand not found');
    }
    if (result.acknowledged === false) {
      throw new NotFoundException('No brand were deleted');
    }
    return result;
  }
}
