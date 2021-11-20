import { Logger, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserController } from '../user/user.controller';

import { UserService } from '../user/user.service';
import { DAOModule } from '../DAO/DAO.module';

@Module({
  imports: [DAOModule, CommonModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
