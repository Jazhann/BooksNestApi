import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book } from 'src/book/interfaces/book.interface';
import { BookDTO } from '../DTOs/book.DTO';

@Injectable()
export class BookDAO {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async createBook(newBook: BookDTO): Promise<Book> {
    const createdBook = new this.bookModel(newBook);
    return createdBook.save();
  }

  async getBook(params): Promise<Book> {
    return this.bookModel.findOne(params).populate('authors').exec();
  }

  async getBooks(params): Promise<Book[]> {
    return this.bookModel.find(params).populate('authors').exec();
  }

  async updateBook(book: BookDTO): Promise<any> {
    return this.bookModel.updateOne({ _id: book._id }, book);
  }

  async deleteBook(id): Promise<any> {
    return this.bookModel.deleteOne({ _id: id });
  }
}
