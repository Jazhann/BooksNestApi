import { Logger, Module } from '@nestjs/common';

import { AuthorController } from '../author/author.controller';

import { AuthorService } from '../author/author.service';
import { BookDAOModule } from '../book/DAO/bookDAO.module';
import { AuthorDAOModule } from './DAO/authorDAO.module';

@Module({
  imports: [AuthorDAOModule, BookDAOModule],
  controllers: [AuthorController],
  providers: [AuthorService, Logger],
})
export class AuthorModule {}
