import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from '../models/user.model';
import { UserDAO } from '../DAO/user.DAO';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  exports: [UserDAO, MongooseModule],
  providers: [UserDAO],
})
export class UserDAOModule {}
