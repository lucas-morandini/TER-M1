import { DataBaseObject } from "./commons/DataBaseObject";
import TournamentInterface from "./commons/interface/Tournament.interface";


export class Tournament extends DataBaseObject implements TournamentInterface {
  slug: string;
  startDate: string;
  endDate: string;

  constructor(
    id: number,
    slug: string,
    startDate: string,
    endDate: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.slug = slug;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      slug: this.slug,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
