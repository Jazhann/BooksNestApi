import { Module } from '@nestjs/common';
import { UserController } from 'src/user/user.controller';

import { UserService } from 'src/user/user.service';
import { UserDAOModule } from './DAO/userDAO.module';

@Module({
  imports: [UserDAOModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
