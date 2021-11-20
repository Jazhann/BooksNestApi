import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UtilsService {
  constructor(private readonly logger: Logger) {}

  send(message, status, trace) {
    this.logger.error(message, trace);
    throw new HttpException({ status, message }, status);
  }
}
