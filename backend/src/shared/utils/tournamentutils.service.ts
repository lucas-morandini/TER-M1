import { Injectable } from "@nestjs/common";
import { HttpUtils } from "./http.utils";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import { EventUtilsService } from "./eventsutils.service";
import { LeaguesService } from "src/modules/leagues/leagues.service";
import { LeagueUtilsService } from "./leaguesutils.service";

@Injectable()
export class TournamentUtilsService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly feedUrl: string;
    private readonly highlanderUrl: string;
    constructor(
        private readonly httpUtils: HttpUtils,
        private readonly configService: ConfigService,
        private readonly eventsService: EventUtilsService,
        private readonly leaguesService: LeaguesService,
        private readonly leaguesUtilsService: LeagueUtilsService
    ) {
        const lolesportsConfig = this.configService.get('apiConfig.lolesports');
        this.apiKey = lolesportsConfig.apiKey;
        this.baseUrl = lolesportsConfig.baseUrl;
        this.feedUrl = lolesportsConfig.feedUrl;
        this.highlanderUrl = lolesportsConfig.highlanderUrl;
    }


    async getTournaments(params = {}) {
        try {
            // Récupérer les leagues depuis la DB ou l'API
            let leagues = await this.leaguesService.findAll();
            if (!leagues.length) {
                const apiLeagues = await this.leaguesUtilsService.getLeagues();
                leagues = apiLeagues || [];
            }

            if (!leagues.length) {
                console.warn('No leagues found to fetch tournaments');
                return [];
            }

            // Créer une requête par league
            const tournamentPromises = leagues.map(league =>
                this.fetchTournamentsForLeague(league.id, params)
            );

            // Exécuter toutes les requêtes en parallèle
            const tournamentsByLeague = await Promise.all(tournamentPromises);

            // Aplatir et dédupliquer les tournois
            return this.deduplicateTournaments(tournamentsByLeague.flat());
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            return this.httpUtils.handleApiError('Failed to fetch tournaments', error);
        }
    }

    async fetchTournamentsForLeague(leagueId, params = {}) {
        try {
            const response = await this.httpUtils.withRetry(() =>
                axios.get(`${this.baseUrl}/getTournamentsForLeague`, {
                    params: { leagueId, ...params },
                    headers: { 'x-api-key': this.apiKey }
                })
            );

            // Vérifier et extraire les données de tournois
            if (response?.data?.data?.leagues?.[0]?.tournaments) {
                return response.data.data.leagues[0].tournaments;
            }

            console.warn(`No tournaments found for league: ${leagueId}`);
            return [];
        } catch (error) {
            console.error(`Error fetching tournaments for league ${leagueId}:`, error);
            return []; // Continuer avec les autres leagues même si une échoue
        }
    }

    deduplicateTournaments(tournaments) {
        const uniqueTournaments: any[] = [];
        const seenIds = new Set();

        for (const tournament of tournaments) {
            if (!seenIds.has(tournament.id)) {
                seenIds.add(tournament.id);
                uniqueTournaments.push(tournament);
            }
        }

        return uniqueTournaments;
    }

    async getTournament(id) {
        try {
            const response = await this.httpUtils.withRetry(() =>
                axios.get(`${this.baseUrl}/getTournament`, {
                    params: { id },
                    headers: { 'x-api-key': this.apiKey }
                })
            );

            return response?.data?.data?.tournament;
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch tournament details', error);
        }
    }

    async getStandings(params) {
        try {
            return await this.httpUtils.withRetry(async () => {
                // Construction des paramètres de la requête
                const requestParams = {
                    hl: params.hl || 'fr-FR',
                    tournamentId: params.tournamentId
                };

                // Affiche l'URL complète avec les paramètres
                const url = `${this.baseUrl}/getStandings`;
                const queryString = Object.entries(requestParams)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
                console.log('============== REQUÊTE API ==============');
                console.log(`URL: ${url}?${queryString}`);
                console.log('Headers:', {
                    'x-api-key': this.apiKey
                });
                console.log('Params:', requestParams);
                console.log('==========================================');

                // Exécution de la requête
                const response = await axios.get(url, {
                    params: requestParams,
                    headers: {
                        'x-api-key': this.apiKey
                    }
                });

                // Affiche la réponse de l'API
                console.log('============== RÉPONSE API ==============');
                console.log('Status:', response.status);
                console.log('Data:', JSON.stringify(response.data).substring(0, 300) + '...');
                console.log('==========================================');

                return response.data.data.standings;
            });
        } catch (error) {
            console.log('============== ERREUR API ==============');
            console.log('Response data:', error.response?.data);
            console.log('Response status:', error.response?.status);
            console.log('Request URL:', error.config?.url);
            console.log('Request params:', error.config?.params);
            console.log('=========================================');

            return this.httpUtils.handleApiError('Failed to fetch tournament standings', error);
        }
    }
}