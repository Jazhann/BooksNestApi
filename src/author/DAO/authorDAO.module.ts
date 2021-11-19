import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorSchema } from '../models/author.model';
import { AuthorDAO } from '../DAO/author.DAO';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }])],
  exports: [AuthorDAO, MongooseModule],
  providers: [AuthorDAO],
})
export class AuthorDAOModule {}
