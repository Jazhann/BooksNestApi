import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsString, IsNumber, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { AuthorUpdateDTO } from '../../author/DTOs/authorUpdate.DTO';

export class BookUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  _id: ObjectId;

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
  authors: AuthorUpdateDTO[] = [];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pages: number;
}
