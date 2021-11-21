import { HttpException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { AuthorDAO } from '../DAO/author.DAO';
import { BookDAO } from '../DAO/book.DAO';
import { AuthorService } from './author.service';
import * as sinon from 'sinon';
import { ObjectId, Types } from 'mongoose';

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
  let bookDAO: BookDAO;
  let authorDAO: AuthorDAO;

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
    bookDAO = module.get<BookDAO>(BookDAO);
    authorDAO = module.get<AuthorDAO>(AuthorDAO);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuthor', () => {
    it('should create author', async () => {
      const author = {
        name: 'John Doe',
        books: [],
      };

      const authorCreated = {
        ...author,
        _id: '6194c9e50f21984903940922',
      };

      sinon.stub(authorDAO, 'createAuthor').resolves(authorCreated);

      const response = await service.createAuthor(author);
      expect(response).toEqual(authorCreated);
    });

    afterEach(() => {
      if ((authorDAO.createAuthor as any).restore) {
        (authorDAO.createAuthor as any).restore();
      }
    });
  });

  describe('getAuthor', () => {
    it('should get an author ', async () => {
      const author = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      sinon.stub(authorDAO, 'getAuthor').resolves(author);

      const response = await service.getAuthor('6194c9e50f21984903940922');
      expect(response).toEqual(author);
    });

    it('should return httpException', async () => {
      sinon.stub(authorDAO, 'getAuthor').resolves();

      await expect(service.getAuthor('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((authorDAO.getAuthor as any).restore) {
        (authorDAO.getAuthor as any).restore();
      }
    });
  });

  describe('getAuthors', () => {
    it('should get authors', async () => {
      const authors = [
        {
          _id: '6194c9e50f21984903940922',
          name: 'John Doe',
          books: [],
        },
      ];

      sinon.stub(authorDAO, 'getAuthors').resolves(authors);

      const response = await service.getAuthors();
      expect(response).toEqual(authors);
    });

    afterEach(() => {
      if ((authorDAO.getAuthors as any).restore) {
        (authorDAO.getAuthors as any).restore();
      }
    });
  });

  describe('updateAuthor', () => {
    it('should update author', async () => {
      const authorUpdate = {
        _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
        name: 'John Doe',
        books: [
          {
            _id: new Types.ObjectId('6194c9e50f21984903943221') as unknown as ObjectId,
            title: 'Mock book 2',
            isbn: '68549864984532965447255',
            authors: [],
            pages: 200,
          },
        ],
      };

      const authorSaved = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [
          {
            _id: new Types.ObjectId('6194c9e50f21984903943222') as unknown as ObjectId,
            title: 'Mock book 2',
            isbn: '68549864984532965447255',
            authors: [],
            pages: 200,
          },
        ],
      };

      const bookSaved = {
        _id: new Types.ObjectId('6194c9e50f21984903943222') as unknown as ObjectId,
        title: 'Mock book 2',
        isbn: '68549864984532965447255',
        authors: [],
        pages: 200,
      };

      sinon.stub(bookDAO, 'getBook').resolves(bookSaved);

      sinon.stub(bookDAO, 'updateBook').resolves();

      sinon.stub(authorDAO, 'getAuthor').resolves(authorSaved);

      sinon.stub(authorDAO, 'updateAuthor').resolves({ modifiedCount: 1, matchedCount: 1 });

      let response = await service.updateAuthor(authorUpdate);
      expect(response).toEqual({ message: 'Author updated' });

      authorUpdate.books = [];

      response = await service.updateAuthor(authorUpdate);
      expect(response).toEqual({ message: 'Author updated' });
    });

    it('should return httpException', async () => {
      const authorUpdate = {
        _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
        name: 'John Doe',
        books: [],
      };

      const authorSaved = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      const bookSaved = {
        _id: new Types.ObjectId('6194c9e50f21984903943222') as unknown as ObjectId,
        title: 'Mock book 2',
        isbn: '68549864984532965447255',
        authors: [],
        pages: 200,
      };

      sinon.stub(bookDAO, 'getBook').resolves(bookSaved);

      sinon.stub(bookDAO, 'updateBook').resolves();

      sinon.stub(authorDAO, 'getAuthor').resolves(authorSaved);

      sinon.stub(authorDAO, 'updateAuthor').resolves({ modifiedCount: 0, matchedCount: 1 });

      await expect(service.updateAuthor(authorUpdate)).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((bookDAO.getBook as any).restore) {
        (bookDAO.getBook as any).restore();
      }
      if ((bookDAO.updateBook as any).restore) {
        (bookDAO.updateBook as any).restore();
      }
      if ((authorDAO.getAuthor as any).restore) {
        (authorDAO.getAuthor as any).restore();
      }
      if ((authorDAO.updateAuthor as any).restore) {
        (authorDAO.updateAuthor as any).restore();
      }
    });
  });

  describe('deleteBook', () => {
    it('should delete book', async () => {
      sinon.stub(bookDAO, 'deleteBook').resolves();
      sinon.stub(bookDAO, 'getBooks').resolves([]);
      sinon.stub(authorDAO, 'deleteAuthor').resolves({ deletedCount: 1 });

      const response = await service.deleteAuthor('6194c9e50f21984903940922');
      expect(response).toEqual({ message: 'Author deleted' });
    });

    it('should return httpException', async () => {
      sinon.stub(bookDAO, 'deleteBook').resolves();
      sinon.stub(bookDAO, 'getBooks').resolves([]);
      sinon.stub(authorDAO, 'deleteAuthor').resolves({ deletedCount: 0 });

      await expect(service.deleteAuthor('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((bookDAO.deleteBook as any).restore) {
        (bookDAO.deleteBook as any).restore();
      }
      if ((bookDAO.getBook as any).restore) {
        (bookDAO.getBook as any).restore();
      }
      if ((authorDAO.deleteAuthor as any).restore) {
        (authorDAO.deleteAuthor as any).restore();
      }
    });
  });

  describe('getCsv', () => {
    it('should get csv', async () => {
      const authors = [
        {
          _id: '6194c9e50f21984903940922',
          name: 'John Doe',
          books: [],
        },
      ];

      sinon.stub(authorDAO, 'getAuthors').resolves(authors);

      const response = await service.getCsv();
      expect(typeof response).toBe('string');
    });

    afterEach(() => {
      if ((authorDAO.getAuthors as any).restore) {
        (authorDAO.getAuthors as any).restore();
      }
    });
  });
});
