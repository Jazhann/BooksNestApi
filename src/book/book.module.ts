import { Module } from '@nestjs/common';
import { AuthorDAOModule } from 'src/author/DAO/authorDAO.module';

import { BookController } from 'src/book/book.controller';

import { BookService } from 'src/book/book.service';
import { BookDAOModule } from './DAO/bookDAO.module';

@Module({
  imports: [BookDAOModule, AuthorDAOModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
