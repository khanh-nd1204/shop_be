import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Phone, PhoneSchema } from './schemas/phone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Phone.name, schema: PhoneSchema }]),
  ],
  controllers: [PhonesController],
  providers: [PhonesService],
})
export class PhonesModule {}
