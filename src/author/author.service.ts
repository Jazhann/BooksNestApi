import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthorDTO } from 'src/author/DTOs/author.DTO';
import { AuthorDAO } from 'src/author/DAO/author.DAO';
import { Constants } from 'src/common/constants';

@Injectable()
export class AuthorService {
  constructor(@Inject('AuthorDAO') private readonly authorDAO: AuthorDAO) {}

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
      throw new HttpException(
        {
          message: Constants.authorAlreadyExists,
        },
        403,
      );
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
    return await this.authorDAO.getAuthor({ _id: new Types.ObjectId(id) });
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
    const checkAuthorName = await this.authorDAO.getAuthor({
      name: author.name.toLocaleLowerCase(),
    });
    if (checkAuthorName != null) {
      throw new HttpException(
        {
          message: Constants.authorWithTheSameName,
        },
        403,
      );
    }
    return await this.authorDAO.updateAuthor(author);
  }

  /**
   * It delete an author
   * @param id string, author id
   * @returns deletion log
   */
  async deleteAuthor(id: string) {
    const deletedAuthor = await this.authorDAO.deleteAuthor(
      new Types.ObjectId(id),
    );
    return deletedAuthor;
  }
}
