import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersService } from '../players/players.service';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { Match } from '../matches/entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { MatchTeam } from '../matches/entities/matchteam.entity';

@Injectable()
export class TeamsService {

    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        private readonly playersService: PlayersService,
        private readonly matchService: MatchesService
    ){}

    async findAll(): Promise<Team[]> {
        return await this.teamRepository.find({ relations: ['players'] });
    }

    async findBySlug(slug: string): Promise<Team | null> {
        return await this.teamRepository.findOne({
            where: { slug },
            relations: ['players'],
        });
    }

    async findById(id: string): Promise<Team | null> {
        return await this.teamRepository.findOne({
            where: { id },
            relations: ['players'],
        });
    }

    async findPlayersByTeamId(teamId: string): Promise<Player[]> {
        return await this.playersService.findAllByTeamId(teamId);
    }

    async findByLeagueId(leagueId: string): Promise<Team[]> {
        return await this.teamRepository.find({
            where: { homeLeagueId : leagueId },
            relations: ['players'],
        });
    }

    async findMatchsByTeamId(teamId: string): Promise<string[]> {
        const matchesTeam : MatchTeam[] = await this.matchService.findByTeamId(teamId);
        const matchIds = await Promise.all(matchesTeam.map(async (match: MatchTeam) => match.matchId));
        return matchIds;
    }

    async upsert(team: Team): Promise<Team> {
        try {
            const existingTeamById = await this.teamRepository.findOne({
                where: { id: team.id }
            });

            if (existingTeamById) {
                await this.teamRepository.update(
                    { id: team.id },
                    {
                        name: team.name,
                        slug: team.slug,
                        image: team.image,
                        alternativeImage: team.alternativeImage,
                        homeLeagueId: team.homeLeagueId,
                    }
                );
                
                const updatedTeam = await this.teamRepository.findOne({ where: { id: team.id } });
                return updatedTeam || existingTeamById;
            }

            const existingTeamBySlug = await this.teamRepository.findOne({
                where: { slug: team.slug }
            });

            if (existingTeamBySlug && existingTeamBySlug.id !== team.id) {
                console.log(`Slug conflict detected: Team ${existingTeamBySlug.id} has slug '${team.slug}', updating with new team data`);
                
                await this.teamRepository.update(
                    { id: existingTeamBySlug.id },
                    {
                        name: team.name,
                        image: team.image,
                        alternativeImage: team.alternativeImage,
                        homeLeagueId: team.homeLeagueId,
                    }
                );
                
                const updatedTeam = await this.teamRepository.findOne({ where: { id: existingTeamBySlug.id } });
                return updatedTeam || existingTeamBySlug;
            }

            return await this.teamRepository.save(team);

        } catch (error) {
            console.error(`Error upserting team ${team.id} (${team.name}):`, error.message);
            
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                console.warn(`Team ${team.id} has foreign key references, skipping update`);
                const existingTeam = await this.teamRepository.findOne({ where: { id: team.id } });
                return existingTeam || team;
            }
            
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                console.warn(`Duplicate entry detected for team ${team.id}, attempting recovery`);
                const existingTeam = await this.teamRepository.findOne({ 
                    where: [{ id: team.id }, { slug: team.slug }] 
                });
                return existingTeam || team;
            }
            
            throw error;
        }
    }

    async upsertBatch(teams: Team[]): Promise<void> {
        for (const team of teams) {
            try {
                await this.upsert(team);
            } catch (error) {
                console.error(`Failed to upsert team ${team.id}:`, error.message);
            }
        }
    }

    async updateSafeFields(teamId: string, updateData: Partial<Pick<Team, 'name' | 'image' | 'alternativeImage' | 'homeLeagueId'>>): Promise<Team | null> {
        await this.teamRepository.update({ id: teamId }, updateData);
        return await this.teamRepository.findOne({ where: { id: teamId } });
    }
}