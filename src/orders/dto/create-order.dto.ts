import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
} from 'class-validator';

class OrderDetailDTO {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  remain: number;
}

export class CreateOrderDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  addressDetail: string;

  @MaxLength(1000)
  @IsString()
  note: string;

  @IsInt()
  @IsNotEmpty()
  totalPrice: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsObject({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  detail: OrderDetailDTO[];
}
