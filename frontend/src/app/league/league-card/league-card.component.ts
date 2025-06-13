import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import LeagueInterface from '../../../../commons/interface/League';
import { Stores } from '../../../../stores/Stores';
import { League } from '../../../../commons/League';

@Component({
  selector: 'app-league-card',
  templateUrl: './league-card.component.html',
  styleUrls: ['./league-card.component.scss'],
})
export class LeagueCardComponent implements OnInit {
  @Input() leagueId!: string;
  league!: LeagueInterface;

  constructor(private stores: Stores, private router: Router) {
    this.league = stores.leagueStore.factory();
  }

  ngOnInit(): void {
    this.loadLeague();
  }

  async loadLeague(): Promise<void> {
    const leagueStore = this.stores.leagueStore;
    try {
      this.league = await leagueStore.findLeagueById(this.leagueId);
      if (!this.league) {
        this.league = leagueStore.factory();
      }
    } catch (error) {
      this.league = leagueStore.factory();
    }
  }

  navigateToMatches(): void {
    this.router.navigate([`/league/${this.leagueId}/matches/`]);
  }
}
