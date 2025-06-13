import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchCardComponent } from '../match-card/match-card.component';
import { Stores } from '../../../../stores/Stores';
import { PairPipe } from './pair.pipe';
import { NavbarComponent } from '../../basic/navbar/navbar.component';
import MatchInterface from '../../../../commons/interface/Match.interface';
import { Root } from 'postcss';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatchCardComponent, PairPipe, NavbarComponent,RouterModule ],
  providers: [Stores],
})
export class MatchListComponent implements OnInit {
  leagueId!: string;
  matchIds: string[] = [];
  matches: MatchInterface[] = [];

  constructor(private stores: Stores, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.leagueId = params.get('leagueId')!;
      if (this.leagueId) {
        console.log('League ID:', this.leagueId);
        this.loadMatchIds();
      } else {
        console.log('No league ID');
      }
    });
  }

  async loadMatchIds(): Promise<void> {
    if (this.leagueId) {
      const leagueStore = this.stores.leagueStore;
      this.matchIds = await leagueStore.findMatchByLeague(this.leagueId);
      this.loadMatches();
    }
  }

  async loadMatches(): Promise<void> {
    if (this.matchIds.length > 0) {
      // Supposons que vous avez une méthode pour récupérer les détails des matchs par ID
      this.matches = await this.fetchMatchesByIds(this.matchIds);
    }
  }

  async fetchMatchesByIds(matchIds: string[]): Promise<MatchInterface[]> {
    // Implémentez cette méthode pour récupérer les détails des matchs en fonction des IDs
    // Par exemple, en utilisant une API ou un service
    const matchDetailsPromises = matchIds.map(id =>
      fetch(`http://localhost:4200/api/match/${id}`).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch match with ID ${id}`);
        }
        return response.json();
      })
    );

    return Promise.all(matchDetailsPromises);
  }
}
