import { Document, ObjectId } from 'mongoose';
import { Author } from 'src/author/interfaces/author.interface';

export interface Book extends Document {
  readonly _id: ObjectId;
  readonly title: string;
  readonly isbn: string;
  readonly authors: Author[];
  readonly releaseDate: Date;
  readonly pages: number;
}
