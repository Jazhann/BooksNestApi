import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsEmail()
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
