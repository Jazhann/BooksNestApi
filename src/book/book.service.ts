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
      throw new HttpException({ message: Constants.bookAlreadyExists }, Constants.httpStatus403);
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
    const book = await this.bookDAO.getBook({ _id: new Types.ObjectId(id) });

    if (book) {
      return book;
    } else {
      throw new HttpException({ message: Constants.bookNotFound }, Constants.httpStatus404);
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
  async updateBook(book: BookDTO) {
    const updatedInfo = await this.bookDAO.updateBook(book);

    if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
      return { message: Constants.bookUpdated };
    } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
      throw new HttpException({ message: Constants.bookNotUpdated }, Constants.httpStatus202);
    } else {
      throw new HttpException({ message: Constants.bookNotFound }, Constants.httpStatus404);
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
      throw new HttpException({ message: Constants.bookNotFound }, Constants.httpStatus404);
    }
  }
}
