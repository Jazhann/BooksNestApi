import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';

import { AuthorDTO } from 'src/author/DTOs/author.DTO';
import { AuthorService } from 'src/author/author.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authors')
@ApiBearerAuth()
@Controller('api/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Author id' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAuthor(@Param('id') id: string) {
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Author id' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAuthors() {
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
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiBody({
    type: AuthorDTO,
    description: 'Author object, books array can be fill with authors objectId',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateAuthor(@Body() author: AuthorDTO) {
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
    return await this.authorService.deleteAuthor(id);
  }
}
