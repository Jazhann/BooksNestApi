import { Document, ObjectId } from 'mongoose';
import { Book } from 'src/book/Interfaces/book.interface';

export interface Author extends Document {
  readonly _id: ObjectId;
  readonly name: string;
  readonly books: Book[];
}
