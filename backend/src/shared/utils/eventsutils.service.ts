import { Injectable } from "@nestjs/common";
import { HttpUtils } from "./http.utils";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EventUtilsService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly feedUrl: string;
    private readonly highlanderUrl: string;

    constructor(
        private readonly httpUtils: HttpUtils,
        private readonly configService: ConfigService,
    ) {
        const lolesportsConfig = this.configService.get('apiConfig.lolesports');
        this.apiKey = lolesportsConfig.apiKey;
        this.baseUrl = lolesportsConfig.baseUrl;
        this.feedUrl = lolesportsConfig.feedUrl;
        this.highlanderUrl = lolesportsConfig.highlanderUrl;
    }

    async getSchedule(params: { hl: string, leagueId?: any, pageToken?: any } = { hl: 'fr-FR', leagueId: undefined, pageToken: undefined }) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getSchedule`,
                    {
                        params: {
                            hl: params.hl,
                            leagueId: params.leagueId,
                            pageToken: params.pageToken
                        },
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );

                return response.data.data.schedule;
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch schedule', error);
        }
    }

    async getLive(params: { hl: string } = { hl: 'fr-FR' }) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getLive`,
                    {
                        params: {
                            hl: typeof params === 'string' ? params : (params.hl)
                        },
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );

                return response.data.data.schedule.events || [];
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch live events', error);
        }
    }

    async getCompletedEvents(params: { hl?: string, tournamentId?: string } = { hl: 'fr-FR', tournamentId: undefined }) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getCompletedEvents`,
                    {
                        params: {
                            hl: params.hl,
                            tournamentId: params.tournamentId
                        },
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );

                return response.data.data.schedule.events || [];
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch completed events', error);
        }
    }

    async getEventDetails(id: string, locale: string = 'fr-FR') {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getEventDetails`,
                    {
                        params: {
                            hl: locale,
                            id: id
                        },
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );

                if (!response.data?.data?.event) {
                    return null;
                }

                return response.data.data.event;
            });
        } catch (error) {
            if (error.response) {
                //console.error(`API Response Status: ${error.response.status}`);
                //console.error(`API Response Data:`, error.response.data);
            }
            return this.httpUtils.handleApiError(`Failed to fetch event details for ID: ${id}`, error);
        }
    }

    async mapEventToMatch(event: any) {
        if (!event) return null; // Extraire les informations de l'événement pour créer un objet match
        const match = {
            id: event.match?.id || event.id,
            league: event.league ? {
                id: event.league.id,
                name: event.league.name,
                slug: event.league.slug,
                image: event.league.image
            } : null,
            tournament: event.tournament || null,
            startDate: await this.determineMatchStartDate(event),
            state: await this.determineMatchState(event),
            bestOf: event.match?.strategy?.count || 1,
            teams: event.match?.teams?.map(team => ({
                id: team.id,
                code: team.code,
                name: team.name,
                image: team.image,
                result: team.result || null
            })) || [],
            games: [],
            winner: null,
            winnerId: null,
            loser: null,
            loserId: null,
        };

        // Déterminer le vainqueur et le perdant si le match est terminé
        if (match.state === 'completed' && match.teams && match.teams.length > 0) {
            const winner = match.teams.find(team =>
                team.result && team.result.outcome === 'win');
            const loser = match.teams.find(team =>
                team.result && team.result.outcome === 'loss');

            if (winner) {
                match.winner = winner;
                match.winnerId = winner.id;
            }

            if (loser) {
                match.loser = loser;
                match.loserId = loser.id;
            }
        }

        return match;
    }

    async determineMatchStartDate(event) {
        const id = event.match?.id || event.id;
        const schedule = await this.getSchedule({ hl: "fr-FR" });
        const scheduledEvent = schedule.events.find(e => e.match?.id === id);
        const startTime = scheduledEvent?.startTime;
        const eventDetails = await this.getEventDetails(id, "fr-FR");

        const startDate = eventDetails?.startDate || startTime;
        return startDate ? new Date(startDate) : null;
    }

    async determineMatchState(event) {
        let matchState = event.match?.state || event.state;
        if (!event || !event.match)
            matchState = 'unstarted';

        if (matchState === 'unstarted') {
            const startTime = await this.determineMatchStartDate(event);
            if (startTime && new Date(startTime) < new Date()) {
                console.log(`⚠️ State determined by date for ${event.id}: past but no clear data`);
                return 'inProgress';
            }
        }

        // 1. Première vérification: résultats des équipes
        if (event.match.teams && event.match.teams.length > 0) {
            const hasOutcome = event.match.teams.some(team =>
                team.result && team.result.outcome
            );

            if (hasOutcome) {
                return 'completed';
            }

            const teamResults = event.match.teams.map(team => team.result?.gameWins || 0);
            const totalWins = teamResults.reduce((sum, wins) => sum + wins, 0);

            if (totalWins > 0) {
                const matchFormat = event.match.strategy?.count || 0;
                const winThreshold = Math.ceil(matchFormat / 2); // Nombre de victoires nécessaires

                if (teamResults.some(wins => wins >= winThreshold)) {
                    return 'completed';
                } else {
                    return 'inProgress';
                }
            }

            return matchState;
        }

        // 2. Deuxième vérification: état des jeux (si disponibles)
        if (event.match.games && event.match.games.length > 0) {
            const gameStates = event.match.games.map(game => game.state);

            if (gameStates.includes('inProgress')) {
                return 'inProgress';
            } else if (gameStates.every(state => state === 'completed' || state === 'unneeded')) {
                return 'completed';
            } else if (gameStates.some(state => state === 'completed')) {
                return 'inProgress';
            }
        }

        // 3. Troisième vérification: présence de VODs (si disponibles)
        let hasVods = false;
        if (event.match.games) {
            hasVods = event.match.games.some(game =>
                game.vods && game.vods.length > 0
            );

            if (hasVods) {
                return 'completed';
            }
        }
        return 'unstarted';
    }
}