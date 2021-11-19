import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Logger } from '@nestjs/common';

import { UserDTO } from '../user/DTOs/user.DTO';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserUpdateDTO } from './DTOs/userUpdate.DTO';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService, private readonly logger: Logger) {}

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
    status: 400,
    description: 'Bad Request',
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
    this.logger.log('Creating user with data: ' + JSON.stringify(newUser), UserController.name);
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
    status: 400,
    description: 'Bad Request',
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
    this.logger.log('Getting user with id: ' + id, UserController.name);
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
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers() {
    this.logger.log('Getting all users', UserController.name);
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
    status: 400,
    description: 'Bad Request',
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
    type: UserUpdateDTO,
    description: 'User object',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateUser(@Body() user: UserUpdateDTO) {
    this.logger.log('Updating user with data: ' + JSON.stringify(user), UserController.name);
    return await this.usersService.updateUser(user);
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
    status: 400,
    description: 'Bad Request',
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
  async deleteUser(@Param('id') id: string) {
    this.logger.log('Deleting user with id: ' + id);
    return await this.usersService.deleteUser(id);
  }
}
