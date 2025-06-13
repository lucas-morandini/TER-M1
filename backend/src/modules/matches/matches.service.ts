import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { MatchTeam } from './entities/matchteam.entity';
import { BetsService } from '../bets/bets.service';
import { Bet } from '../bets/entities/bet.entity';
import { match } from 'assert';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MatchesService {

    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(MatchTeam)
        private readonly matchTeamRepository: Repository<MatchTeam>,
        private readonly betService : BetsService,
    ) 
    {}

    async findAll(): Promise<Match[]> {
        const matches =  await this.matchRepository.find({
            order: { startDate: 'ASC' },
            relations: ['matchTeams', 'matchTeams.team']
        });
        return matches.map(m => ({
            ...plainToInstance(Match, m, { excludeExtraneousValues: true }),
            teams: m.matchTeams?.map(mt => mt.team) || [],
          }));
    }

    async findByTeamId(teamId: string): Promise<MatchTeam[]> {
        return await this.matchTeamRepository.find({
            where: [
                { teamId: teamId },
            ]
        });
    }

    async findByLeague(leagueId: string): Promise<Match[]> {
        return await this.matchRepository.find({
            where: { leagueId: leagueId },
            order: { startDate: 'ASC' }
        });
    }

    async findByTournament(tournamentId: string): Promise<Match[]> {
        return await this.matchRepository.find({
            where: { tournamentId: tournamentId },
            order: { startDate: 'ASC' }
        });
    }

    async getMatchOfTheWeek(): Promise<Match> {
        const matches = await this.findAll();
        const now = new Date();
        const nextMatch = matches.find(match => {
            const startDate = new Date(match.startDate);
            return startDate > now;
        });
        if (!nextMatch) {
            throw new NotFoundException('No upcoming matches found');
        }
        // include teams in the match
        const matchWithTeams = await this.matchRepository.findOne({
            where: { id: nextMatch.id },
            relations: ['matchTeams', 'matchTeams.team']
        });
        
        if (!matchWithTeams) {
            throw new NotFoundException('Match not found');
        }
        const matchDate = new Date(matchWithTeams.startDate);
        if (matchDate < now && matchWithTeams.state === 'upcoming') {
            matchWithTeams.state = 'inProgress';
            matchWithTeams.isBettable = false;
            await this.matchRepository.save(matchWithTeams);
        }else{
            matchWithTeams.state = 'upcoming';
            matchWithTeams.isBettable = true;
            await this.matchRepository.save(matchWithTeams);
        }
        return {
            ...plainToInstance(Match, matchWithTeams, { excludeExtraneousValues: true }),
            teams: matchWithTeams.matchTeams?.map(mt => mt.team) || [],
        };
    }

    async getBetsOfMatch(matchId: string): Promise<number[]> {
        const match = await this.matchRepository.findOne({
            where: { id: matchId },
        });
        if (!match) {
            throw new NotFoundException('Match not found');
        }
        const bets = await this.betService.findByMatchId(matchId);
        if (!bets || bets.length === 0) {
            throw new NotFoundException('No bets found for this match');
        }
        // save only bets id 
        const betIds = await Promise.all(bets.map(async bet => bet.id));
        return betIds;
    }

    async findById(matchId: string): Promise<Match> {
        const match = await this.matchRepository.findOne({
            where: { id: matchId },
            relations: ['matchTeams', 'matchTeams.team']
        });
        if (!match) {
            throw new NotFoundException('Match not found');
        }
        // check if the date of the match is in the past
        const now = new Date();
        const matchDate = new Date(match.startDate);
        if (matchDate < now && match.state === 'upcoming') {
            match.state = 'inProgress';
            match.isBettable = false;
            await this.matchRepository.save(match);
        }else{
            match.state = 'upcoming';
            match.isBettable = true;
            await this.matchRepository.save(match);
        }
        return {
            ...plainToInstance(Match, match, { excludeExtraneousValues: true }),
            teams: match.matchTeams?.map(mt => mt.team) || [],
        }
    }

    async upsert(match: Match): Promise<Match> {
        if (!match || !match.id) {
            throw new Error('Match data is required');
        }
        return await this.matchRepository.save(match);
    }

    async upsertMatchTeam(matchTeam: MatchTeam): Promise<MatchTeam> {
        if (!matchTeam){
            throw new Error('MatchTeam data is required');
        }
        return await this.matchTeamRepository.save(matchTeam);
    }
}
