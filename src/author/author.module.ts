import { Module } from '@nestjs/common';

import { AuthorController } from 'src/author/author.controller';

import { AuthorService } from 'src/author/author.service';
import { BookDAOModule } from 'src/book/DAO/bookDAO.module';
import { AuthorDAOModule } from './DAO/authorDAO.module';

@Module({
  imports: [AuthorDAOModule, BookDAOModule],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
