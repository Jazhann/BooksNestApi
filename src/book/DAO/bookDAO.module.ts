import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookSchema } from 'src/book/models/book.model';
import { BookDAO } from 'src/book/DAO/book.DAO';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  exports: [BookDAO, MongooseModule],
  providers: [BookDAO],
})
export class BookDAOModule {}
