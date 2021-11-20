import { Logger, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthorDAOModule } from '../author/DAO/authorDAO.module';

import { BookController } from '../book/book.controller';

import { BookService } from '../book/book.service';
import { BookDAOModule } from './DAO/bookDAO.module';

@Module({
  imports: [BookDAOModule, AuthorDAOModule, CommonModule],
  controllers: [BookController],
  providers: [BookService, Logger],
})
export class BookModule {}
