import { HttpException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../common/services/Utils.service';
import { AuthorDAO } from '../DAO/author.DAO';
import { BookService } from './book.service';
import { BookDAO } from '../DAO/book.DAO';
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

describe('BookService', () => {
  let service: BookService;
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
    bookDAO = module.get<BookDAO>(BookDAO);
    authorDAO = module.get<AuthorDAO>(AuthorDAO);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBook', () => {
    it('should create book', async () => {
      const author = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      const book = {
        title: 'Mock book',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: '6194c9e50f21984903940922',
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      const bookCreated = {
        ...book,
        _id: '6194c9e50f21984903943222',
      };

      sinon.stub(bookDAO, 'getBook').resolves();

      sinon.stub(bookDAO, 'createBook').resolves(bookCreated);

      sinon.stub(authorDAO, 'getAuthor').resolves(author);

      sinon.stub(authorDAO, 'updateAuthor').resolves();

      const response = await service.createBook(book);
      expect(response).toEqual(bookCreated);
    });

    it('should return httpException', async () => {
      const author = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      const book = {
        title: 'Mock book',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: '6194c9e50f21984903940922',
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      const bookCreated = {
        ...book,
        _id: '6194c9e50f21984903943222',
      };

      sinon.stub(bookDAO, 'getBook').resolves(bookCreated);

      sinon.stub(bookDAO, 'createBook').resolves(bookCreated);

      sinon.stub(authorDAO, 'getAuthor').resolves(author);

      sinon.stub(authorDAO, 'updateAuthor').resolves();

      await expect(service.createBook(book)).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((bookDAO.getBook as any).restore) {
        (bookDAO.getBook as any).restore();
      }
      if ((bookDAO.createBook as any).restore) {
        (bookDAO.createBook as any).restore();
      }
      if ((authorDAO.getAuthor as any).restore) {
        (authorDAO.getAuthor as any).restore();
      }
      if ((authorDAO.updateAuthor as any).restore) {
        (authorDAO.updateAuthor as any).restore();
      }
    });
  });

  describe('getBook', () => {
    it('should get a book', async () => {
      const book = {
        _id: '6194c9e50f21984903943222',
        title: 'Mock book',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: '6194c9e50f21984903940922',
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      sinon.stub(bookDAO, 'getBook').resolves(book);

      const response = await service.getBook('6194c9e50f21984903943222');
      expect(response).toEqual(book);
    });

    it('should return httpException', async () => {
      sinon.stub(bookDAO, 'getBook').resolves();

      await expect(service.getBook('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((bookDAO.getBook as any).restore) {
        (bookDAO.getBook as any).restore();
      }
    });
  });

  describe('getBooks', () => {
    it('should get books', async () => {
      const books = [
        {
          _id: '6194c9e50f21984903943222',
          title: 'Mock book',
          isbn: '68549864984532965447255',
          authors: [
            {
              _id: '6194c9e50f21984903940922',
              name: 'John Doe',
              books: [],
            },
          ],
          pages: 200,
        },
      ];

      sinon.stub(bookDAO, 'getBooks').resolves(books);

      const response = await service.getBooks();
      expect(response).toEqual(books);
    });

    afterEach(() => {
      if ((bookDAO.getBooks as any).restore) {
        (bookDAO.getBooks as any).restore();
      }
    });
  });

  describe('updateBook', () => {
    it('should update book', async () => {
      const author = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      const bookSaved = {
        _id: '6194c9e50f21984903943222',
        title: 'Mock book',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: '6194c9e50f23984903940922',
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      const bookUpdate = {
        _id: new Types.ObjectId('6194c9e50f21984903943222') as unknown as ObjectId,
        title: 'Mock book 2',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      sinon.stub(bookDAO, 'getBook').resolves(bookSaved);

      sinon.stub(bookDAO, 'updateBook').resolves({ modifiedCount: 1, matchedCount: 1 });

      sinon.stub(authorDAO, 'getAuthor').resolves(author);

      sinon.stub(authorDAO, 'updateAuthor').resolves();

      let response = await service.updateBook(bookUpdate);
      expect(response).toEqual({ message: 'Book updated' });

      bookUpdate.authors = [];

      response = await service.updateBook(bookUpdate);
      expect(response).toEqual({ message: 'Book updated' });
    });

    it('should return httpException', async () => {
      const author = {
        _id: '6194c9e50f21984903940922',
        name: 'John Doe',
        books: [],
      };

      const bookSaved = {
        _id: '6194c9e50f21984903943222',
        title: 'Mock book',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: '6194c9e50f21984903940922',
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      const bookUpdate = {
        _id: new Types.ObjectId('6194c9e50f21984903943222') as unknown as ObjectId,
        title: 'Mock book 2',
        isbn: '68549864984532965447255',
        authors: [
          {
            _id: new Types.ObjectId('6194c9e50f21984903940922') as unknown as ObjectId,
            name: 'John Doe',
            books: [],
          },
        ],
        pages: 200,
      };

      sinon.stub(bookDAO, 'getBook').resolves(bookSaved);

      sinon.stub(bookDAO, 'updateBook').resolves({ modifiedCount: 0, matchedCount: 1 });

      sinon.stub(authorDAO, 'getAuthor').resolves(author);

      sinon.stub(authorDAO, 'updateAuthor').resolves();

      await expect(service.updateBook(bookUpdate)).rejects.toThrowError(HttpException);
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
      sinon.stub(bookDAO, 'deleteBook').resolves({ deletedCount: 1 });
      sinon.stub(authorDAO, 'getAuthors').resolves([]);
      sinon.stub(authorDAO, 'updateAuthor').resolves();

      const response = await service.deleteBook('6194c9e50f21984903940922');
      expect(response).toEqual({ message: 'Book deleted' });
    });

    it('should return httpException', async () => {
      sinon.stub(bookDAO, 'deleteBook').resolves({ deletedCount: 0 });
      sinon.stub(authorDAO, 'getAuthors').resolves([]);
      sinon.stub(authorDAO, 'updateAuthor').resolves();

      await expect(service.deleteBook('6194c9e50f21984903943222')).rejects.toThrowError(HttpException);
    });

    afterEach(() => {
      if ((bookDAO.deleteBook as any).restore) {
        (bookDAO.deleteBook as any).restore();
      }
      if ((authorDAO.getAuthor as any).restore) {
        (authorDAO.getAuthor as any).restore();
      }
      if ((authorDAO.updateAuthor as any).restore) {
        (authorDAO.updateAuthor as any).restore();
      }
    });
  });

  describe('getCsv', () => {
    it('should get csv', async () => {
      const books = [
        {
          _id: '6194c9e50f21984903943222',
          title: 'Mock book',
          isbn: '68549864984532965447255',
          authors: [
            {
              _id: '6194c9e50f21984903940922',
              name: 'John Doe',
              books: [],
            },
          ],
          pages: 200,
        },
      ];

      sinon.stub(bookDAO, 'getBooks').resolves(books);

      const response = await service.getCsv();
      expect(typeof response).toBe('string');
    });

    afterEach(() => {
      if ((bookDAO.getBooks as any).restore) {
        (bookDAO.getBooks as any).restore();
      }
    });
  });
});
