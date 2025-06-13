import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../basic/navbar/navbar.component';
import { MatchCardComponent } from '../match/match-card/match-card.component';
import { BetListComponent } from '../bet/bet-list/bet-list.component';
import { Match } from '../../../commons/Match';
import { Stores } from '../../../stores/Stores';
import { AuthService } from '../auth.service';
import swal from "sweetalert2";
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatchCardComponent, BetListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [Stores, AuthService, NavbarComponent,Router],
})
export class HomeComponent implements OnInit {
  async placeABet() {
  const userId = this.authService.getUserId();
    if (userId !== null) {
      this.router.navigate(['/match', this.matchOfTheWeek?.id]);
    } else {
      swal.fire("Erreur", "Veuillez vous connecter", "warning");
    }

}
  matchOfTheWeek: Match | undefined;
  betIds: number[] = [];

  constructor(
    private router: Router,
    private stores: Stores,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.matchOfTheWeek = await this.stores.matchStore.getMatchOfTheWeek();
    await this.loadBets();
  }

  async loadBets(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const betStore = this.stores.betStore;
      this.betIds = await betStore.getCurrentBets(userId);
    } else {
      console.error('User ID is null');
    }
  }
}
