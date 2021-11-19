import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserDAOModule } from '../user/DAO/userDAO.module';

@Module({
  imports: [
    UserDAOModule,
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
