import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Response, Logger } from '@nestjs/common';

import { BookDTO } from '../book/DTOs/book.DTO';
import { BookService } from '../book/book.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookUpdateDTO } from './DTOs/bookUpdate.DTO';

@ApiTags('books')
@ApiBearerAuth()
@Controller('api/books')
export class BookController {
  constructor(private readonly bookService: BookService, private readonly logger: Logger) {}

  @ApiOperation({
    summary: 'Create a Book',
    description: 'Create a book and insert reference in authors',
  })
  @ApiResponse({
    type: BookDTO,
    status: 201,
    description: 'Book created successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Book already exists',
  })
  @ApiBody({
    type: BookDTO,
    description: 'Book object, authors array must be fill with authors objectId',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBook(@Body() newBook: BookDTO) {
    this.logger.log('Creating book with data: ' + JSON.stringify(newBook), BookController.name);
    return await this.bookService.createBook(newBook);
  }

  @ApiOperation({
    summary: 'Get a Book',
    description: 'Get a book by id param',
  })
  @ApiResponse({
    type: BookDTO,
    status: 200,
    description: 'Book founded',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Book id' })
  @UseGuards(AuthGuard('jwt'))
  @Get('get-one/:id')
  async getBook(@Param('id') id: string) {
    this.logger.log('Getting book with id: ' + id, BookController.name);
    return await this.bookService.getBook(id);
  }

  @ApiOperation({
    summary: 'Get All Books',
    description: 'Get all books',
  })
  @ApiResponse({
    type: [BookDTO],
    status: 200,
    description: 'Books founded',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getBooks() {
    this.logger.log('Getting all books', BookController.name);
    return await this.bookService.getBooks();
  }

  @ApiOperation({
    summary: 'Update a Book',
    description: 'Update an existent book',
  })
  @ApiResponse({
    status: 200,
    description: 'Book updated',
  })
  @ApiResponse({
    status: 202,
    description: 'Book not updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiBody({
    type: BookUpdateDTO,
    description: 'Book object, authors array must be fill with authors objectId',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateBook(@Body() book: BookUpdateDTO) {
    this.logger.log('Updating book with data: ' + JSON.stringify(book), BookController.name);
    return await this.bookService.updateBook(book);
  }

  @ApiOperation({
    summary: 'Delete a Book',
    description: 'Delete a book by id param',
  })
  @ApiResponse({
    status: 200,
    description: 'Book deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Book id' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteIser(@Param('id') id: string) {
    this.logger.log('Deleting book with id: ' + id, BookController.name);
    return await this.bookService.deleteBook(id);
  }

  @ApiOperation({
    summary: 'Get all Books in csv format',
    description: 'Get all Books in csv format',
  })
  @ApiResponse({
    status: 200,
    description: 'Csv generated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('get-csv')
  async export(@Response() res) {
    this.logger.log('Getting books csv', BookController.name);
    const csv = await this.bookService.getCsv();
    res.set('Content-Type', 'text/csv');
    res.attachment('authors.csv');
    return res.send(csv);
  }
}
