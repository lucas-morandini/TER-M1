import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayersService } from './players.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  exports: [TypeOrmModule, PlayersService],
  providers: [PlayersService],
})
export class PlayersModule {}