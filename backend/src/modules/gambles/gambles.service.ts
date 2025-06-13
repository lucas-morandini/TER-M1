import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gamble } from './entities/gamble.entity';
import { Repository } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class GamblesService {
    constructor(
        @InjectRepository(Gamble)
        private readonly gambleRepository: Repository<Gamble>,
        @Inject(forwardRef(() => MatchesService))
        private readonly matchService: MatchesService
    )
    {}

    async findAll(): Promise<Gamble[]> {
        return await this.gambleRepository.find();
    }

    async findByMatchId(matchId: string): Promise<Gamble[]> {
        return await this.gambleRepository.find({
            where: { match_id: matchId },
        });
    }

    async findById(id: number): Promise<Gamble | null> {
        return await this.gambleRepository.findOne({
            where: { id },
        });
    }

    async getMatchByGambleId(gambleId: number): Promise<Match | null> {
        const gamble = await this.gambleRepository.findOne({
            where: { id: gambleId },
            relations: ['match'],
        });
        if (!gamble) {
            return null;
        }
        return await this.matchService.findById(gamble.match_id);
    }


    async create(gamble: Gamble): Promise<Gamble> {
        return await this.gambleRepository.save(gamble);
    }
}
