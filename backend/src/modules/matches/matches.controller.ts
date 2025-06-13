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
import { MatchesService } from './matches.service';

@ApiTags('matches')
@Controller(['match', 'matches'])
export class MatchesController { 
    constructor(
        private readonly matchService: MatchesService,
    ){}

    @ApiOperation({ summary: 'Get All Matches' })
    @ApiOkResponse({ description: 'Matches fetched successfully' })
    @ApiNotFoundResponse({ description: 'Matches not found' })
    @Get()
    @Public()
    async getAllMatches() {
        return await this.matchService.findAll();
    }

    @ApiOperation({ summary: 'Get Matches in league' })
    @ApiOkResponse({ description: 'Matches in league fetched successfully' })
    @ApiNotFoundResponse({ description: 'Matches in league not found' })
    @Get('league/:leagueId')
    @Public()
    async getMatchesInLeague(@Param('leagueId') leagueId: string) {
        return await this.matchService.findByLeague(leagueId);
    }

    @ApiOperation({ summary: 'Get Matches in tournament' })
    @ApiOkResponse({ description: 'Matches in tournament fetched successfully' })
    @ApiNotFoundResponse({ description: 'Matches in tournament not found' })
    @Get('tournament/:tournamentId')
    @Public()
    async getMatchesInTournament(@Param('tournamentId') tournamentId: string) {
        return await this.matchService.findByTournament(tournamentId);
    }

    @ApiOperation({ summary: 'Get Match of the week' })
    @ApiOkResponse({ description: 'Match of the week fetched successfully' })
    @ApiNotFoundResponse({ description: 'Match of the week not found' })
    @Get('matchOfTheWeek')
    @Public()
    async getMatchOfTheWeek() {
        return await this.matchService.getMatchOfTheWeek();
    }

    @ApiOperation({ summary: 'Get Bets of a Match' })
    @ApiOkResponse({ description: 'Bets of the match fetched successfully' })
    @ApiNotFoundResponse({ description: 'Bets of the match not found' })
    @Get(':matchId/bets')
    @Public()
    async getBetsOfMatch(@Param('matchId') matchId: string) {
        return await this.matchService.getBetsOfMatch(matchId);
    }

    @ApiOperation({ summary: 'Get Match by ID' })
    @ApiOkResponse({ description: 'Match fetched successfully' })
    @ApiNotFoundResponse({ description: 'Match not found' })
    @Get(':matchId')
    @Public()
    async getMatchById(@Param('matchId') matchId: string) {
        const match = await this.matchService.findById(matchId);
        if (!match) {
            throw new BadRequestException('Match not found');
        }
        return match;
    }
}