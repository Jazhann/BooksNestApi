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

import { AuthorDTO } from 'src/author/DTOs/author.DTO';
import { AuthorService } from 'src/author/author.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAuthor(@Body() newAuthor: AuthorDTO) {
    return await this.authorService.createAuthor(newAuthor);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAuthor(@Param('id') id: string) {
    return await this.authorService.getAuthor(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAuthors() {
    return await this.authorService.getAuthors();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateAuthor(@Body() author: AuthorDTO) {
    return await this.authorService.updateAuthor(author);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteAuthor(@Param('id') id: string) {
    return await this.authorService.deleteAuthor(id);
  }
}
