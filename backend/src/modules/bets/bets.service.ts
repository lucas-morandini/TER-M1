import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GamblesService } from '../gambles/gambles.service';
import { Gamble } from '../gambles/entities/gamble.entity';
import { MatchesService } from '../matches/matches.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class BetsService {

    constructor(
        @InjectRepository(Bet)
        private readonly betRepository: Repository<Bet>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly gambleService : GamblesService,
    ) {}

    async findAll(): Promise<Bet[]> {
        return await this.betRepository.find();
    }

    async findByMatchId(matchId: string): Promise<Bet[]> {
        // TODO - Implement logic to find bets by match ID
        return [];
    }

    async findById(id: number, user: UserDto): Promise<Bet | null> {
        const bet = await this.betRepository.findOne({
            where: { id }
        });
        if (!bet) {
            throw new NotFoundException('Bet not found');
        }
        if (bet.user_id !== user.id) {
            throw new BadRequestException('You do not have permission to view this bet');
        }
        return bet;
    }

    async create(userId: number, win: string, gambleId: number, stake: number): Promise<Bet> {
        const user : User | null = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const gamble : Gamble | null = await this.gambleService.findById(gambleId);
        if (!gamble) {
            throw new NotFoundException('Gamble not found');
        }
        if (stake <= 0) {
            throw new BadRequestException('Stake must be greater than zero');
        }
        if(user.solde < stake){
            throw new BadRequestException('Insufficient balance to place bet');
        }
        const odds = gamble.odds;
        const bet : Bet = this.betRepository.create({
            user_id: userId,
            win: win,
            odds: odds,
            gamble_id: gambleId,
            stake : stake,
            paid: true,
        });
        await this.betRepository.save(bet);
        user.solde -= stake;
        await this.userRepository.save(user);
        return bet;
    }


    async getCurrentBets(userId: number): Promise<number[]> {
        const bets = await this.betRepository.find({
            where: { user_id: userId, win: '-1' },
        });
        if (!bets || bets.length === 0) {
            throw new NotFoundException('No current bets found for this user');
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        for (const bet of bets) {
            const gamble = await this.gambleService.findById(bet.gamble_id);
            if (!gamble) {
                throw new NotFoundException(`Gamble with ID ${bet.gamble_id} not found`);
            }
            const match = await this.gambleService.getMatchByGambleId(bet.gamble_id);
            if (match) {
                const winner_id = match.winnerId;
                if (winner_id) {
                    if(gamble.team_id == winner_id)
                    {
                        bet.win = "1";
                        user.solde += bet.stake * bet.odds;
                        await this.userRepository.save(user);
                        await this.betRepository.save(bet);
                    }else{
                        bet.win = "0";
                        await this.betRepository.save(bet);
                    }
                }
            }
        }
        const updatedBets = await this.betRepository.find({
            where: { user_id: userId, win: '-1' },
        });
        if (!updatedBets || updatedBets.length === 0) {
            throw new NotFoundException('No current bets found for this user');
        }
        // retourner uniquement les ids des bets
        const betsIds = await Promise.all(updatedBets.map(async bet => bet.id));
        return betsIds;
    }

    async getFinishedBets(userId: number): Promise<number[]> {
        const bets = await this.betRepository.find({
            where: [
            { user_id: userId, win: '0' },
            { user_id: userId, win: '1' },
            ],
        });
        if (!bets || bets.length === 0) {
            throw new NotFoundException('No finished bets found for this user');
        }
        const betsIds = await Promise.all(bets.map(async bet => bet.id));
        return betsIds;
    }

    async getSelectedBets(userId: number): Promise<number[]> {
        const bets = await this.betRepository.find({
            where: { user_id: userId, win: '-1' },
        });
        if (!bets || bets.length === 0) {
            throw new NotFoundException('No selected bets found for this user');
        }
        return await Promise.all(bets.map(async bet => bet.id));
    }
}
