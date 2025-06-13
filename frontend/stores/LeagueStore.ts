import MatchInterface from "../commons/interface/Match.interface";
import { League } from "../commons/League";
import { Match } from "../commons/Match";
import { Store } from "./Store";

export class LeagueStore extends Store<League> {
    protected single: string = 'league';
    protected multiple: string = 'leagues';

    // Helper method to get the base URL
    private getBaseUrl(): string {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return process.env['API_BASE_URL'] || 'http://localhost:3000';
    }

    // Helper method to build full URL
    private buildUrl(path: string): string {
        const baseUrl = this.getBaseUrl();
        return `${baseUrl}${path}`;
    }

    override async findById(id: number): Promise<League> {
        const url = this.buildUrl(`/api/${this.single}/${id}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching league with id ${id}`);
        }
        return response.json();
    }

    async findLeagueById(id: string): Promise<League> {
        const url = this.buildUrl(`/api/${this.single}/${id}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching league with id ${id}`);
        }
        return response.json();
    }

    async create(league: League): Promise<League> {
        const url = this.buildUrl(`/api/${this.single}/create`);
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(league),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Error creating league');
        }
        return response.json();
    }

    async update(league: League): Promise<League> {
        const url = this.buildUrl(`/api/${this.single}/update/${league.id}`);
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(league),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`Error updating league with id ${league.id}`);
        }
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const url = this.buildUrl(`/api/${this.single}/delete/${id}`);
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Error deleting league with id ${id}`);
        }
    }

    async findAll(): Promise<League[]> {
        const url = this.buildUrl(`/api/${this.multiple}/`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching all leagues');
        }
        return response.json();
    }

    async findMatchByLeague(leagueId: string): Promise<string[]> {
        if (!leagueId) {
            throw new Error("League ID is required");
        }

        const url = this.buildUrl(`/api/league/${leagueId}/matches`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch matches");
        }
        return await response.json();
    }

    override factory(): League {
        return new League(0, "N/A", "N/A", "N/A", "N/A", new Date(), new Date());
    }
}