import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorSchema } from 'src/author/models/author.model';
import { AuthorDAO } from 'src/author/DAO/author.DAO';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
  ],
  exports: [AuthorDAO, MongooseModule],
  providers: [AuthorDAO],
})
export class AuthorDAOModule {}
