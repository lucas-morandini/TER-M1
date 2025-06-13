import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../basic/navbar/navbar.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { Stores } from '../../../../stores/Stores';
import { BetListComponent } from '../../bet/bet-list/bet-list.component';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-finished-bets',
  standalone: true,
  imports: [CommonModule, BetListComponent, NavbarComponent, ProfileMenuComponent],
  templateUrl: './finished-bets.component.html',
  styleUrls: ['./finished-bets.component.scss'],
  providers: [Stores]
})
export class FinishedBetsComponent implements OnInit {
  betIds: number[] = [];

  constructor(
    private stores: Stores,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFinishedBets();
  }

  async loadFinishedBets(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const betStore = this.stores.betStore;
      this.betIds = await betStore.getFinishedBets(userId);
    } else {
      console.error('User ID is null');
    }
  }
}
