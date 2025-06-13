import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchTeam } from './entities/matchteam.entity';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GamblesModule } from '../gambles/gambles.module';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchTeam]), forwardRef(() => GamblesModule), BetsModule],
  exports: [TypeOrmModule, MatchesService],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}