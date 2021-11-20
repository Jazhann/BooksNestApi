import { Injectable, Inject, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Parser, transforms as tf } from 'json2csv';

import { AuthorDTO } from '../author/DTOs/author.DTO';
import { AuthorDAO } from '../author/DAO/author.DAO';
import { Constants } from '../common/constants';
import { BookDAO } from '../book/DAO/book.DAO';
import { AuthorUpdateDTO } from './DTOs/authorUpdate.DTO';
import { BookUpdateDTO } from 'src/book/DTOs/bookUpdate.DTO';
import { UtilsService } from 'src/common/services/Utils.service';

@Injectable()
export class AuthorService {
  constructor(
    @Inject('AuthorDAO') private readonly authorDAO: AuthorDAO,
    @Inject('BookDAO') private readonly bookDAO: BookDAO,
    @Inject('UtilsService') private readonly utils: UtilsService,
    private readonly logger: Logger,
  ) {}

  /**
   * It creates a new Author
   * @param newAuthor object
   * @returns new author object created
   */
  async createAuthor(newAuthor: AuthorDTO) {
    let checkAuthor;
    try {
      checkAuthor = await this.authorDAO.getAuthor({ name: newAuthor.name });
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
    }

    if (checkAuthor != null) {
      this.utils.send(Constants.authorAlreadyExists, Constants.httpStatus403, AuthorService.name);
    } else {
      let author;
      try {
        author = await this.authorDAO.createAuthor(newAuthor);
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
      }
      this.logger.log('Author created successfully: ' + JSON.stringify(author), AuthorService.name);
      return author;
    }
  }

  /**
   * It get an Author by id
   * @param id string
   * @returns author object
   */
  async getAuthor(id: string) {
    let author;
    try {
      author = await this.authorDAO.getAuthor({ _id: new Types.ObjectId(id) });
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
    }

    if (author) {
      this.logger.log('Author got successfully: ' + JSON.stringify(author), AuthorService.name);
      return author;
    } else {
      this.utils.send(Constants.authorNotFound, Constants.httpStatus404, AuthorService.name);
    }
  }

  /**
   * It get all Authors
   * @returns author object array
   */
  async getAuthors() {
    let authors;
    try {
      authors = await this.authorDAO.getAuthors({});
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
    }
    this.logger.log('Authors got successfully', AuthorService.name);
    return authors;
  }

  /**
   * It update an author
   * @param author object
   * @returns update log
   */
  async updateAuthor(author: AuthorUpdateDTO) {
    const oldAuthor = await this.authorDAO.getAuthor({ _id: author._id });
    const differentsArrays = JSON.stringify(oldAuthor.books.sort()) !== JSON.stringify(author.books.sort());

    if (differentsArrays && author.books.length > 0) {
      await this.updateBooks(author, oldAuthor);
    } else if (differentsArrays && author.books.length === 0) {
      await this.updateBooksEmptyArray(author, oldAuthor);
    }
    let updatedInfo;
    try {
      updatedInfo = await this.authorDAO.updateAuthor(author);
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
    }

    if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
      this.logger.log('Author updated successfully', AuthorService.name);
      return { message: Constants.authorUpdated };
    } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
      this.utils.send(Constants.authorNotUpdated, Constants.httpStatus202, AuthorService.name);
    } else {
      this.utils.send(Constants.authorNotFound, Constants.httpStatus404, AuthorService.name);
    }
  }

  /**
   * It update all author books when books array containt authors
   * @param author author to update
   * @param oldAuthor author saved
   */
  private async updateBooks(author: AuthorUpdateDTO, oldAuthor) {
    for (const book of author.books) {
      let savedBook: BookUpdateDTO;
      try {
        savedBook = await this.bookDAO.getBook({ _id: book });
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
      }

      let authors = savedBook.authors;

      let included = false;
      authors.forEach((at) => {
        if (at._id.toString() === author._id.toString()) {
          included = true;
        }
      });

      if (!included) {
        authors.push(oldAuthor);
      } else {
        authors = authors.filter((at) => at.toString() !== author._id.toString());
      }

      const updatedBook = {
        _id: savedBook._id,
        title: savedBook.title,
        isbn: savedBook.isbn,
        pages: savedBook.pages,
        authors: [...new Set(authors)],
      };
      try {
        await this.bookDAO.updateBook(updatedBook);
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
      }
    }
  }

  /**
   * It update all author books when books array is empty
   * @param author author to update
   * @param oldAuthor author saved
   */
  private async updateBooksEmptyArray(author: AuthorUpdateDTO, oldAuthor) {
    for (const book of oldAuthor.books) {
      const savedBook = await this.bookDAO.getBook({ _id: book });
      const updatedBook = {
        _id: savedBook._id,
        title: savedBook.title,
        isbn: savedBook.isbn,
        pages: savedBook.pages,
        authors: savedBook.authors.filter((at) => at.toString() !== author._id.toString()),
      };
      try {
        await this.bookDAO.updateBook(updatedBook);
      } catch (error) {
        this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
      }
    }
  }

  /**
   * It delete an author and books related to this author
   * @param id string, author id
   * @returns deletion log
   */
  async deleteAuthor(id: string) {
    let deletedInfo;
    try {
      deletedInfo = await this.authorDAO.deleteAuthor(new Types.ObjectId(id));
    } catch (error) {
      this.utils.send(error.message, Constants.httpStatus400, AuthorService.name);
    }

    if (deletedInfo.deletedCount === 1) {
      const books = await this.bookDAO.getBooks({ authors: id });
      for (const book of books) {
        await this.bookDAO.deleteBook(book._id);
      }
      this.logger.log('Authors deleted successfully', AuthorService.name);
      return { message: Constants.authorDeleted };
    } else {
      this.utils.send(Constants.authorNotFound, Constants.httpStatus404, AuthorService.name);
    }
  }

  /**
   * It gets all authors and map to csv
   * @returns csv string
   */
  async getCsv() {
    const authors = await this.getAuthors();
    const authorsMapped = authors.map((author) => {
      return {
        _id: author.id,
        name: author.name,
        books: author.books,
      };
    });
    const fields = ['_id', 'name', 'books'];
    const transforms = [tf.unwind({ paths: ['books'] })];
    const parser = new Parser({ fields, transforms });
    const csv = parser.parse(authorsMapped);
    this.logger.log('Csv generated: ' + JSON.stringify(csv), AuthorService.name);
    return csv;
  }
}
