import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

import { BookDTO } from 'src/book/DTOs/book.DTO';
import { BookDAO } from 'src/book/DAO/book.DAO';
import { Constants } from 'src/common/constants';
import { AuthorDAO } from 'src/author/DAO/author.DAO';

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
      throw new HttpException(
        {
          message: Constants.bookAlreadyExists,
        },
        Constants.ok,
      );
    } else {
      const book = await this.bookDAO.createBook(newBook);
      for (const author of book.authors) {
        const authorSaved = await this.authorDAO.getAuthor({ _id: author });
        authorSaved.books.push(book);
        await this.authorDAO.updateAuthor(authorSaved);
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
    return await this.bookDAO.getBook({ _id: new Types.ObjectId(id) });
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
  async updateBook(book: BookDTO) {
    return await this.bookDAO.updateBook(book);
  }

  /**
   * It delete an book
   * @param id string, book id
   * @returns deletion log
   */
  async deleteBook(id: string) {
    const deletedBook = await this.bookDAO.deleteBook(new Types.ObjectId(id));
    return deletedBook;
  }
}
