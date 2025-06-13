import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../basic/navbar/navbar.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { Stores } from '../../../../stores/Stores';
import { BetListComponent } from '../../bet/bet-list/bet-list.component';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-current-bets',
  standalone: true,
  imports: [CommonModule, BetListComponent, NavbarComponent, ProfileMenuComponent],
  templateUrl: './current-bets.component.html',
  styleUrls: ['./current-bets.component.scss'],
  providers: [Stores]
})
export class CurrentBetsComponent implements OnInit {
  betIds: number[] = [];

  constructor(
    private stores: Stores,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentBets();
  }

  async loadCurrentBets(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const betStore = this.stores.betStore;
      this.betIds = await betStore.getCurrentBets(userId);
    } else {
      console.error('User ID is null');
    }
  }
}
