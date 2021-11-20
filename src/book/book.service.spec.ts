import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { AuthorDAO } from '../author/DAO/author.DAO';
import { BookService } from './book.service';
import { BookDAO } from './DAO/book.DAO';

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

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorDAO,
        {
          provide: getModelToken('Author'),
          useValue: AuthorModel,
        },
        BookDAO,
        {
          provide: getModelToken('Book'),
          useValue: BookModel,
        },
        BookService,
        Logger,
        UtilsService,
      ],
    }).compile();
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
