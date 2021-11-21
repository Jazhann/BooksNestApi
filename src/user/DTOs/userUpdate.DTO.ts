import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UserUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  phone?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  dni?: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  city?: string;

  @IsDate()
  @ApiProperty({ required: false, nullable: true })
  birthDate?: Date;

  @IsDate()
  @ApiHideProperty()
  registrationDate?: Date;
}
