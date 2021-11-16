import { ObjectId } from 'mongoose';
import { BookDTO } from 'src/book/DTOs/book.DTO';

export class AuthorDTO {
  _id: ObjectId;
  name: string;
  books: BookDTO[];
}
