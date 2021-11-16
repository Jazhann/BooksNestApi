import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class UserDTO {
  @ApiProperty()
  _id: ObjectId;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ required: false, nullable: true })
  phone: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  dni: string;
  @ApiProperty({ required: false, nullable: true })
  city: string;
  @ApiProperty({ required: false, nullable: true })
  birthDate: Date;
  @ApiHideProperty()
  registrationDate: Date;
  @ApiHideProperty()
  permissions: {
    admin: boolean;
  };
  @ApiHideProperty()
  isActive: boolean;
}
