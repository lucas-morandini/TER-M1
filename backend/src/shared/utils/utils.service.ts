import { Injectable } from "@nestjs/common";
import { LeagueUtilsService } from "./leaguesutils.service";
import { TeamsUtilsService } from "./teamsutils.services";
import { TournamentUtilsService } from "./tournamentutils.service";
import { Tournament } from "src/modules/tournaments/entities/tournament.entity";
import { TournamentsService } from "src/modules/tournaments/tournaments.service";
import { League } from "src/modules/leagues/entities/league.entity";
import { LeaguesService } from "src/modules/leagues/leagues.service";
import { Team } from "src/modules/teams/entities/team.entity";
import { TeamsService } from "src/modules/teams/teams.service";
import { MatchesUtilsService } from "./matchesutils.service";

@Injectable()
export class UtilsService {
    constructor(
        private readonly leaguesUtilsService: LeagueUtilsService,
        private readonly teamUtilsService: TeamsUtilsService,
        private readonly tournamentsUtilsService: TournamentUtilsService,
        private readonly tournamentsService: TournamentsService,
        private readonly leaguesService: LeaguesService,
        private readonly teamService: TeamsService,
        private readonly matchsUtilsService: MatchesUtilsService
    ) {}

    async planifiedTask(locale: string) {
        try {
            const [leagues, teams, tournaments] = await Promise.all([
                this.leaguesUtilsService.getLeagues({ hl: locale }),
                this.teamUtilsService.getTeams(),
                this.tournamentsUtilsService.getTournaments({ hl: locale })
            ]);

            if (!leagues || !teams || !tournaments) {
                throw new Error('Failed to fetch leagues, teams, or tournaments');
            }

            await this.saveTournaments(tournaments);
            await this.saveLeagues(leagues);
            await this.saveTeams(teams);
            await this.matchsUtilsService.syncAndFetchMatches(locale);

        } catch (error) {
            console.error('Error in planified task:', error);
            throw new Error(`Failed to complete planified task: ${error.message}`);
        }
    }

    private async saveTournaments(tournaments: any[]): Promise<void> {
        for (const tournament of tournaments) {
            const tournamentBD = new Tournament();
            tournamentBD.id = tournament.id;
            tournamentBD.slug = tournament.slug;
            tournamentBD.startDate = tournament.startDate;
            tournamentBD.endDate = tournament.endDate;
            await this.tournamentsService.upsert(tournamentBD);
        }
    }

    private async saveLeagues(leagues: any[]): Promise<void> {
        for (const league of leagues) {
            const leagueBD = new League();
            leagueBD.id = league.id;
            leagueBD.slug = league.slug;
            leagueBD.name = league.name;
            leagueBD.region = league.region;
            leagueBD.image = league.image;
            await this.leaguesService.upsert(leagueBD);
        }
    }

    private async saveTeams(teams: any[]): Promise<void> {
        let errorCount = 0;
        
        for (const team of teams) {
            try {
                const teamBD = new Team();
                teamBD.id = team.id;
                teamBD.slug = team.slug;
                teamBD.name = team.name;
                teamBD.image = team.image;
                teamBD.alternativeImage = team.alternativeImage;
                teamBD.homeLeagueId = team.homeLeagueId;
                
                await this.teamService.upsert(teamBD);
            } catch (error) {
                console.error(`Failed to save team ${team.id}:`, error);
                errorCount++;
            }
        }

        if (errorCount > 0) {
            console.warn(`${errorCount} teams failed to save`);
        }
    }
}