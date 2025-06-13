import { DataBaseObject } from "../commons/DataBaseObject";
import MatchInterface from "./interface/Match.interface";
import { League } from "./League";
import { Team } from "./Team";
import { Game } from "./Game";
import { Tournament } from "../Tournament";

export class Match extends DataBaseObject implements MatchInterface {
  sport: string;
  date: Date;
  time: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  leagueId: string;
  tournamentId: string;
  startDate: string;
  state: string;
  teams: Team[];
  bestOf: number;
  games: Game[];
  winner: Team;
  loser: Team;
  isBettable: boolean;
  idBet1!: number;//TODO: A changer par le bon type
  idBet2!: number;
  betCloseTime: Date;

  constructor(
    id: number,
    sport: string,
    date: Date,
    time: string,
    team1: string,
    team2: string,
    score1: number,
    score2: number,
    leagueId: string,
    tournamentId: string,
    startDate: string,
    state: string,
    teams: Team[],
    bestOf: number,
    games: Game[],
    winner: Team,
    loser: Team,
    isBettable: boolean,
    oddsTeam1: number,
    oddsTeam2: number,
    betCloseTime: Date,
    createdAt: Date,
    updatedAt: Date,
    idBet1: number = -1,
    idBet2: number = -1
  ) {
    super(id, createdAt, updatedAt);
    this.sport = sport;
    this.date = date;
    this.time = time;
    this.team1 = team1;
    this.team2 = team2;
    this.score1 = score1;
    this.score2 = score2;
    this.leagueId = leagueId;
    this.tournamentId = tournamentId;
    this.startDate = startDate;
    this.state = state;
    this.teams = teams;
    this.bestOf = bestOf;
    this.games = games;
    this.winner = winner;
    this.loser = loser;
    this.isBettable = isBettable;
    idBet1 = idBet1;
    idBet2 = idBet2;
    this.betCloseTime = betCloseTime;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      sport: this.sport,
      date: this.date,
      time: this.time,
      team1: this.team1,
      team2: this.team2,
      score1: this.score1,
      score2: this.score2,
      leagueId: this.leagueId,
      tournamentId: this.tournamentId,
      startDate: this.startDate,
      state: this.state,
      teams: this.teams,
      bestOf: this.bestOf,
      games: this.games,
      winner: this.winner,
      loser: this.loser,
      isBettable: this.isBettable,
      idBet1: this.idBet1,
      idBet2: this.idBet2,
      betCloseTime: this.betCloseTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
