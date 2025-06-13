import { DataBaseObject } from "../commons/DataBaseObject";
import TeamInterface from "./interface/Team.interface";
import { League } from "./League";
import { Player } from "./Player";


export class Team extends DataBaseObject implements TeamInterface {
    name: string;
    slug: string;
    image: string;
    alternativeImage: string;
    region: string;
    homeLeague: League;
    players: Player[];

    constructor(
        id: number,
        name: string,
        slug: string,
        image: string,
        alternativeImage: string,
        region: string,
        homeLeague: League,
        players: Player[],
        createdAt: Date,
        updatedAt: Date
    ) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.slug = slug;
        this.image = image;
        this.alternativeImage = alternativeImage;
        this.region = region;
        this.homeLeague = homeLeague;
        this.players = players;
    }

    // Implémentation de la méthode abstraite toJSON
    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            slug: this.slug,
            image: this.image,
            alternativeImage: this.alternativeImage,
            region: this.region,
            homeLeague: this.homeLeague,
            players: this.players,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }
}
