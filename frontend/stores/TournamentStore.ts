import { Tournament } from "../Tournament";
import { Store } from "./Store";


export class TournamentStore extends Store<Tournament> {
  protected single: string = 'tournament';
  protected multiple: string = 'tournaments';

  async findById(id: number): Promise<Tournament> {
    const url = `/api/${this.single}/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching tournament with id ${id}`);
    }
    return response.json();
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const url = `/api/${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(tournament),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Error creating tournament');
    }
    return response.json();
  }

  async update(tournament: Tournament): Promise<Tournament> {
    const url = `/api/${this.single}/update/${tournament.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(tournament),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Error updating tournament with id ${tournament.id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `/api/${this.single}/delete/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Error deleting tournament with id ${id}`);
    }
  }

  async findAll(): Promise<Tournament[]> {
    const url = `/api/${this.multiple}/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching all tournaments');
    }
    return response.json();
  }

  factory(): Tournament {
    return new Tournament(0, '', '', '', new Date(), new Date());
  }
}
