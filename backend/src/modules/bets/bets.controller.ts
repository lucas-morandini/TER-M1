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
import { BetsService } from './bets.service';
import { UserDto } from '../users/dto/user.dto';
import { CreateRequest } from './request/create.request';

@ApiTags('bets')
@Controller(['bet', 'bets'])
export class BetsController { 
    constructor(
        private readonly betService: BetsService,
    ){}

    @ApiOperation({ summary: 'Get All Bets' })
    @ApiOkResponse({ description: 'Bets fetched successfully' })
    @ApiNotFoundResponse({ description: 'Bets not found' })
    @Get()
    @Public()
    async getAllBets() {
        try {
            return await this.betService.findAll();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch bets');
        }
    }

    @ApiOperation({ summary: 'Create a new bet' })
    @ApiOkResponse({ description: 'Bet created successfully' })
    @ApiNotFoundResponse({ description: 'Bet not found' })
    @Post('create')
    async createBet(@CurrentUser() user: UserDto, @Body() body : CreateRequest) {
        const win : string = "-1";
        const { gamble_id, stake } = body;
        return await this.betService.create(user.id, win, gamble_id, stake); 
    }

    @ApiOperation({ summary: 'Get current bets for a user' })
    @ApiOkResponse({ description: 'Current bets fetched successfully' })
    @ApiNotFoundResponse({ description: 'Current bets not found' })
    @Get('current/:user_id')
    async getCurrentBets(@CurrentUser() user: UserDto, @Param('user_id') userId: number) {
        if (user.id !== userId) {
            throw new BadRequestException('User ID does not match current user');
        }
        return await this.betService.getCurrentBets(userId);
    }

    @ApiOperation({ summary: 'Get finished bets for a user' })
    @ApiOkResponse({ description: 'Finished bets fetched successfully' })
    @ApiNotFoundResponse({ description: 'Finished bets not found' })
    @Get('finished/:user_id')
    async getFinishedBets(@CurrentUser() user: UserDto, @Param('user_id') userId: number) {
        if (user.id !== userId) {
            throw new BadRequestException('User ID does not match current user');
        }
        return await this.betService.getFinishedBets(userId);
    }

    @ApiOperation({ summary: 'Get selected bets for a user' })
    @ApiOkResponse({ description: 'Selected bets fetched successfully' })
    @ApiNotFoundResponse({ description: 'Selected bets not found' })
    @Get('selectionUser/:user_id')
    async getSelectedBets(@CurrentUser() user: UserDto, @Param('user_id') userId: number) {
        if (user.id !== userId) {
            throw new BadRequestException('User ID does not match current user');
        }
        return await this.betService.getSelectedBets(userId);
    }

    @ApiOperation({ summary: 'Get bets by Id' })
    @ApiOkResponse({ description: 'Bets fetched successfully' })
    @ApiNotFoundResponse({ description: 'Bets not found' })
    @Get(':id')
    async getBetById(@CurrentUser() user: UserDto, @Param('id') id: number) {
        return await this.betService.findById(id, user);
    }
}