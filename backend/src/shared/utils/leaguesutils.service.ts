import { Injectable } from "@nestjs/common";
import { HttpUtils } from "./http.utils";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LeagueUtilsService {
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

    async getLeagues(params = { hl: 'fr-FR' }) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(`${this.baseUrl}/getLeagues`, {
                    params,
                    headers: {
                        'x-api-key': this.apiKey
                    }
                });
                return response.data.data.leagues;
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch leagues', error);
        }
    }

    async getTournamentsForLeague(params) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getTournamentsForLeague`,
                    {
                        params,
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );
                return response.data.data.leagues[0]?.tournaments || [];
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch tournaments', error);
        }
    }

    async getStandings(params) {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(
                    `${this.baseUrl}/getStandings`,
                    {
                        params,
                        headers: {
                            'x-api-key': this.apiKey
                        }
                    }
                );
                return response.data.data.standings;
            });
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch standings', error);
        }
    }

    async getLeagueById(id, locale = 'fr-FR') {
        try {
            const leagues = await this.getLeagues({ hl: locale });
            return leagues.find(league => league.id === id) || null;
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch league by id', error);
        }
    }
}