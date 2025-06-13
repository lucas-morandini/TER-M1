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
import { GamblesService } from './gambles.service';

@ApiTags('gambles')
@Controller(['gamble', 'gambles'])
export class GamblesController { 
    constructor(
        private readonly gambleService: GamblesService,
    ){}

    @ApiOperation({ summary: 'Get All Gambles' })
    @ApiOkResponse({ description: 'Gambles fetched successfully' })
    @ApiNotFoundResponse({ description: 'Gambles not found' })
    @Get()
    @Public()
    async getAllGambles() {
        return await this.gambleService.findAll();
    }

    @ApiOperation({ summary: 'Get Gamble by match ID' })
    @ApiOkResponse({ description: 'Gamble fetched successfully' })
    @ApiNotFoundResponse({ description: 'Gamble not found' })
    @Get('match/:matchId')
    @Public()
    async getGambleByMatchId(@Param('matchId') matchId: string) {
        return await this.gambleService.findByMatchId(matchId);
    }

    @ApiOperation({ summary: 'Get Gamble by ID' })
    @ApiOkResponse({ description: 'Gamble fetched successfully' })
    @ApiNotFoundResponse({ description: 'Gamble not found' })
    @Get(':id')
    @Public()
    async getGambleById(@Param('id') id: number) {
        return await this.gambleService.findById(id);
    }
}