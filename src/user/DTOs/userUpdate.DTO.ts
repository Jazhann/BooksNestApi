import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  phone?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, nullable: true })
  dni?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, nullable: true })
  city?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, nullable: true })
  birthDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiHideProperty()
  registrationDate?: Date;
}
