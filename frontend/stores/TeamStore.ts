import { Store } from "./Store";
import { Team } from "../commons/Team";
import { Stores } from "./Stores";

export class TeamStore extends Store<Team> {
  protected single: string = 'team';
  protected multiple: string = 'teams';

  async findById(id: number): Promise<Team> {
    const url = `/api/${this.single}/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching team with id ${id}`);
    }
    return response.json();
  }

  async create(team: Team): Promise<Team> {
    const url = `/api/${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(team),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Error creating team');
    }
    return response.json();
  }

  async update(team: Team): Promise<Team> {
    const url = `/api/${this.single}/update/${team.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(team),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Error updating team with id ${team.id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `/api/${this.single}/delete/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Error deleting team with id ${id}`);
    }
  }

  async findAll(): Promise<Team[]> {
    const url = `/api/${this.multiple}/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching all teams');
    }
    return response.json();
  }

  factory(): Team {
    const s = new Stores();
    const l = s.leagueStore.factory();
    return new Team(0, '', '', '', '', '', l, [], new Date(), new Date());
  }
}
