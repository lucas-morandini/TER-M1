import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [AuthModule, GuardsModule]
})
export class CoreModule {}
