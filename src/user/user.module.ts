import { Logger, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserController } from '../user/user.controller';

import { UserService } from '../user/user.service';
import { UserDAOModule } from './DAO/userDAO.module';

@Module({
  imports: [UserDAOModule, CommonModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
