import { Logger, Module } from '@nestjs/common';
import { UserController } from '../user/user.controller';

import { UserService } from '../user/user.service';
import { UserDAOModule } from './DAO/userDAO.module';

@Module({
  imports: [UserDAOModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
