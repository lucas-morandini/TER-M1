import { DataBaseObject } from "../commons/DataBaseObject";
import LeagueInterface from "./interface/League";


export class League extends DataBaseObject implements LeagueInterface {
  name: string;
  slug: string;
  image: string;
  region: string;

  constructor(
    id: number,
    name: string,
    slug: string,
    image: string,
    region: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.slug = slug;
    this.image = image;
    this.region = region;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      slug: this.slug,
      image: this.image,
      region: this.region,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
