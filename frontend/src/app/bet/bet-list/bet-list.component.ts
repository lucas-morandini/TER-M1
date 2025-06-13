import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bet } from '../../../../commons/Bet';
import { Stores } from '../../../../stores/Stores';
import { BetCardComponent } from '../bet-card/bet-card.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  standalone: true,
  imports: [BetCardComponent, CommonModule],
  providers: [Stores],
})
export class BetListComponent implements OnInit {
  @Input() betIds: number[] = []; // Ajoutez cette ligne pour définir betIds comme une entrée

  isPersonal: boolean = false;
  bets: Bet[] = [];
  isLoading = false;

  constructor(private stores: Stores, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.betIds && this.betIds.length > 0) {
      this.loadBetsFromInput();
    } else {
      // Sinon on les charge dynamiquement selon la route
      const currentRoute = this.router.url;
      this.isPersonal = currentRoute.includes('/user/');
      this.isPersonal ? this.loadBetsByUserId() : this.loadBetsByMatchId();
    }
  }

  async ngOnChanges(): Promise<void> {
    if (this.betIds && this.betIds.length > 0) {
      await this.loadBetsFromInput();
    }
  }

  async loadBetsByMatchId(): Promise<void> {
    this.isLoading = true;
    const matchStore = this.stores.matchStore;

    try {
      this.route.paramMap.subscribe(async params => {
        const matchId = Number(params.get('id'));
        if (matchId) {
          const betIds = await matchStore.getBetsByMatchId(matchId);
          const betStore = this.stores.betStore;
          this.bets = await Promise.all(betIds.map(id => betStore.findBetById(id)));
          // Filter out any undefined or null values
          this.bets = this.bets.filter(bet => bet);
        }
      });
    } catch (error) {
      console.error('Error loading bets:', error);
      this.bets = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadBetsByUserId(): Promise<void> {
    this.isLoading = true;
    const userStore = this.stores.userStore;
    try {
      this.route.paramMap.subscribe(async params => {
        const userId = this.authService.getUserId();
        if (userId) {
          const betIds = await userStore.getBetsByUserId(userId);
          const betStore = this.stores.betStore;
          this.bets = await Promise.all(betIds.map(id => betStore.findBetById(id)));
          // Filter out any undefined or null values
          this.bets = this.bets.filter(bet => bet);
        }
      });
    } catch (error) {
      console.error('Error loading bets:', error);
      this.bets = [];
    } finally {
      this.isLoading = false;
    }
  }

  private async loadBetsFromInput(): Promise<void> {
    this.isLoading = true;
    const betStore = this.stores.betStore;
    console.log('Loading bets from input:', this.betIds);
    try {
      this.bets = await Promise.all(this.betIds.map(id => betStore.findBetById(id)));
      this.bets = this.bets.filter(bet => bet);
    } catch (e) {
      console.error('Error loading bets from input:', e);
      this.bets = [];
    } finally {
      this.isLoading = false;
    }
  }
}
