import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { UserDTO } from 'src/user/DTOs/user.DTO';
import { UserDAO } from 'src/user/DAO/user.DAO';
import { Constants } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(@Inject('UserDAO') private readonly userDAO: UserDAO) {}

  /**
   * It creates a new User
   * @param newUser object
   * @returns new user object created
   */
  async createUser(newUser: UserDTO) {
    const checkUser = await this.userDAO.getUser(newUser.email.toLocaleLowerCase());

    if (checkUser != null) {
      throw new HttpException({ message: Constants.userAlreadyExists }, Constants.httpStatus403);
    } else {
      newUser.password = await bcrypt.hash(newUser.password, Constants.rounds);
      return await this.userDAO.createUser(newUser);
    }
  }

  /**
   * It get an User by id
   * @param id string
   * @returns user object
   */
  async getUser(id: string) {
    const user = await this.userDAO.getUser({ _id: new Types.ObjectId(id) });

    if (user) {
      return user;
    } else {
      throw new HttpException({ message: Constants.userNotFound }, Constants.httpStatus404);
    }
  }

  /**
   * It get all Users
   * @returns user object array
   */
  async getUsers() {
    return await this.userDAO.getUsers({});
  }

  /**
   * It update an user
   * @param id object, user id
   * @param user object
   * @returns update log
   */
  async updateUser(id: string, user: UserDTO) {
    const oldUser = await this.getUser(id);
    const checkUserEmail = await this.userDAO.getUser({
      email: user.email.toLocaleLowerCase(),
    });

    if (checkUserEmail != null && checkUserEmail._id.toString() !== oldUser._id.toString()) {
      throw new HttpException({ message: Constants.userWithThisEmail }, Constants.httpStatus200);
    } else {
      if (user.password !== null) {
        if (oldUser.password !== user.password) {
          user.password = await bcrypt.hash(user.password, Constants.rounds);
        }
      } else {
        user.password = oldUser.password;
      }

      const updatedInfo = await this.userDAO.updateUser(new Types.ObjectId(id), user);
      if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
        return { message: Constants.userUpdated };
      } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
        throw new HttpException({ message: Constants.userNotUpdated }, Constants.httpStatus202);
      } else {
        throw new HttpException({ message: Constants.userNotFound }, Constants.httpStatus404);
      }
    }
  }

  /**
   * It delete an user
   * @param id string, user id
   * @returns deletion log
   */
  async deleteUser(id: string) {
    const deletedInfo = await this.userDAO.deleteUser(new Types.ObjectId(id));

    if (deletedInfo.deletedCount === 1) {
      return { message: Constants.userDeleted };
    } else {
      throw new HttpException({ message: Constants.userNotFound }, Constants.httpStatus404);
    }
  }
}
