import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {

    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ){}

    async findAll(): Promise<Player[]> {
        return await this.playerRepository.find();
    }

    async findAllByTeamId(teamId: string): Promise<Player[]> {
        return await this.playerRepository.find({
            where: { teamId },
        });
    }
}
