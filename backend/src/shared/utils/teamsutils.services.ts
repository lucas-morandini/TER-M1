import { Injectable } from "@nestjs/common";
import { HttpUtils } from "./http.utils";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import { EventUtilsService } from "./eventsutils.service";

@Injectable()
export class TeamsUtilsService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly feedUrl: string;
    private readonly highlanderUrl: string;
    constructor(
        private readonly httpUtils: HttpUtils,
        private readonly configService: ConfigService,
        private readonly eventsService: EventUtilsService,
    ) {
        const lolesportsConfig = this.configService.get('apiConfig.lolesports');
        this.apiKey = lolesportsConfig.apiKey;
        this.baseUrl = lolesportsConfig.baseUrl;
        this.feedUrl = lolesportsConfig.feedUrl;
        this.highlanderUrl = lolesportsConfig.highlanderUrl;
    }

    async getTeams(teamSlugs: any[] = [], locale = 'fr-FR') {
        try {
            return await this.httpUtils.withRetry(async () => {
                const response = await axios.get(`${this.baseUrl}/getTeams`, {
                    params: {
                        hl: locale,
                        id: teamSlugs
                    },
                    headers: {
                        'x-api-key': this.apiKey
                    }
                });
                return response.data.data.teams;
            });
        } catch (error) {
            console.error('Error fetching teams:', error);
            return this.httpUtils.handleApiError('Failed to fetch teams', error);
        }
    }

    async getTeamById(id, locale = 'fr-FR') {
        try {
            const teams = await this.getTeams([id], locale);
            return teams.length > 0 ? teams[0] : null;
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch team by id', error);
        }
    }

    async getTeamBySlug(slug, locale = 'fr-FR') {
        try {
            const teams = await this.getTeams([slug], locale);
            return teams.length > 0 ? teams[0] : null;
        } catch (error) {
            return this.httpUtils.handleApiError('Failed to fetch team by slug', error);
        }
    }
}