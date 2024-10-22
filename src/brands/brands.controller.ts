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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Public, Roles, User } from "../decorator/customize";
import { IUser } from '../users/users.interface';
import { Role } from '../enum/role.enum';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createBrandDto: CreateBrandDto, @User() user: IUser) {
    const result = await this.brandsService.create(createBrandDto, user);
    return {
      data: {
        _id: result._id,
        name: result.name,
      },
      message: 'Brand created successfully',
    };
  }

  @Get()
  async findAll(@Query() query: string) {
    const result = await this.brandsService.findAll(query);
    return {
      data: result,
      message: 'Brands fetched successfully',
    };
  }

  @Get('/all')
  @Public()
  async getAll() {
    const result = await this.brandsService.getAll();
    return {
      data: result,
      message: 'Brands fetched successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.brandsService.findOne(id);
    return {
      data: result,
      message: 'Brand fetched successfully',
    };
  }

  @Patch()
  @Roles(Role.Admin)
  async update(@Body() updateBrandDto: UpdateBrandDto, @User() user: IUser) {
    const result = await this.brandsService.update(updateBrandDto, user);
    return {
      data: result,
      message: 'Brand updated successfully',
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const result = await this.brandsService.remove(id);
    return {
      data: result,
      message: 'Brand deleted successfully',
    };
  }
}
