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
import { TournamentsService } from './tournaments.service';
import { Tournament } from './entities/tournament.entity';

@ApiTags('tournaments')
@Controller(['tournament', 'tournaments'])
export class TournamentsController { 
    constructor(
        private readonly tournamentService: TournamentsService,
    ){}

    @ApiOperation({ summary: 'Get All Tournaments' })
    @ApiOkResponse({ description: 'Tournaments fetched successfully' })
    @ApiNotFoundResponse({ description: 'Tournaments not found' })
    @Get()
    @Public()
    async getAllTournaments() : Promise<Tournament[]>{
        return await this.tournamentService.findAll();
    }

    @ApiOperation({ summary: 'Get tournaments by league' })
    @ApiOkResponse({ description: 'Tournament fetched successfully' })
    @ApiNotFoundResponse({ description: 'Tournament not found' })
    @Get('league/:leagueId')
    @Public()
    async getTournamentsByLeague(@Param('leagueId') leagueId: string) : Promise<Tournament[]>{
        if (!leagueId) {
            throw new BadRequestException('League ID is required');
        }
        return await this.tournamentService.findByLeague(leagueId);
    }

    @ApiOperation({ summary: 'Get classement of a tournament' })
    @ApiOkResponse({ description: 'Classement fetched successfully' })
    @ApiNotFoundResponse({ description: 'Classement not found' })
    @Get(':id/standings')
    @Public()
    async getTournamentStandings(@Param('id') id: string, @Req() req: Request) : Promise<[]>{
        if (!id) {
            throw new BadRequestException('Tournament ID is required');
        }
        const local : string = req.query.local as string || 'fr-FR';
        return await this.tournamentService.getStandings(id, local);
    }

    @ApiOperation({ summary: 'Get tournament by ID' })
    @ApiOkResponse({ description: 'Tournament fetched successfully' })
    @ApiNotFoundResponse({ description: 'Tournament not found' })
    @Get(':id')
    @Public()
    async getTournamentById(@Param('id') id: string) : Promise<Tournament | null>{
        if (!id) {
            throw new BadRequestException('Tournament ID is required');
        }
        return await this.tournamentService.findOne(id);
    }
}
