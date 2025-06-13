import LeagueInterface from "./League.interface";
import TeamInterface from "./Team.interface";

export default interface GameInterface {
    id : string;
    state : string;
    teamBlue : TeamInterface;
    teamRed : TeamInterface;
    league : LeagueInterface;
}
