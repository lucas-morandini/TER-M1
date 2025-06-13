import { DataBaseObject } from "../commons/DataBaseObject";
import GameInterface from "./interface/Game.interface";
import { Team } from "./Team";
import { League } from "./League";

export class Game extends DataBaseObject implements GameInterface {
  state: string;
  teamBlue: Team;
  teamRed: Team;
  league: League;

  constructor(
    id: number,
    state: string,
    teamBlue: Team,
    teamRed: Team,
    league: League,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.state = state;
    this.teamBlue = teamBlue;
    this.teamRed = teamRed;
    this.league = league;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      state: this.state,
      teamBlue: this.teamBlue,
      teamRed: this.teamRed,
      league: this.league,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
