import { HttpException } from '@nestjs/common';

export const send = (message, status) => {
  throw new HttpException({ status, message }, status);
};
