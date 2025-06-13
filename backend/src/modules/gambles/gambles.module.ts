import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamble } from './entities/gamble.entity';
import { GamblesService } from './gambles.service';
import { GamblesController } from './gambles.controller';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gamble]), forwardRef(() => MatchesModule)],
  exports: [TypeOrmModule, GamblesService],
  providers: [GamblesService],
  controllers: [GamblesController],
})
export class GamblesModule {}