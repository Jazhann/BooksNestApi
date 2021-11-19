import { HttpException, Logger } from '@nestjs/common';

export const send = (message, status, trace) => {
  Logger.error(message, trace);
  throw new HttpException({ status, message }, status);
};
