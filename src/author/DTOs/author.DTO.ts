import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BookDTO } from '../../book/DTOs/book.DTO';

export class AuthorDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString({ each: true })
  @ApiProperty()
  books: BookDTO[] = [];
}
