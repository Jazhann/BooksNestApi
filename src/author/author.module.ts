import { Module } from '@nestjs/common';

import { AuthorController } from 'src/author/author.controller';

import { AuthorService } from 'src/author/author.service';
import { AuthorDAOModule } from './DAO/authorDAO.module';

@Module({
  imports: [AuthorDAOModule],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
