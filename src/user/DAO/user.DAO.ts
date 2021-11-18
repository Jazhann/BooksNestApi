import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDTO } from 'src/user/DTOs/user.DTO';
import { User } from 'src/user/interfaces/user.interface';
import { UserUpdateDTO } from '../DTOs/userUpdate.DTO';

@Injectable()
export class UserDAO {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(newUser: UserDTO): Promise<User> {
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getUser(params): Promise<User> {
    return this.userModel.findOne(params).exec();
  }

  async getUsers(params): Promise<User[]> {
    return this.userModel.find(params).exec();
  }

  async updateUser(user: UserUpdateDTO): Promise<any> {
    return this.userModel.updateOne({ _id: user._id }, user);
  }

  async deleteUser(id): Promise<any> {
    return this.userModel.deleteOne({ _id: id });
  }
}
