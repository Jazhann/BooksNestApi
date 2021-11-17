import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';

import { UserDTO } from 'src/user/DTOs/user.DTO';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({
    summary: 'Create an User',
    description: 'Create an user',
  })
  @ApiResponse({
    type: UserDTO,
    status: 201,
    description: 'User created successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'User already exists',
  })
  @ApiBody({
    type: UserDTO,
    description: 'User object',
  })
  @Post()
  async createUser(@Body() newUser: UserDTO) {
    return await this.usersService.createUser(newUser);
  }

  @ApiOperation({
    summary: 'Get an User',
    description: 'Get an User by id param',
  })
  @ApiResponse({
    type: UserDTO,
    status: 200,
    description: 'User founded',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @ApiOperation({
    summary: 'Get All Users',
    description: 'Get all users',
  })
  @ApiResponse({
    type: [UserDTO],
    status: 200,
    description: 'Users founded',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @ApiOperation({
    summary: 'Update an User',
    description: 'Update an existent author',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
  })
  @ApiResponse({
    status: 202,
    description: 'User not updated',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBody({
    type: UserDTO,
    description: 'User object',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UserDTO) {
    return await this.usersService.updateUser(id, user);
  }

  @ApiOperation({
    summary: 'Delete an User',
    description: 'Delete a book by id param',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Book id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteIser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
