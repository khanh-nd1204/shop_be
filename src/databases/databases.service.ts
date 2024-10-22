import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      if (countUser === 0) {
        await this.userModel.insertMany([
          {
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashSync('123456', genSaltSync(10)),
            phone: '0123456789',
            address: 'Thành phố Hà Nội',
            role: 'ADMIN',
            isActive: true,
            avatar: '9db6f222-3c1b-4547-b036-896958619014.jpg', // default avatar
          },
          {
            name: 'User',
            email: 'user@gmail.com',
            password: hashSync('123456', genSaltSync(10)),
            phone: '0123456789',
            address: 'Thành phố Hà Nội',
            role: 'USER',
            isActive: true,
            avatar: '9db6f222-3c1b-4547-b036-896958619014.jpg', // default avatar
          },
        ]);
      }
    }
  }
}
