import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class LeaguesService {

    constructor(
        @InjectRepository(League)
        private readonly leagueRepository: Repository<League>,
    )
    {}

    async findAll(): Promise<League[]> {
        return await this.leagueRepository.find();
    }

    async findById(id: string): Promise<League | null> {
        return await this.leagueRepository.findOne({ where: { id } });
    }

    async findMatchsByLeagueId(leagueId: string): Promise<string[]> {
    const league = await this.leagueRepository.findOne({
            where: { id: leagueId },
            relations: ['matches'],
        });

        if (!league) {
            return [];
        }

        // return id of matchs
        const matchIds = await Promise.all(
            league.matches.map(async (match) => {
                return match.id;
            })
        );
        return matchIds;
    }

    async findTournamentsByLeagueId(leagueId: string): Promise<any[]> {
        // TODO : Implement this method to fetch tournaments by league ID
        return [];
    }

    async upsert(league: League): Promise<void> {
        await this.leagueRepository.upsert(league, ['id']);
    }
    
}
