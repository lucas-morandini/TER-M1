import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';

import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/currentuser.decorator';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@Controller(['team', 'teams'])
export class TeamsController { 
    constructor(
        private readonly teamService: TeamsService,
    ){}

    @ApiOperation({ summary: 'Get All Teams' })
    @ApiOkResponse({ description: 'Teams fetched successfully' })
    @ApiNotFoundResponse({ description: 'Teams not found' })
    @Get()
    @Public()
    async getAllTeams() {
        return await this.teamService.findAll();
    }

    @ApiOperation({ summary: 'Get a team by slug' })
    @ApiOkResponse({ description: 'Team fetched successfully' })
    @ApiNotFoundResponse({ description: 'Team not found' })
    @Get('slug/:slug')
    @Public()
    async getTeamBySlug(@Param('slug') slug: string) {
        const team = await this.teamService.findBySlug(slug);
        if (!team) {
            throw new BadRequestException('Team not found');
        }
        return team;
    }

    @ApiOperation({ summary: 'Get players in a team' })
    @ApiOkResponse({ description: 'Players fetched successfully' })
    @ApiNotFoundResponse({ description: 'Players not found' })
    @Get(':id/player')
    @Public()
    async getPlayerInTeam(@Param('id') id: string) {
        return await this.teamService.findPlayersByTeamId(id);
    }

    @ApiOperation({ summary: 'Get teams in a league' })
    @ApiOkResponse({ description: 'Teams in league fetched successfully' })
    @ApiNotFoundResponse({ description: 'League not found or no teams in league' })
    @Get('league/:leagueId')
    @Public()
    async getTeamsInLeague(@Param('leagueId') leagueId: string) {
        return await this.teamService.findByLeagueId(leagueId);
    }

    @ApiOperation({ summary: 'Get matchs in a team' })
    @ApiOkResponse({ description: 'Matchs in team fetched successfully' })
    @ApiNotFoundResponse({ description: 'Team not found or no matchs in team' })
    @Get(':id/matchs')
    @Public()
    async getMatchsInTeam(@Param('id') id: string) {
        return await this.teamService.findMatchsByTeamId(id);
    }

    @ApiOperation({ summary: 'Get Team by ID' })
    @ApiOkResponse({ description: 'Team fetched successfully' })
    @ApiNotFoundResponse({ description: 'Team not found' })
    @Get(':id')
    @Public()
    async getTeamById(@Param('id') id: string) {
        const team = await this.teamService.findById(id);
        if (!team) {
            throw new BadRequestException('Team not found');
        }
        return team;
    }
}