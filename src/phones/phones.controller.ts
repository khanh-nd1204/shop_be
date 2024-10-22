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
import { PhonesService } from './phones.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { IUser } from '../users/users.interface';
import { Public, Roles, User } from "../decorator/customize";
import { Role } from "../enum/role.enum";

@Controller('phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createPhoneDto: CreatePhoneDto, @User() user: IUser) {
    const result = await this.phonesService.create(createPhoneDto, user);
    return {
      data: {
        _id: result._id,
        name: result.name,
      },
      message: 'Product created successfully',
    };
  }

  @Get()
  @Public()
  async findAll(@Query() query: string) {
    const result = await this.phonesService.findAll(query);
    return {
      data: result,
      message: 'Products fetched successfully',
    };
  }

  @Get('name')
  @Public()
  async findAllNames() {
    const result = await this.phonesService.findAllNames();
    return {
      data: result,
      message: 'Product names fetched successfully',
    };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const result = await this.phonesService.findOne(id);
    return {
      data: result,
      message: 'Product fetched successfully',
    };
  }

  @Patch()
  @Roles(Role.Admin)
  async update(@Body() updatePhoneDto: UpdatePhoneDto, @User() user: IUser) {
    const result = await this.phonesService.update(updatePhoneDto, user);
    return {
      data: result,
      message: 'Product updated successfully',
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const result = await this.phonesService.remove(id);
    return {
      data: result,
      message: 'Product deleted successfully',
    };
  }
}
