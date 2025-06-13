// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import apiConfig from './api.config';
import typeormConfig from './typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, typeormConfig],
    }),
  ],
})
export class AppConfigModule {}
