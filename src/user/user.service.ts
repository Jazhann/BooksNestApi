import { Injectable, Inject, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { UserDTO } from '../user/DTOs/user.DTO';
import { UserDAO } from '../user/DAO/user.DAO';
import { Constants } from '../common/constants';

import * as exception from '../common/helpers/exception.helper';
import { UserUpdateDTO } from './DTOs/userUpdate.DTO';

@Injectable()
export class UserService {
  constructor(@Inject('UserDAO') private readonly userDAO: UserDAO, private readonly logger: Logger) {}

  /**
   * It creates a new User
   * @param newUser object
   * @returns new user object created
   */
  async createUser(newUser: UserDTO) {
    const checkUser = await this.userDAO.getUser(newUser.email.toLocaleLowerCase());

    if (checkUser != null) {
      exception.send(Constants.userAlreadyExists, Constants.httpStatus403, UserService.name);
    } else {
      newUser.password = await bcrypt.hash(newUser.password, Constants.rounds);
      const user = await this.userDAO.createUser(newUser);
      this.logger.log('User created successfully: ' + JSON.stringify(user), UserService.name);
      return user;
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
      this.logger.log('User got successfully: ' + JSON.stringify(user), UserService.name);
      return user;
    } else {
      exception.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
    }
  }

  /**
   * It get all Users
   * @returns user object array
   */
  async getUsers() {
    this.logger.log('User gots successfully', UserService.name);
    return await this.userDAO.getUsers({});
  }

  /**
   * It update an user
   * @param user object
   * @returns update log
   */
  async updateUser(user: UserUpdateDTO) {
    const oldUser = await this.getUser(user._id.toString());
    const checkUserEmail = await this.userDAO.getUser({
      email: user.email.toLocaleLowerCase(),
    });

    if (checkUserEmail != null && checkUserEmail._id.toString() !== oldUser._id.toString()) {
      exception.send(Constants.userWithThisEmail, Constants.httpStatus403, UserService.name);
    } else {
      if (user.password !== null) {
        if (oldUser.password !== user.password) {
          user.password = await bcrypt.hash(user.password, Constants.rounds);
        }
      } else {
        user.password = oldUser.password;
      }

      const updatedInfo = await this.userDAO.updateUser(user);
      if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
        this.logger.log('User updated successfully', UserService.name);
        return { message: Constants.userUpdated };
      } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
        exception.send(Constants.userNotUpdated, Constants.httpStatus202, UserService.name);
      } else {
        exception.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
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
      this.logger.log('User deleted successfully', UserService.name);
      return { message: Constants.userDeleted };
    } else {
      exception.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
    }
  }
}
