import * as mongoose from 'mongoose';

export const AuthorSchema = new mongoose.Schema({
  name: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});
