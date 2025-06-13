// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpUtils } from './http.utils';
import { EventUtilsService } from './eventsutils.service';
import { LeagueUtilsService } from './leaguesutils.service';
import { MatchesUtilsService } from './matchesutils.service';
import { TeamsUtilsService } from './teamsutils.services';
import { TournamentUtilsService } from './tournamentutils.service';
import { LeaguesModule } from 'src/modules/leagues/leagues.module';
import { UtilsService } from './utils.service';
import { TournamentsModule } from 'src/modules/tournaments/tournaments.module';
import { TeamsModule } from 'src/modules/teams/teams.module';
import { GamblesModule } from 'src/modules/gambles/gambles.module';
import { MatchesModule } from 'src/modules/matches/matches.module';

@Module({
  imports: [ConfigModule, LeaguesModule, TournamentsModule, TeamsModule, GamblesModule, MatchesModule],
  providers: [HttpUtils, EventUtilsService, LeagueUtilsService, MatchesUtilsService, TeamsUtilsService, TournamentUtilsService, UtilsService],
  exports: [HttpUtils, EventUtilsService, LeagueUtilsService, MatchesUtilsService, TeamsUtilsService, TournamentUtilsService, UtilsService]
})
export class UtilsModule {}
