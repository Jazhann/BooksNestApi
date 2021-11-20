import { Document, ObjectId } from 'mongoose';
import { Book } from '../../book/interfaces/book.interface';

export interface Author extends Document {
  readonly _id: ObjectId;
  readonly name: string;
  readonly books: Book[];
}
