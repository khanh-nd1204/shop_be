import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PhoneDocument = HydratedDocument<Phone>;

@Schema({ timestamps: true })
export class Phone {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  brand: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  sold: number;

  @Prop()
  remain: number;

  @Prop()
  discount: number;

  @Prop()
  amount: number;

  @Prop({ trim: true })
  description: string;

  @Prop()
  images: string[];

  @Prop({ type: Object })
  detail: {
    battery: string;
    camera: string;
    gpu: string;
    chip: string;
    ram: string;
    rom: string;
  };

  @Prop({ type: Object })
  createdBy: {
    _id: string;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: string;
    email: string;
  };

  @Prop()
  updatedAt: Date;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
