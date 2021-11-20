import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { AuthorDAO } from './DAO/author.DAO';
import { BookDAO } from '../book/DAO/book.DAO';
import { AuthorService } from './author.service';

class AuthorModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn();
  static findOne = jest.fn();
  static findOneAndUpdate = jest.fn();
  static deleteOne = jest.fn().mockResolvedValue(true);
}

class BookModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn();
  static findOne = jest.fn();
  static findOneAndUpdate = jest.fn();
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorDAO,
        {
          provide: getModelToken('Author'),
          useValue: AuthorModel,
        },
        AuthorService,
        BookDAO,
        {
          provide: getModelToken('Book'),
          useValue: BookModel,
        },
        Logger,
        UtilsService,
      ],
    }).compile();
    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
