import { Controller, Request, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { UserLoginDTO } from './user/DTOs/userLogin.DTO';
import { UserTokenDTO } from './user/DTOs/userToken.DTO';

@ApiTags('login')
@Controller('api')
export class AppController {
  constructor(private readonly authService: AuthService, private readonly logger: Logger) {}

  @ApiOperation({
    summary: 'User Login',
    description: 'User login using local strategy',
  })
  @ApiResponse({
    type: UserTokenDTO,
    status: 201,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({
    type: UserLoginDTO,
    description: 'Local auth object',
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<UserTokenDTO> {
    this.logger.log('Trying to do login');
    return this.authService.login(req.user);
  }
}
