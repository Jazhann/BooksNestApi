import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: String,
  isbn: String,
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  releaseDate: Date,
  pages: Number,
});
