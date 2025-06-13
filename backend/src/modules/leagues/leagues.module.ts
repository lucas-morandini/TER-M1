import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { TournamentsModule } from '../tournaments/tournaments.module';

@Module({
  imports: [TypeOrmModule.forFeature([League]), TournamentsModule],
  exports: [TypeOrmModule, LeaguesService],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}