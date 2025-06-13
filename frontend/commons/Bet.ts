import { DataBaseObject } from "../commons/DataBaseObject"; // Assurez-vous d'importer DataBaseObject
import BetInterface from "./interface/Bet.interface";
export class Bet extends DataBaseObject implements BetInterface {
  odds: number;
  stake: number;
  win: string;
  gamble_id: number;
  user_id: number;
  paid: boolean;
  constructor(
    id: number,
    odds: number,
    stake: number,
    win: string,
    gamble_id: number,
    user_id: number,
    paid: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.odds = odds;
    this.stake = stake;
    this.win = win;
    this.gamble_id = gamble_id;
    this.user_id = user_id;
    this.paid = paid;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      odds: this.odds,
      stake: this.stake,
      win: this.win,
      gamble_id: this.gamble_id,
      user_id: this.user_id,
      paid: this.paid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
