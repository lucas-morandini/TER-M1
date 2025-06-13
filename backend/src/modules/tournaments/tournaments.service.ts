import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentsService {

    constructor(
        @InjectRepository(Tournament)
        private readonly tournamentRepository: Repository<Tournament>,
    ) { }

    async findAll(): Promise<Tournament[]> {
        return await this.tournamentRepository.find();
    }

    async findByLeague(leagueId: string): Promise<Tournament[]> {
        if (!leagueId) {
            throw new Error('League ID is required');
        }
        return await this.tournamentRepository.find({ where: { slug : leagueId }, order: { startDate: 'DESC' } });
    }

    async getStandings(tournamentId: string, local : string): Promise<[]> {
        if (!tournamentId) {
            throw new Error('Tournament ID is required');
        }
        //TODO : Implement the logic to fetch standings based on the tournament ID and locale
        return [];
    }

    async findOne(id: string): Promise<Tournament | null> {
        if (!id) {
            throw new Error('Tournament ID is required');
        }
        return await this.tournamentRepository.findOne({ where: { id } });
    }


    async upsert(tournament: Tournament): Promise<void> {
        await this.tournamentRepository.upsert(tournament, ['id']);
    }
    
}
