import { League } from "../commons/League";
import { Match } from "../commons/Match";
import { LeagueStore } from "./LeagueStore";
import { Store } from "./Store";
import { Stores } from "./Stores";

export class MatchStore extends Store<Match> {
  protected single: string = 'match';
  protected multiple: string = 'matches';

  // Helper method to get the base URL
  private getBaseUrl(): string {
    // Check if we're in browser context
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // For SSR, you'll need to configure this based on your environment
    return process.env['API_BASE_URL'] || 'http://localhost:3000';
  }

  // Helper method to build full URL
  private buildUrl(path: string): string {
    const baseUrl = this.getBaseUrl();
    return `${baseUrl}${path}`;
  }

  async findById(id: number): Promise<Match> {
    const url = this.buildUrl(`/api/${this.single}/${id}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching match with id ${id}`);
    }
    return response.json();
  }

  async findByIdString(id: string): Promise<Match> {
    const url = this.buildUrl(`/api/${this.single}/${id}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching match with id ${id}`);
    }
    return response.json();
  }

  async create(match: Match): Promise<Match> {
    const url = this.buildUrl(`/api/${this.single}/create`);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(match),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Error creating match');
    }
    return response.json();
  }

  async update(match: Match): Promise<Match> {
    const url = this.buildUrl(`/api/${this.single}/update/${match.id}`);
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(match),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Error updating match with id ${match.id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = this.buildUrl(`/api/${this.single}/delete/${id}`);
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Error deleting match with id ${id}`);
    }
  }

  async findAll(): Promise<Match[]> {
    const url = this.buildUrl(`/api/${this.multiple}/`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching all matches');
    }
    return response.json();
  }

  async getBetsByMatchId(matchId: any): Promise<number[]> {
    // Fixed the extra } typo
    const url = this.buildUrl(`/api/${this.single}/${matchId}/bets`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching bets for match with id ${matchId}`);
    }
    return response.json();
  }

  async getMatchOfTheWeek(): Promise<Match> {
    const url = this.buildUrl(`/api/${this.single}/matchOfTheWeek`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching match of the week`);
    }
    return response.json();
  }

  factory(): Match {
    const s = new Stores();
    const l = s.leagueStore.factory();
    const t = s.tournamentStore.factory();
    const te = s.teamStore.factory();
    return new Match(0,"N/A",new Date(),"N/A","N/A","N/A",0,0,"LeagueName","TournamentName","N/A","N/A",[],0,[],te,te,false,0,0,new Date(),new Date(),new Date());
  }
}