import { ObjectId } from 'mongoose';

export class UserDTO {
  _id: ObjectId;
  email: string;
  password: string;
  phone: number;
  name: string;
  dni: string;
  city: string;
  birthDate: Date;
  registrationDate: Date;
  permissions: {
    admin: boolean;
  };
  isActive: boolean;
}
