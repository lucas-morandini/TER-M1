import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [UtilsModule]
})
export class SharedModule {}
