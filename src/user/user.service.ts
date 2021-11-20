import { Injectable, Inject, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { UserDTO } from '../user/DTOs/user.DTO';
import { UserDAO } from '../user/DAO/user.DAO';
import { Constants } from '../common/constants';
import { UserUpdateDTO } from './DTOs/userUpdate.DTO';
import { UtilsService } from '../common/services/Utils.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserDAO') private readonly userDAO: UserDAO,
    @Inject('UtilsService') private readonly utils: UtilsService,
    private readonly logger: Logger,
  ) {}

  /**
   * It creates a new User
   * @param newUser object
   * @returns new user object created
   */
  async createUser(newUser: UserDTO) {
    let checkUser;
    try {
      checkUser = await this.userDAO.getUser(newUser.email.toLocaleLowerCase());
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, UserService.name);
    }

    if (checkUser != null) {
      this.utils.send(Constants.userAlreadyExists, Constants.httpStatus403, UserService.name);
    } else {
      newUser.password = await bcrypt.hash(newUser.password, Constants.rounds);
      let user;
      try {
        user = await this.userDAO.createUser(newUser);
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, UserService.name);
      }
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
    let user;
    try {
      user = await this.userDAO.getUser({ _id: new Types.ObjectId(id) });
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, UserService.name);
    }

    if (user) {
      this.logger.log('User got successfully: ' + JSON.stringify(user), UserService.name);
      return user;
    } else {
      this.utils.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
    }
  }

  /**
   * It get all Users
   * @returns user object array
   */
  async getUsers() {
    let users;
    try {
      users = await this.userDAO.getUsers({});
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, UserService.name);
    }
    this.logger.log('User gots successfully', UserService.name);
    return users;
  }

  /**
   * It update an user
   * @param user object
   * @returns update log
   */
  async updateUser(user: UserUpdateDTO) {
    let oldUser;
    let checkUserEmail;
    try {
      oldUser = await this.getUser(user._id.toString());
      checkUserEmail = await this.userDAO.getUser({ email: user.email.toLocaleLowerCase() });
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, UserService.name);
    }

    if (checkUserEmail != null && checkUserEmail._id.toString() !== oldUser._id.toString()) {
      this.utils.send(Constants.userWithThisEmail, Constants.httpStatus403, UserService.name);
    } else {
      if (user.password !== null) {
        if (oldUser.password !== user.password) {
          user.password = await bcrypt.hash(user.password, Constants.rounds);
        }
      } else {
        user.password = oldUser.password;
      }

      let updatedInfo;
      try {
        updatedInfo = await this.userDAO.updateUser(user);
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, UserService.name);
      }

      if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
        this.logger.log('User updated successfully', UserService.name);
        return { message: Constants.userUpdated };
      } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
        this.utils.send(Constants.userNotUpdated, Constants.httpStatus202, UserService.name);
      } else {
        this.utils.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
      }
    }
  }

  /**
   * It delete an user
   * @param id string, user id
   * @returns deletion log
   */
  async deleteUser(id: string) {
    let deletedInfo;
    try {
      deletedInfo = await this.userDAO.deleteUser(new Types.ObjectId(id));
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, UserService.name);
    }

    if (deletedInfo.deletedCount === 1) {
      this.logger.log('User deleted successfully', UserService.name);
      return { message: Constants.userDeleted };
    } else {
      this.utils.send(Constants.userNotFound, Constants.httpStatus404, UserService.name);
    }
  }
}
