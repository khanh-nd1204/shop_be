import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from './create-phone.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
