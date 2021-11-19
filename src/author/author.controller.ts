import { Controller, Get, Post, Put, Delete, Body, Param, Response, UseGuards, Logger } from '@nestjs/common';
import { AuthorDTO } from '../author/DTOs/author.DTO';
import { AuthorService } from '../author/author.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorUpdateDTO } from './DTOs/authorUpdate.DTO';

@ApiTags('authors')
@ApiBearerAuth()
@Controller('api/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService, private readonly logger: Logger) {}

  @ApiOperation({
    summary: 'Create an Author',
    description: 'Create an Author',
  })
  @ApiResponse({
    type: AuthorDTO,
    status: 201,
    description: 'Author created successful',
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
    description: 'Author already exists',
  })
  @ApiBody({
    type: AuthorDTO,
    description: 'Author object, books array can be fill with authors objectId',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAuthor(@Body() newAuthor: AuthorDTO) {
    this.logger.log('Creating author with data: ' + JSON.stringify(newAuthor), AuthorController.name);
    return await this.authorService.createAuthor(newAuthor);
  }

  @ApiOperation({
    summary: 'Get an Author',
    description: 'Get an author by id param',
  })
  @ApiResponse({
    type: AuthorDTO,
    status: 200,
    description: 'Author founded',
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
    description: 'Author not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Author id' })
  @UseGuards(AuthGuard('jwt'))
  @Get('getone/:id')
  async getAuthor(@Param('id') id: string) {
    this.logger.log('Getting author with id: ' + id, AuthorController.name);
    return await this.authorService.getAuthor(id);
  }

  @ApiOperation({
    summary: 'Get All Authors',
    description: 'Get all authors',
  })
  @ApiResponse({
    type: [AuthorDTO],
    status: 200,
    description: 'Authors founded',
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
  async getAuthors() {
    this.logger.log('Getting all authors', AuthorController.name);
    return await this.authorService.getAuthors();
  }

  @ApiOperation({
    summary: 'Update an Author',
    description: 'Update an existent author',
  })
  @ApiResponse({
    status: 200,
    description: 'Author updated',
  })
  @ApiResponse({
    status: 202,
    description: 'Author not updated',
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
    description: 'Author not found',
  })
  @ApiBody({
    type: AuthorUpdateDTO,
    description: 'Author object, books array can be fill with authors objectId',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateAuthor(@Body() author: AuthorUpdateDTO) {
    this.logger.log('Updating author with data: ' + JSON.stringify(author), AuthorController.name);
    return await this.authorService.updateAuthor(author);
  }

  @ApiOperation({
    summary: 'Delete an Author',
    description: 'Delete an Author by id param and all books related',
  })
  @ApiResponse({
    status: 200,
    description: 'Author deleted',
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
    description: 'Author not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Author id' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteAuthor(@Param('id') id: string) {
    this.logger.log('Deleting author with id: ' + id, AuthorController.name);
    return await this.authorService.deleteAuthor(id);
  }

  @ApiOperation({
    summary: 'Get all Authors in csv format',
    description: 'Get all Authors in csv format',
  })
  @ApiResponse({
    status: 200,
    description: 'Csv genereted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('getcsv')
  async export(@Response() res) {
    this.logger.log('Getting authors csv', AuthorController.name);
    const csv = await this.authorService.getCsv();
    res.set('Content-Type', 'text/csv');
    res.attachment('authors.csv');
    return res.send(csv);
  }
}
