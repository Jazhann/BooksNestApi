import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookSchema } from '../models/book.model';
import { BookDAO } from '../DAO/book.DAO';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  exports: [BookDAO, MongooseModule],
  providers: [BookDAO],
})
export class BookDAOModule {}
