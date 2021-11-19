import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { BookUpdateDTO } from '../../book/DTOs/bookUpdate.DTO';

export class AuthorUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString({ each: true })
  @ApiProperty()
  books: BookUpdateDTO[] = [];
}
