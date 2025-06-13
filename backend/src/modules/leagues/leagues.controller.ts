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
import { LeaguesService } from './leagues.service';

@ApiTags('leagues')
@Controller(['league', 'leagues'])
export class LeaguesController { 
    constructor(
        private readonly leagueService: LeaguesService,
    ){}

    @ApiOperation({ summary: 'Get All Leagues' })
    @ApiOkResponse({ description: 'Leagues fetched successfully' })
    @ApiNotFoundResponse({ description: 'Leagues not found' })
    @Get()
    @Public()
    async getAllLeagues() {
        return await this.leagueService.findAll();
    }

    @ApiOperation({ summary: 'Get Matchs by League ID' })
    @ApiOkResponse({ description: 'Matchs fetched successfully' })
    @ApiNotFoundResponse({ description: 'Matchs not found' })
    @Get(':id/matches')
    @Public()
    async getMatchsByLeagueId(@Param('id') id: string) {
        return await this.leagueService.findMatchsByLeagueId(id);
    }

    @ApiOperation({ summary: 'Get Tournaments by League ID' })
    @ApiOkResponse({ description: 'Tournaments fetched successfully' })
    @ApiNotFoundResponse({ description: 'Tournaments not found' })
    @Get(':id/tournaments')
    @Public()
    async getTournamentsByLeagueId(@Param('id') id: string) {
        return await this.leagueService.findTournamentsByLeagueId(id);
    }

    @ApiOperation({ summary: 'Get League by ID' })
    @ApiOkResponse({ description: 'League fetched successfully' })
    @ApiNotFoundResponse({ description: 'League not found' })
    @Get(':id')
    @Public()
    async getLeagueById(@Param('id') id: string) {
        const league = await this.leagueService.findById(id);
        if (!league) {
            throw new BadRequestException('League not found');
        }
        return league;
    }
}