import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  addressDetail: string;

  @Prop()
  totalPrice: number;

  @Prop({ trim: true })
  status: string;

  @Prop({ trim: true })
  paymentMethod: string;

  @Prop({ trim: true })
  note: string;

  @Prop()
  detail: {
    _id: string;
    name: string;
    brand: string;
    amount: number;
    image: string;
    quantity: number;
    remain: number;
  }[];

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

  @Prop({ type: Object })
  canceledBy: {
    _id: string;
    email: string;
  };

  @Prop()
  canceledAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
