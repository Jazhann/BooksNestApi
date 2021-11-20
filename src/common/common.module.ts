import { Logger, Module } from '@nestjs/common';
import { UtilsService } from './services/Utils.service';

@Module({
  providers: [UtilsService, Logger],
  exports: [UtilsService],
})
export class CommonModule {}
