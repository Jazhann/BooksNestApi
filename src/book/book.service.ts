import { Injectable, Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { Parser, transforms as tf } from 'json2csv';

import { BookDTO } from 'src/book/DTOs/book.DTO';
import { BookDAO } from 'src/book/DAO/book.DAO';
import { Constants } from 'src/common/constants';
import { AuthorDAO } from 'src/author/DAO/author.DAO';
import { BookUpdateDTO } from './DTOs/bookUpdate.DTO';
import * as exception from 'src/common/helpers/exception.helper';

@Injectable()
export class BookService {
  constructor(
    @Inject('BookDAO') private readonly bookDAO: BookDAO,
    @Inject('AuthorDAO') private readonly authorDAO: AuthorDAO,
  ) {}

  /**
   * It creates a new Book
   * @param newBook object
   * @returns new book object created
   */
  async createBook(newBook: BookDTO) {
    const checkBook = await this.bookDAO.getBook({
      isbn: newBook.isbn.toLocaleLowerCase(),
    });

    if (checkBook != null) {
      exception.send(Constants.bookAlreadyExists, Constants.httpStatus403);
    } else {
      const book = await this.bookDAO.createBook(newBook);
      for (const author of book.authors) {
        const updatedAuthor = await this.authorDAO.getAuthor({ _id: author });
        updatedAuthor.books.push(book);
        await this.authorDAO.updateAuthor(updatedAuthor);
      }
      return book;
    }
  }

  /**
   * It get an Book by id
   * @param id string
   * @returns book object
   */
  async getBook(id: string) {
    const book = await this.bookDAO.getBook({ _id: new Types.ObjectId(id) });

    if (book) {
      return book;
    } else {
      exception.send(Constants.bookNotFound, Constants.httpStatus404);
    }
  }

  /**
   * It get all Books
   * @returns book object array
   */
  async getBooks() {
    return await this.bookDAO.getBooks({});
  }

  /**
   * It update an book
   * @param book object
   * @returns update log
   */
  async updateBook(book: BookUpdateDTO) {
    const oldBook = await this.bookDAO.getBook({ _id: book._id });
    const differentsArrays = JSON.stringify(oldBook.authors.sort()) !== JSON.stringify(book.authors.sort());

    if (differentsArrays && book.authors.length > 0) {
      await this.updateAuthors(book, oldBook);
    } else if (differentsArrays && book.authors.length === 0) {
      await this.updateAuthorsArrayEmpty(book, oldBook);
    }

    const updatedInfo = await this.bookDAO.updateBook(book);

    if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
      return { message: Constants.bookUpdated };
    } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
      exception.send(Constants.bookNotUpdated, Constants.httpStatus202);
    } else {
      exception.send(Constants.bookNotFound, Constants.httpStatus404);
    }
  }

  /**
   * It update all authors when authors array containt authors
   * @param book book to update
   * @param oldBook book saved
   */
  private async updateAuthors(book: BookUpdateDTO, oldBook) {
    for (const author of book.authors) {
      const savedAuthor = await this.authorDAO.getAuthor({ _id: author });

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
      await this.authorDAO.updateAuthor(updatedAuthor);
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
      await this.authorDAO.updateAuthor(updatedAuthor);
    }
  }

  /**
   * It delete an book and the reference in authors
   * @param id string, book id
   * @returns deletion log
   */
  async deleteBook(id: string) {
    const deletedInfo = await this.bookDAO.deleteBook(new Types.ObjectId(id));

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
      return { message: Constants.bookDeleted };
    } else {
      exception.send(Constants.bookNotFound, Constants.httpStatus404);
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
    return csv;
  }
}
