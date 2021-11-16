import { ObjectId } from 'mongoose';
import { AuthorDTO } from 'src/author/DTOs/author.DTO';

export class BookDTO {
  _id: ObjectId;
  title: string;
  isbn: string;
  authors: AuthorDTO[];
  releaseDate: Date;
  pages: number;
}
