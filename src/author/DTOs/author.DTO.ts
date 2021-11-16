import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { BookDTO } from 'src/book/DTOs/book.DTO';

export class AuthorDTO {
  @ApiProperty()
  _id: ObjectId;
  @ApiProperty()
  name: string;
  @ApiProperty()
  books: BookDTO[];
}
