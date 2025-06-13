import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  exports: [TypeOrmModule, TournamentsService],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}