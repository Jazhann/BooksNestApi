import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthorDTO } from '../author/DTOs/author.DTO';
import { Author } from '../author/interfaces/author.interface';
import { AuthorUpdateDTO } from '../author/DTOs/authorUpdate.DTO';

@Injectable()
export class AuthorDAO {
  constructor(@InjectModel('Author') private readonly authorModel: Model<Author>) {}

  async createAuthor(newAuthor: AuthorDTO): Promise<Author> {
    const createdAuthor = new this.authorModel(newAuthor);
    return createdAuthor.save();
  }

  async getAuthor(params): Promise<Author> {
    return this.authorModel.findOne(params).exec();
  }

  async getAuthors(params): Promise<Author[]> {
    return this.authorModel.find(params).exec();
  }

  async updateAuthor(author: AuthorUpdateDTO): Promise<any> {
    return this.authorModel.updateOne({ _id: author._id }, author);
  }

  async deleteAuthor(id): Promise<any> {
    return this.authorModel.deleteOne({ _id: id });
  }
}
