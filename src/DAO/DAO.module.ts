import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from 'src/book/models/book.model';
import { UserSchema } from 'src/user/models/user.model';

import { AuthorSchema } from '../author/models/author.model';
import { AuthorDAO } from './author.DAO';
import { BookDAO } from './book.DAO';
import { UserDAO } from './user.DAO';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Author', schema: AuthorSchema },
      { name: 'Book', schema: BookSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  exports: [AuthorDAO, BookDAO, UserDAO, MongooseModule],
  providers: [AuthorDAO, BookDAO, UserDAO],
})
export class DAOModule {}
