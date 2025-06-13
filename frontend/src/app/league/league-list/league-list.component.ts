import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueCardComponent } from '../league-card/league-card.component';
import { League } from '../../../../commons/League';
import { Stores } from '../../../../stores/Stores';
import { NavbarComponent } from '../../basic/navbar/navbar.component';

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss'],
  standalone: true,
  imports: [CommonModule, LeagueCardComponent],
  providers: [Stores],
})
export class LeagueListComponent implements OnInit {
  leagues: League[] = [];
  isLoading = true;
  constructor(private stores: Stores) {}

  ngOnInit(): void {
    this.loadLeagues();
  }

  async loadLeagues(): Promise<void> {
    const leagueStore = this.stores.leagueStore;
    this.leagues = await leagueStore.findAll();
    this.isLoading = false;
  }
}
