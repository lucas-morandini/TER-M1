import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PlayersModule } from '../players/players.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), PlayersModule, MatchesModule],
  exports: [TypeOrmModule, TeamsService],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}