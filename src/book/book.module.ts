import { Logger, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { DAOModule } from '../DAO/DAO.module';

import { BookController } from '../book/book.controller';

import { BookService } from '../book/book.service';

@Module({
  imports: [DAOModule, CommonModule],
  controllers: [BookController],
  providers: [BookService, Logger],
})
export class BookModule {}
