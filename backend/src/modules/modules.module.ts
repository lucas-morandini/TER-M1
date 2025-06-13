import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { LeaguesModule } from './leagues/leagues.module';
import { GamesModule } from './games/games.module';
import { MatchesModule } from './matches/matches.module';
import { BetsModule } from './bets/bets.module';
import { PaymentsModule } from './payments/payments.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import { PlayersModule } from './players/players.module';
import { GamblesModule } from './gambles/gambles.module';
import { UsersController } from './users/users.controller';
import { ServicesController } from './services/services.controller';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [UsersModule, TeamsModule, TournamentsModule, LeaguesModule, GamesModule, MatchesModule, BetsModule, PaymentsModule, ExternalApisModule, PlayersModule, GamblesModule, ServicesModule, NotificationsModule],
  controllers: [UsersController, ServicesController],
  providers: [],
})
export class ModulesModule {}
