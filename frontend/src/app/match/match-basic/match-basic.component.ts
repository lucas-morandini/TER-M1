import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stores } from '../../../../stores/Stores';
import { Match } from '../../../../commons/Match';
import { Bet } from '../../../../commons/Bet';
import { BetListComponent } from '../../bet/bet-list/bet-list.component';
import { CommonModule } from '@angular/common';
import { Gamble } from '../../../../commons/Gamble';

@Component({
  selector: 'app-match-basic',
  templateUrl: './match-basic.component.html',
  styleUrls: ['./match-basic.component.scss'],
  imports: [BetListComponent, CommonModule],
  providers: [Stores, Router]
})
export class MatchBasicComponent implements OnInit {
  matchId!: string;
  match!: Match;
  betsId: number[] = [];
  gamble1!: Gamble;
  gamble2!: Gamble;

  constructor(
    private stores: Stores,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.match = stores.matchStore.factory();
  }

  async ngOnInit(): Promise<void> {
    this.matchId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Match ID:', this.matchId);
    await this.loadMatch();
    await this.loadBetsByMatchId();
    console.log('Bets ID:', this.match.idBet1, this.match.idBet2);
    this.gamble1 = await this.stores.gambleStore.findGambleById(this.match.idBet1);
    this.gamble2 = await this.stores.gambleStore.findGambleById(this.match.idBet2);
  }

  async loadMatch(): Promise<void> {
    const matchStore = this.stores.matchStore;
    try {
      this.match = await matchStore.findByIdString(this.matchId);
      if (!this.match) {
        this.match = matchStore.factory();
      }
    } catch (error) {
      this.match = matchStore.factory();
    }
  }

  redirectToEditGamble(idGamble: number) {
    this.router.navigate([`/bet/${idGamble}/edit`]);
  }

  async loadBetsByMatchId(): Promise<void> {
    const matchStore = this.stores.matchStore;
    try {
      this.betsId = await matchStore.getBetsByMatchId(this.matchId);
      if (this.betsId.length === 0) {
        this.betsId = [0];
      }
    } catch (error) {
      this.betsId = [0];
    }
  }
}
