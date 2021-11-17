import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthorDTO } from 'src/author/DTOs/author.DTO';
import { AuthorDAO } from 'src/author/DAO/author.DAO';
import { Constants } from 'src/common/constants';
import { BookDAO } from 'src/book/DAO/book.DAO';

@Injectable()
export class AuthorService {
  constructor(
    @Inject('AuthorDAO') private readonly authorDAO: AuthorDAO,
    @Inject('BookDAO') private readonly bookDAO: BookDAO,
  ) {}

  /**
   * It creates a new Author
   * @param newAuthor object
   * @returns new author object created
   */
  async createAuthor(newAuthor: AuthorDTO) {
    const checkAuthor = await this.authorDAO.getAuthor({
      name: newAuthor.name,
    });

    if (checkAuthor != null) {
      throw new HttpException({ message: Constants.authorAlreadyExists }, Constants.httpStatus403);
    } else {
      return await this.authorDAO.createAuthor(newAuthor);
    }
  }

  /**
   * It get an Author by id
   * @param id string
   * @returns author object
   */
  async getAuthor(id: string) {
    const author = await this.authorDAO.getAuthor({
      _id: new Types.ObjectId(id),
    });

    if (author) {
      return author;
    } else {
      throw new HttpException({ message: Constants.authorNotFound }, Constants.httpStatus404);
    }
  }

  /**
   * It get all Authors
   * @returns author object array
   */
  async getAuthors() {
    return await this.authorDAO.getAuthors({});
  }

  /**
   * It update an author
   * @param author object
   * @returns update log
   */
  async updateAuthor(author: AuthorDTO) {
    const updatedInfo = await this.authorDAO.updateAuthor(author);

    if (updatedInfo.modifiedCount === 1 && updatedInfo.matchedCount === 1) {
      return { message: Constants.authorUpdated };
    } else if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount === 1) {
      throw new HttpException({ message: Constants.authorNotUpdated }, Constants.httpStatus202);
    } else {
      throw new HttpException({ message: Constants.authorNotFound }, Constants.httpStatus404);
    }
  }

  /**
   * It delete an author and books related to this author
   * @param id string, author id
   * @returns deletion log
   */
  async deleteAuthor(id: string) {
    const deletedInfo = await this.authorDAO.deleteAuthor(new Types.ObjectId(id));

    if (deletedInfo.deletedCount === 1) {
      const books = await this.bookDAO.getBooks({ authors: id });
      for (const book of books) {
        await this.bookDAO.deleteBook(book._id);
      }
      return { message: Constants.authorDeleted };
    } else {
      throw new HttpException({ message: Constants.authorNotFound }, Constants.httpStatus404);
    }
  }
}
