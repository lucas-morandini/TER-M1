import League from './League.interface';
import Player from './Player.interface';

export default interface TeamInterface {
    name: string;
    slug: string;
    id : string;
    image: string;
    alternativeImage: string;
    homeLeague: League;
    players: Player[];
}