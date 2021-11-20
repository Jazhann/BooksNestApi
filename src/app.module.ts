import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';

import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { UserDAOModule } from './user/DAO/userDAO.module';
import { AuthModule } from './auth/auth.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AuthorModule,
    BookModule,
    UserDAOModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AuthService, Logger],
})
export class AppModule {}
