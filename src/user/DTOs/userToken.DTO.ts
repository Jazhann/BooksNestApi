import { ApiProperty } from '@nestjs/swagger';

export class UserTokenDTO {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: {
    _id: string;
    email: string;
    name: string;
  };
}
