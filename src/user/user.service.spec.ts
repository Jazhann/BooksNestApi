import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { UserDAO } from './DAO/user.DAO';
import { UserService } from './user.service';

class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn();
  static findOne = jest.fn();
  static findOneAndUpdate = jest.fn();
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDAO,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        UserService,
        Logger,
        UtilsService,
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
