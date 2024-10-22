import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PhoneDetailDTO {
  @IsString()
  @IsNotEmpty()
  battery: string;

  @IsString()
  @IsNotEmpty()
  camera: string;

  @IsString()
  @IsNotEmpty()
  gpu: string;

  @IsString()
  @IsNotEmpty()
  chip: string;

  @IsString()
  @IsNotEmpty()
  ram: string;

  @IsString()
  @IsNotEmpty()
  rom: string;
}

export class CreatePhoneDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  sold: number;

  @Max(100)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  discount: number;

  @MaxLength(1000)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  images: string[];

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PhoneDetailDTO)
  detail: PhoneDetailDTO;
}
