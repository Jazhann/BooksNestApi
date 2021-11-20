import { Logger, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

import { AuthorController } from '../author/author.controller';

import { AuthorService } from '../author/author.service';
import { BookDAOModule } from '../book/DAO/bookDAO.module';
import { AuthorDAOModule } from './DAO/authorDAO.module';

@Module({
  imports: [AuthorDAOModule, BookDAOModule, CommonModule],
  controllers: [AuthorController],
  providers: [AuthorService, Logger],
})
export class AuthorModule {}
