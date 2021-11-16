import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { BookDTO } from 'src/book/DTOs/book.DTO';
import { BookService } from 'src/book/book.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBook(@Body() newBook: BookDTO) {
    return await this.bookService.createBook(newBook);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getBook(@Param('id') id: string) {
    return await this.bookService.getBook(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getBooks() {
    return await this.bookService.getBooks();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateBook(@Body() book: BookDTO) {
    return await this.bookService.updateBook(book);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteIser(@Param('id') id: string) {
    return await this.bookService.deleteBook(id);
  }
}
