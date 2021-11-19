import { ApiProperty } from '@nestjs/swagger';
import { AuthorDTO } from '../../author/DTOs/author.DTO';
import { IsString, IsNumber, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class BookDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  isbn: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty()
  authors: AuthorDTO[] = [];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pages: number;
}
