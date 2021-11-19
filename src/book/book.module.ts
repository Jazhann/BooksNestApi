import { Logger, Module } from '@nestjs/common';
import { AuthorDAOModule } from '../author/DAO/authorDAO.module';

import { BookController } from '../book/book.controller';

import { BookService } from '../book/book.service';
import { BookDAOModule } from './DAO/bookDAO.module';

@Module({
  imports: [BookDAOModule, AuthorDAOModule],
  controllers: [BookController],
  providers: [BookService, Logger],
})
export class BookModule {}
