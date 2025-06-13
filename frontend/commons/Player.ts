import { DataBaseObject } from "../commons/DataBaseObject";
import PlayerInterface from "./interface/Player.interface";

export class Player extends DataBaseObject implements PlayerInterface {
  summonerName: string;
  firstName: string;
  lastName: string;
  image: string;
  role: string;

  constructor(
    id: string,
    summonerName: string,
    firstName: string,
    lastName: string,
    image: string,
    role: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this.summonerName = summonerName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
    this.role = role;
  }

  // Implémentation de la méthode abstraite toJSON
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      summonerName: this.summonerName,
      firstName: this.firstName,
      lastName: this.lastName,
      image: this.image,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
