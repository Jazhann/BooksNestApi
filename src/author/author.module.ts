import { Logger, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';

import { AuthorController } from '../author/author.controller';

import { AuthorService } from '../author/author.service';
import { DAOModule } from '../DAO/DAO.module';

@Module({
  imports: [DAOModule, CommonModule],
  controllers: [AuthorController],
  providers: [AuthorService, Logger],
})
export class AuthorModule {}
