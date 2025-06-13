import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { GamblesModule } from '../gambles/gambles.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bet]), TypeOrmModule.forFeature([User]), GamblesModule],
  exports: [TypeOrmModule, BetsService],
  providers: [BetsService],
  controllers: [BetsController],
})
export class BetsModule {}