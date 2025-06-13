
import { Bet } from "../commons/Bet";
import { Store } from "./Store";

export class BetStore extends Store<Bet> {
    async gambling(bet: any) {
        const url = `/api/${this.single}/create`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: 'POST',
            body: bet.toJSON(),
            headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}` },
        });
    
        if (!response.ok) {
            const errorData = await response.json(); // Lire le corps de la réponse pour obtenir les détails de l'erreur
            throw new Error(errorData.error || 'Error creating bet');
        }
    
        return response.json();
    }
    
    async getFinishedBets(userId: any): Promise<number[] | PromiseLike<number[]>> {
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
    async getCurrentBets(userId: any): Promise<number[] | PromiseLike<number[]>> {

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
    
    
    async getSelectionBet(userId:number): Promise<number[] | PromiseLike<number[]>> { 
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


    override async findById(id: number): Promise<Bet> {
        return this.findBetById(id);
    }

    protected single: string = 'bet';
    protected multiple: string = 'bets';

    async findBetById(id: number): Promise<Bet> {
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

    async create(bet: Bet): Promise<Bet> {
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

    async update(bet: Bet): Promise<Bet> {
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
        const response = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },});
        if (!response.ok) {
            throw new Error(`Error deleting bet with id ${id}`);
        }
    }

    async findAll(): Promise<Bet[]> {
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

    

    override factory(): Bet {
        return new Bet( 0,0,0,"-1",0,0,false,new Date(),new Date()); // Replace with appropriate default values
    }
}
