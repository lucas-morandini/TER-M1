import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  imports: [UtilsModule],
  exports: [ServicesService],
  providers: [ServicesService]
})
export class ServicesModule {}
