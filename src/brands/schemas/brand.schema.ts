import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  country: string;

  @Prop({ trim: true })
  logo: string;

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

export const BrandSchema = SchemaFactory.createForClass(Brand);
