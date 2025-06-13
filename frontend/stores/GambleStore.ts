

import { Gamble } from "../commons/Gamble";
import { Store } from "./Store";

export class GambleStore extends Store<Gamble> {
    gambling(bet: any) {
      throw new Error('Method not implemented.');
    }
    async getFinishedGambles(userId: any): Promise<number[] | PromiseLike<number[]>> {
        const url = `/api/${this.multiple}/finished/${userId}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Error fetching bet with id ${userId}`);
        }
        return response.json();
    }
    async getCurrentGambles(userId: any): Promise<number[] | PromiseLike<number[]>> {

        const url = `/api/${this.multiple}/current/${userId}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Error fetching bet with id ${userId}`);
        }
        return response.json();
    }
    
    
    async getSelectionGamble(userId:number): Promise<number[] | PromiseLike<number[]>> { 
        const url = `/api/${this.multiple}/selectionUser/${userId}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Error fetching bet with id ${userId}`);
        }
        return response.json();
    }


    override async findById(id: number): Promise<Gamble> {
        return this.findGambleById(id);
    }

    protected single: string = 'gamble';
    protected multiple: string = 'gambles';

    async findGambleById(id: number): Promise<Gamble> {
        const url = `/api/${this.single}/${id}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Error fetching bet with id ${id}`);
        }
        return response.json();
    }

    async create(bet: Gamble): Promise<Gamble> {
        const url = `/api/${this.single}/create`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(bet),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error('Error creating bet');
        }
        return response.json();
    }

    async update(bet: Gamble): Promise<Gamble> {
        const url = `/api/${this.single}/update/${bet.id}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(bet),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error(`Error updating bet with id ${bet.id}`);
        }
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const url = `/api/${this.single}/delete/${id}`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (!response.ok) {
            throw new Error(`Error deleting bet with id ${id}`);
        }
    }

    async findAll(): Promise<Gamble[]> {
        const url = `/api/${this.multiple}/`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error('Error fetching all bets');
        }
        return response.json();
    }

    

    override factory(): Gamble {
        return new Gamble(
            0,          // id
            0,          // odds
            "-1",       // win
            true,       // is_available
            new Date(), // createdAt
            new Date()  // updatedAt
        );
    }
    
}
