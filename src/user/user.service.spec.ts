import { HttpException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { UserDAO } from '../DAO/user.DAO';
import { UserService } from './user.service';
import * as sinon from 'sinon';
import { ObjectId, Types } from 'mongoose';

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
  let userDAO: UserDAO;

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
    userDAO = module.get<UserDAO>(UserDAO);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const user = {
        email: 'a@a.com',
        password: '123456789',
        name: 'John Doe',
      };

      const userCreated = {
        ...user,
        _id: '6194c9e50f21984903940922',
      };

      sinon.stub(userDAO, 'getUser').resolves();

      sinon.stub(userDAO, 'createUser').resolves(userCreated);

      const response = await service.createUser(user);
      expect(response).toEqual(userCreated);
    });

    it('should return httpException', async () => {
      const user = {
        email: 'a@a.com',
        password: '123456789',
        name: 'John Doe',
      };

      const userCreated = {
        ...user,
        _id: '6194c9e50f21984903940922',
      };

      sinon.stub(userDAO, 'getUser').resolves(userCreated);

      sinon.stub(userDAO, 'createUser').resolves(userCreated);

      await expect(service.createUser(user)).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((userDAO.createUser as any).restore) {
        (userDAO.createUser as any).restore();
      }
      if ((userDAO.getUser as any).restore) {
        (userDAO.getUser as any).restore();
      }
    });
  });

  describe('getUser', () => {
    it('should get an user ', async () => {
      const user = {
        _id: '6194c9e50f21984903940922',
        email: 'a@a.com',
        password: '123456789',
        name: 'John Doe',
      };

      sinon.stub(userDAO, 'getUser').resolves(user);

      const response = await service.getUser('6194c9e50f21984903940922');
      expect(response).toEqual(user);
    });

    it('should return httpException', async () => {
      sinon.stub(userDAO, 'getUser').resolves();

      await expect(service.getUser('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((userDAO.getUser as any).restore) {
        (userDAO.getUser as any).restore();
      }
    });
  });

  describe('getAuthors', () => {
    it('should get authors', async () => {
      const users = [
        {
          _id: '6194c9e50f21984903940922',
          email: 'a@a.com',
          password: '123456789',
          name: 'John Doe',
        },
      ];

      sinon.stub(userDAO, 'getUsers').resolves(users);

      const response = await service.getUsers();
      expect(response).toEqual(users);
    });

    afterEach(() => {
      if ((userDAO.getUsers as any).restore) {
        (userDAO.getUsers as any).restore();
      }
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userSaved = {
        _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
        email: 'a@a.com',
        password: '123456789',
        name: 'John Doe',
      };

      const userUpdate = {
        ...userSaved,
        phone: 666666666,
      };

      sinon.stub(userDAO, 'getUser').resolves(userSaved);

      sinon.stub(userDAO, 'updateUser').resolves({ modifiedCount: 1, matchedCount: 1 });

      const response = await service.updateUser(userUpdate);
      expect(response).toEqual({ message: 'User updated' });
    });

    it('should return httpException', async () => {
      const userSaved = {
        _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
        email: 'a@a.com',
        password: '123456789',
        name: 'John Doe',
      };

      const userUpdate = {
        ...userSaved,
        phone: 666666666,
      };

      sinon.stub(userDAO, 'getUser').resolves(userSaved);

      sinon.stub(userDAO, 'updateUser').resolves({ modifiedCount: 0, matchedCount: 1 });

      await expect(service.updateUser(userUpdate)).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((userDAO.getUser as any).restore) {
        (userDAO.getUser as any).restore();
      }
      if ((userDAO.updateUser as any).restore) {
        (userDAO.updateUser as any).restore();
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      sinon.stub(userDAO, 'deleteUser').resolves({ deletedCount: 1 });

      const response = await service.deleteUser('6194c9e50f21984903940922');
      expect(response).toEqual({ message: 'User deleted' });
    });

    it('should return httpException', async () => {
      sinon.stub(userDAO, 'deleteUser').resolves({ deletedCount: 0 });

      await expect(service.deleteUser('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((userDAO.deleteUser as any).restore) {
        (userDAO.deleteUser as any).restore();
      }
    });
  });
});
