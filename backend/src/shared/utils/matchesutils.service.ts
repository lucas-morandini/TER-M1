import { Injectable } from "@nestjs/common";
import { HttpUtils } from "./http.utils";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import { EventUtilsService } from "./eventsutils.service";
import { MatchesService } from "src/modules/matches/matches.service";
import { Gamble } from "src/modules/gambles/entities/gamble.entity";
import { GamblesService } from "src/modules/gambles/gambles.service";
import { Match } from "src/modules/matches/entities/match.entity";
import { MatchTeam } from "src/modules/matches/entities/matchteam.entity";

@Injectable()
export class MatchesUtilsService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly feedUrl: string;
    private readonly highlanderUrl: string;
    private readonly colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",

        fg: {
            black: "\x1b[30m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            crimson: "\x1b[38m"
        },
        bg: {
            black: "\x1b[40m",
            red: "\x1b[41m",
            green: "\x1b[42m",
            yellow: "\x1b[43m",
            blue: "\x1b[44m",
            magenta: "\x1b[45m",
            cyan: "\x1b[46m",
            white: "\x1b[47m",
            crimson: "\x1b[48m"
        }
    };
    constructor(
        private readonly httpUtils: HttpUtils,
        private readonly configService: ConfigService,
        private readonly eventsService: EventUtilsService,
        private readonly gambleService: GamblesService,
        private readonly matchService: MatchesService
    ) {
        const lolesportsConfig = this.configService.get('apiConfig.lolesports');
        this.apiKey = lolesportsConfig.apiKey;
        this.baseUrl = lolesportsConfig.baseUrl;
        this.feedUrl = lolesportsConfig.feedUrl;
        this.highlanderUrl = lolesportsConfig.highlanderUrl;
    }

    logRequestDetails = (method, url, params, headers) => {
        //console.log(`${colors.bg.blue}${colors.fg.white}============ API REQUEST DETAILS ============${colors.reset}`);
        //console.log(`${colors.bright}${colors.fg.blue}Method:${colors.reset} ${method}`);
        //console.log(`${colors.bright}${colors.fg.blue}URL:${colors.reset} ${url}`);
        //console.log(`${colors.bright}${colors.fg.blue}Params:${colors.reset}`, JSON.stringify(params, null, 2));
        //console.log(`${colors.bright}${colors.fg.blue}Headers:${colors.reset}`, JSON.stringify(headers, null, 2));
        //console.log(`${colors.bg.blue}${colors.fg.white}===========================================${colors.reset}`);
    };

    // Fonction d'aide pour logger les détails des réponses
    logResponseDetails = (status, data) => {
        const statusColor = status >= 200 && status < 300 ? this.colors.fg.green : this.colors.fg.red;

        //console.log(`${colors.bg.green}${colors.fg.black}============ API RESPONSE DETAILS ============${colors.reset}`);
        //console.log(`${colors.bright}${colors.fg.green}Status:${colors.reset} ${statusColor}${status}${colors.reset}`);
        //console.log(`${colors.bright}${colors.fg.green}Data:${colors.reset}`, typeof data === 'object' ? JSON.stringify(data, null, 2).substring(0, 500) + '...' : data);
        //console.log(`${colors.bg.green}${colors.fg.black}============================================${colors.reset}`);
    };

    async getMatchById(id, locale = 'fr-FR') {
        try {
            console.log(`${this.colors.fg.cyan}⏳ Fetching details for match ID: ${this.colors.bright}${id}${this.colors.reset}`);

            const schedule = await this.eventsService.getSchedule({ hl: locale });
            const scheduledEvent = schedule.events.find(e => e.match?.id === id);
            const startTime = scheduledEvent?.startTime;
            // Récupérer les détails de l'événement
            const eventDetails = await this.eventsService.getEventDetails(id, locale);

            if (!eventDetails) {
                console.log(`${this.colors.fg.yellow}⚠️ No event details found for match ID: ${this.colors.bright}${id}${this.colors.reset}`);
                return null;
            }
            console.log(`${this.colors.fg.green}✅ Successfully retrieved event details for match ID: ${this.colors.bright}${id}${this.colors.reset}`);

            // Convertir en objet Match
            console.log(`${this.colors.fg.magenta}🔄 Converting event to match object for ID: ${this.colors.bright}${id}${this.colors.reset}`);
            const match = await this.eventsService.mapEventToMatch(eventDetails);
            if (!match) {
                console.log(`${this.colors.fg.yellow}⚠️ No match data found for event ID: ${this.colors.bright}${id}${this.colors.reset}`);
                return null;
            }
            match.startDate = startTime || match.startDate;
            console.log(`${this.colors.fg.yellow}⚠️ No games found for match ID: ${this.colors.bright}${id}${this.colors.reset}`);
            match.games = [];

            // Déterminer le vainqueur si match terminé
            if (match.state === 'completed' && match.teams) {
                //console.log(`${this.colors.fg.magenta}🏆 Determining winner for completed match ID: ${this.colors.bright}${id}${this.colors.reset}`);

                const winner = match.teams.find(team =>
                    team.result && team.result.outcome === 'win');
                const loser = match.teams.find(team =>
                    team.result && team.result.outcome === 'loss');

                if (winner) {
                    match.winner = winner;
                    //console.log(`${this.colors.fg.green}Winner team: ${this.colors.bright}${winner.name || winner.id}${this.colors.reset}`);
                }

                if (loser) {
                    match.loser = loser;
                    //console.log(`${this.colors.fg.yellow}Loser team: ${this.colors.bright}${loser.name || loser.id}${this.colors.reset}`);
                }
            }

            console.log(`${this.colors.fg.green}✅ Match processing complete for ID: ${this.colors.bright}${id}${this.colors.reset}`);
            // debug match
            console.log(match);
            console.log(`${this.colors.fg.green}====== MATCH DATA  ======== ${this.colors.bright}${id}${this.colors.reset}`);
            return match;
        } catch (error) {
            console.error(`${this.colors.bg.red}${this.colors.fg.white} ERROR ${this.colors.reset} ${this.colors.fg.red}Detailed error fetching match ${this.colors.bright}${id}${this.colors.reset}${this.colors.fg.red}:${this.colors.reset}`, error);

            // Vérifier si c'est une erreur d'API spécifique
            if (error.response) {
                //console.error(`${this.colors.fg.red}API Response Status: ${this.colors.bright}${error.response.status}${this.colors.reset}`);
                //console.error(`${this.colors.fg.red}API Response Data:${this.colors.reset}`, JSON.stringify(error.response.data, null, 2));
                //console.error(`${this.colors.fg.red}API Request URL: ${this.colors.bright}${error.response.config.url}${this.colors.reset}`);
                //console.error(`${this.colors.fg.red}API Request Params:${this.colors.reset}`, error.response.config.params);
            }

            return this.httpUtils.handleApiError(`Failed to fetch match details for ID: ${id}`, error);
        }
    }


    async getMatchesByTournament(tournamentId, locale = 'fr-FR') {
        try {
            //console.log(`${colors.bg.magenta}${colors.fg.white}================ TOURNAMENT MATCHES =================${colors.reset}`);
            //console.log(`${colors.fg.magenta}⏳ Fetching matches for tournament ID: ${colors.bright}${tournamentId}${colors.reset}`);

            // Construire l'URL et les paramètres pour la requête getCompletedEvents
            const completedEventsUrl = `${this.baseUrl}/getCompletedEvents`;
            const completedEventsParams = {
                hl: locale,
                tournamentId: Array.isArray(tournamentId) ? tournamentId : [tournamentId]
            };
            const headers = {
                'x-api-key': this.apiKey
            };

            // Logger les détails de la requête
            this.logRequestDetails('GET', completedEventsUrl, completedEventsParams, headers);

            const completedEvents = await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    completedEventsUrl,
                    {
                        params: completedEventsParams,
                        headers: headers
                    }
                );

                // Logger les détails de la réponse
                this.logResponseDetails(response.status, response.data);

                return response.data.data.schedule.events || [];
            });

            //console.log(`${colors.fg.green}✅ Found ${colors.bright}${completedEvents.length}${colors.reset}${colors.fg.green} completed events for tournament ${colors.bright}${tournamentId}${colors.reset}`);

            const matches: any[] = [];

            //console.log(`${colors.bg.cyan}${colors.fg.black}=========== PROCESSING INDIVIDUAL MATCHES ===========${colors.reset}`);
            for (const event of completedEvents) {
                if (event.type === 'match' && event.match && event.match.id) {
                    //console.log(`${colors.fg.cyan}🔄 Processing match event: ${colors.bright}${event.match.id}${colors.reset}${colors.fg.cyan} from tournament ${colors.bright}${tournamentId}${colors.reset}`);
                    const match = await this.getMatchById(event.match.id, locale);
                    if (match) {
                        matches.push(match);
                        //console.log(`${colors.fg.green}✅ Successfully processed match ${colors.bright}${event.match.id}${colors.reset}`);
                    } else {
                        //console.log(`${colors.fg.red}❌ Failed to process match ${colors.bright}${event.match.id}${colors.reset}`);
                    }
                } else {
                    //console.log(`${colors.fg.yellow}⚠️ Skipping non-match event or invalid match structure:${colors.reset}`, event);
                }
            }
            //console.log(`${colors.bg.cyan}${colors.fg.black}=====================================================${colors.reset}`);

            //console.log(`${colors.bg.green}${colors.fg.black} SUCCESS ${colors.reset} ${colors.fg.green}Retrieved ${colors.bright}${matches.length}${colors.reset}${colors.fg.green} matches for tournament ${colors.bright}${tournamentId}${colors.reset}`);
            return matches;
        } catch (error) {
            //console.error(`${colors.bg.red}${colors.fg.white} ERROR ${colors.reset} ${colors.fg.red}Error fetching tournament matches for tournament ${colors.bright}${tournamentId}${colors.reset}${colors.fg.red}:${colors.reset}`, error);

            if (error.response) {
                //console.error(`${colors.fg.red}API Response Status: ${colors.bright}${error.response.status}${colors.reset}`);
                //console.error(`${colors.fg.red}API Response Data:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
                //console.error(`${colors.fg.red}API Request URL: ${colors.bright}${error.response.config.url}${colors.reset}`);
                //console.error(`${colors.fg.red}API Request Params:${colors.reset}`, error.response.config.params);
            }

            return this.httpUtils.handleApiError(`Failed to fetch tournament matches for tournament ${tournamentId}`, error);
        }
    }


    async getTeamMatchesInTournament(teamId, tournamentId, locale = 'fr-FR') {
        try {
            //console.log(`${colors.bg.yellow}${colors.fg.black}================ TEAM TOURNAMENT MATCHES =================${colors.reset}`);
            //console.log(`${colors.fg.yellow}⏳ Fetching matches for team ${colors.bright}${teamId}${colors.reset}${colors.fg.yellow} in tournament ${colors.bright}${tournamentId}${colors.reset}`);

            const tournamentMatches = await this.getMatchesByTournament(tournamentId, locale);
            if (!tournamentMatches || tournamentMatches.length === 0) {
                //console.log(`${colors.fg.yellow}⚠️ No matches found for team ${colors.bright}${teamId}${colors.reset}${colors.fg.yellow} in tournament ${colors.bright}${tournamentId}${colors.reset}`);
                return [];
            }
            const teamMatches = tournamentMatches.filter(match =>
                match.teams && match.teams.some(team => team.id === teamId)
            );

            //console.log(`${colors.fg.green}✅ Found ${colors.bright}${teamMatches.length}${colors.reset}${colors.fg.green} matches for team ${colors.bright}${teamId}${colors.reset}${colors.fg.green} in tournament ${colors.bright}${tournamentId}${colors.reset}`);

            return teamMatches;
        } catch (error) {
            //console.error(`${colors.bg.red}${colors.fg.white} ERROR ${colors.reset} ${colors.fg.red}Error fetching team matches for team ${colors.bright}${teamId}${colors.reset}${colors.fg.red} in tournament ${colors.bright}${tournamentId}${colors.reset}${colors.fg.red}:${colors.reset}`, error);

            if (error.response) {
                //console.error(`${colors.fg.red}API Response Status: ${colors.bright}${error.response.status}${colors.reset}`);
                //console.error(`${colors.fg.red}API Response Data:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
            }

            return this.httpUtils.handleApiError(`Failed to fetch team matches for team ${teamId} in tournament ${tournamentId}`, error);
        }
    }


    async syncAndFetchMatches(locale = 'fr-FR') {
        // Get current date
        const now = new Date();

        // Fetch live events
        const liveEvents = await this.eventsService.getLive({ hl: locale });
        console.log(`Found ${liveEvents.length} live match events`);

        // Fetch scheduled events
        const schedule = await this.eventsService.getSchedule({ hl: locale });
        console.log(`Found ${schedule.events.length} scheduled match events`);

        // Fetch current year matches
        const currentYear = now.getFullYear();
        // Gather matches from completed events then filter by current year
        const completedEventsResponse = await this.eventsService.getCompletedEvents({ hl: locale });

        // Vérifier si la structure de réponse est correcte
        const completedEvents = completedEventsResponse.events ??
            (completedEventsResponse.data?.schedule?.events ?? []);

        console.log(`Found ${completedEvents.length} completed match events`);

        // Filter completed events by current year
        const currentYearEvents = completedEvents.filter((event: any) => {
            const eventDate = new Date(event.startTime);
            return eventDate.getFullYear() === currentYear;
        });

        console.log(`Found ${currentYearEvents.length} match events from current year`);

        // Combine events
        const allEvents = [...liveEvents, ...schedule.events, ...currentYearEvents];
        console.log(`Processing ${allEvents.length} total match events`);

        // Process events in parallel batches for better performance
        const batchSize = 5; // Adjust based on API rate limits
        for (let i = 0; i < allEvents.length; i += batchSize) {
            const batch = allEvents.slice(i, i + batchSize);
            await Promise.all(batch.map(async (event) => {
                try {
                    const matchId = event.match?.id;
                    if (!matchId) return;

                    const matchDetails = await this.getMatchById(matchId, locale);
                    if (!matchDetails) return;

                    // Save match data - sans les games
                    await this.saveMatchData(matchDetails, now);
                    console.log(`${this.colors.fg.green}Match ${matchDetails.id} saved successfully${this.colors.reset}`);
                } catch (error) {
                    console.log(`Error processing match event: ${error.message}`);
                }
            }));
        }

        // Return matches with applied filters
        return this.matchService.findAll();
    }


    async saveMatchData(matchDetails: any, now: Date) {
    try {
        const team1 = matchDetails.teams?.[0];
        const team2 = matchDetails.teams?.[1];
        console.log(`Saving match ${matchDetails.id} with teams: ${team1?.name} vs ${team2?.name}`);
        
        // 1. Fetch odds data
        let oddsData = null;
        try {
            if (team1?.name && team2?.name) {
                const odds = await axios.get(`http://ter_m1_model:8000/api/odds/${encodeURIComponent(team1.name)}/${encodeURIComponent(team2.name)}`);
                oddsData = odds.data;
                console.log(`Odds for match ${matchDetails.id}:`, oddsData);
            }
        } catch (oddsError) {
            console.log(`Failed to fetch odds for match ${matchDetails.id}: ${oddsError.message}`);
        }

        // 2. Create and save the match record FIRST
        const matchBD = new Match();
        matchBD.id = matchDetails.id;
        matchBD.leagueId = matchDetails.league?.id;
        matchBD.tournamentId = matchDetails.tournament?.id;
        matchBD.startDate = matchDetails.startDate;
        matchBD.state = matchDetails.state;
        matchBD.bestOf = matchDetails.bestOf;
        matchBD.winnerId = matchDetails.winner?.id;
        matchBD.loserId = matchDetails.loser?.id;
        matchBD.isBettable = matchDetails.state === 'unstarted' && new Date(matchDetails.startDate) > now;
        // Note: We'll set idBet1 and idBet2 after creating the gambles

        await this.matchService.upsert(matchBD);
        console.log(`Match ${matchDetails.id} record saved`);

        // 3. Now create the gambles (they can reference the existing match)
        const gamble_team1BD = new Gamble();
        gamble_team1BD.odds = oddsData?.[team1?.name] || 1.5;
        gamble_team1BD.win = '-1';
        gamble_team1BD.is_available = true;
        gamble_team1BD.team_id = team1?.id;
        gamble_team1BD.match_id = matchDetails.id; // Now this match exists in DB
        const gamble_team1 = await this.gambleService.create(gamble_team1BD);

        const gamble_team2BD = new Gamble();
        gamble_team2BD.odds = oddsData?.[team2?.name] || 1.5;
        gamble_team2BD.win = '-1';
        gamble_team2BD.is_available = true;
        gamble_team2BD.team_id = team2?.id;
        gamble_team2BD.match_id = matchDetails.id; // Now this match exists in DB
        const gamble_team2 = await this.gambleService.create(gamble_team2BD);

        // 4. Update the match with the gamble IDs
        matchBD.idBet1 = gamble_team1.id;
        matchBD.idBet2 = gamble_team2.id;
        await this.matchService.upsert(matchBD);

        // 5. Save team relationships
        if (matchDetails.teams?.length) {
            await Promise.all(matchDetails.teams.map(async (team: any) => {
                const matchTeamBD = new MatchTeam();
                matchTeamBD.matchId = matchDetails.id;
                matchTeamBD.teamId = team.id;
                await this.matchService.upsertMatchTeam(matchTeamBD);
            }));
        }

        console.log(`Match ${matchDetails.id} saved successfully`);
    } catch (error) {
        console.log(`Error saving match ${matchDetails.id}: ${error.message}`);
        throw error;
    }
}
}