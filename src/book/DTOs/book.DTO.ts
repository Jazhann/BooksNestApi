import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { AuthorDTO } from 'src/author/DTOs/author.DTO';

export class BookDTO {
  @ApiProperty({ required: false, nullable: true })
  _id: ObjectId;
  @ApiProperty()
  title: string;
  @ApiProperty()
  isbn: string;
  @ApiProperty()
  authors: AuthorDTO[];
  @ApiProperty()
  pages: number;
}
