import { DataBaseObject } from "../commons/DataBaseObject"; // Assurez-vous d'importer DataBaseObject
import GambleInterface from "./interface/Gamble.interface";

export class Gamble extends DataBaseObject implements GambleInterface {
  odds: number;
  win: string;
  is_available: boolean;

  constructor(
    id: number,
    odds: number,
    win: string,
    is_available: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.odds = odds;
    this.win = win;
    this.is_available = is_available;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      odds: this.odds,
      win: this.win,
      is_available: this.is_available,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
