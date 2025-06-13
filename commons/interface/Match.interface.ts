import League from './League.interface';
import Tournament from './Tournament.interface';
import Team from './Team.interface';
import Game from './Game.interface';

export default interface MatchInterface {
    id: string;
    leagueId: string;
    tournamentId: string;
    startDate: string;
    state: string;
    teams: Team[];
    bestOf: number;
    games: Game[];
    winner: Team;
    loser: Team;
    // Nouvelles propriétés pour les paris
    isBettable: boolean;
    idBet1: number;
    idBet2: number;
    betCloseTime: Date;
    // Id des paris en question 
     
}