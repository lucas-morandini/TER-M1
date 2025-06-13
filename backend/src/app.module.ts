import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';
import { MailService } from './modules/mail/mail.service';
import { MailModule } from './modules/mail/mail.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import des modules
import { UsersModule } from './modules/users/users.module';
import { LeaguesModule } from './modules/leagues/leagues.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { GamesModule } from './modules/games/games.module';
import { MatchesModule } from './modules/matches/matches.module';
import { GamblesModule } from './modules/gambles/gambles.module';
import { BetsModule } from './modules/bets/bets.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DATABASE_HOST') || 'db',
          port: parseInt(configService.get('DATABASE_PORT') || '3306', 10),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
          logging: true,
          retryAttempts: 5,
          retryDelay: 3000,
        };
      },
    }),
    UsersModule,
    LeaguesModule,
    TournamentsModule,
    TeamsModule,
    PlayersModule,
    GamesModule,
    MatchesModule,
    GamblesModule,
    BetsModule,
    PaymentsModule,
    SharedModule,
    CoreModule,
    ModulesModule,
    MailModule,
    AppConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule { }

