import { Injectable, Inject, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Parser, transforms as tf } from 'json2csv';

import { BookDTO } from '../book/DTOs/book.DTO';
import { BookDAO } from '../DAO/book.DAO';
import { Constants } from '../common/constants';
import { AuthorDAO } from '../DAO/author.DAO';
import { BookUpdateDTO } from './DTOs/bookUpdate.DTO';
import { AuthorUpdateDTO } from '../author/DTOs/authorUpdate.DTO';
import { UtilsService } from '../common/services/Utils.service';

@Injectable()
export class BookService {
  constructor(
    @Inject('BookDAO') private readonly bookDAO: BookDAO,
    @Inject('AuthorDAO') private readonly authorDAO: AuthorDAO,
    @Inject('UtilsService') private readonly utils: UtilsService,
    private readonly logger: Logger,
  ) {}

  /**
   * It creates a new Book
   * @param newBook object
   * @returns new book object created
   */
  async createBook(newBook: BookDTO) {
    await this.checkBook(newBook);
    let book;
    try {
      await this.bookDAO.createBook(newBook);
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }
    for (const author of book.authors) {
      const updatedAuthor = await this.authorDAO.getAuthor({ _id: author });
      updatedAuthor.books.push(book);
      await this.authorDAO.updateAuthor(updatedAuthor);
    }
    this.logger.log('Book created successfully: ' + JSON.stringify(book), BookService.name);
    return book;
  }

  /**
   * It check if book isbn is already used
   * @param book object book
   * @returns
   */
  private async checkBook(book) {
    let checkBook;
    try {
      checkBook = await this.bookDAO.getBook({ isbn: book.isbn });
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }

    if (checkBook != null) {
      this.utils.sendException(Constants.bookAlreadyExists, Constants.httpStatus403, BookService.name);
    } else {
      return;
    }
  }

  /**
   * It get an Book by id
   * @param id string
   * @returns book object
   */
  async getBook(id: string) {
    let book;
    try {
      book = await this.bookDAO.getBook({ _id: new Types.ObjectId(id) });
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }

    if (book) {
      this.logger.log('Book got successfully: ' + JSON.stringify(book), BookService.name);
      return book;
    } else {
      this.utils.sendException(Constants.bookNotFound, Constants.httpStatus404, BookService.name);
    }
  }

  /**
   * It get all Books
   * @returns book object array
   */
  async getBooks() {
    let books;
    try {
      books = await this.bookDAO.getBooks({});
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }
    this.logger.log('Books got successfully', BookService.name);
    return books;
  }

  /**
   * It update an book
   * @param book object
   * @returns update log
   */
  async updateBook(book: BookUpdateDTO) {
    let oldBook;
    try {
      oldBook = await this.bookDAO.getBook({ _id: book._id });
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }

    if (oldBook.isbn !== book.isbn) {
      await this.checkBook(book);
    }

    const differentsArrays = JSON.stringify(oldBook.authors.sort()) !== JSON.stringify(book.authors.sort());

    if (differentsArrays && book.authors.length > 0) {
      await this.updateAuthors(book, oldBook);
    } else if (differentsArrays && book.authors.length === 0) {
      await this.updateAuthorsArrayEmpty(book, oldBook);
    }

    let updatedInfo;
    try {
      updatedInfo = await this.bookDAO.updateBook(book);
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }

    if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
      this.logger.log('Book updated successfully', BookService.name);
      return { message: Constants.bookUpdated };
    } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
      this.utils.sendException(Constants.bookNotUpdated, Constants.httpStatus202, BookService.name);
    } else {
      this.utils.sendException(Constants.bookNotFound, Constants.httpStatus404, BookService.name);
    }
  }

  /**
   * It update all authors when authors array containt authors
   * @param book book to update
   * @param oldBook book saved
   */
  private async updateAuthors(book: BookUpdateDTO, oldBook) {
    for (const author of book.authors) {
      let savedAuthor: AuthorUpdateDTO;
      try {
        savedAuthor = await this.authorDAO.getAuthor({ _id: author });
      } catch (error) {
        this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
      }

      let books = savedAuthor.books;

      let included = false;
      books.forEach((bk) => {
        if (bk._id.toString() === book._id.toString()) {
          included = true;
        }
      });

      if (!included) {
        books.push(oldBook);
      } else {
        books = books.filter((bk) => bk.toString() !== book._id.toString());
      }

      const updatedAuthor = {
        _id: savedAuthor._id,
        name: savedAuthor.name,
        books: [...new Set(books)],
      };
      try {
        await this.authorDAO.updateAuthor(updatedAuthor);
      } catch (error) {
        this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
      }
    }
  }

  /**
   * It update all authors when authors array is empty
   * @param book book to update
   * @param oldBook book saved
   */
  private async updateAuthorsArrayEmpty(book: BookUpdateDTO, oldBook) {
    for (const author of oldBook.authors) {
      const savedAuthor = await this.authorDAO.getAuthor({ _id: author });
      const updatedAuthor = {
        _id: savedAuthor._id,
        name: savedAuthor.name,
        books: savedAuthor.books.filter((bk) => bk.toString() !== book._id.toString()),
      };
      try {
        await this.authorDAO.updateAuthor(updatedAuthor);
      } catch (error) {
        this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
      }
    }
  }

  /**
   * It delete an book and the reference in authors
   * @param id string, book id
   * @returns deletion log
   */
  async deleteBook(id: string) {
    let deletedInfo;
    try {
      deletedInfo = await this.bookDAO.deleteBook(new Types.ObjectId(id));
    } catch (error) {
      this.utils.sendException(error.message, Constants.httpStatus400, BookService.name);
    }

    if (deletedInfo.deletedCount === 1) {
      const authors = await this.authorDAO.getAuthors({ books: id });
      for (const author of authors) {
        const updatedAuthor = {
          _id: author._id,
          name: author.name,
          books: author.books.filter((book) => book.toString() !== id),
        };
        this.authorDAO.updateAuthor(updatedAuthor);
      }
      this.logger.log('Book deleted successfully', BookService.name);
      return { message: Constants.bookDeleted };
    } else {
      this.utils.sendException(Constants.bookNotFound, Constants.httpStatus404, BookService.name);
    }
  }

  /**
   * It gets all books and map to csv
   * @returns csv string
   */
  async getCsv() {
    const books = await this.getBooks();
    const booksMapped = books.map((book) => {
      return {
        _id: book._id,
        title: book.title,
        isbn: book.isbn,
        pages: book.pages,
        authors: book.authors,
      };
    });
    const fields = ['_id', 'title', 'isbn', 'pages', 'authors'];
    const transforms = [tf.unwind({ paths: ['authors'] })];
    const parser = new Parser({ fields, transforms });
    const csv = parser.parse(booksMapped);
    this.logger.log('Csv generated: ' + JSON.stringify(csv), BookService.name);
    return csv;
  }
}
