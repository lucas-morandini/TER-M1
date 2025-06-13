import { Injectable } from '@angular/core';
import { UserStore } from './UserStore';
import { BetStore } from './BetStore';
import { MatchStore } from './MatchStore';
import { LeagueStore } from './LeagueStore';
import { TournamentStore } from './TournamentStore';
import { TeamStore } from './TeamStore';
import { GambleStore } from './GambleStore';
import { PaymentStore } from "./PaymentStore";
import { BankInfoStore } from './BankInfoStore';
import { NotificationStore } from './NotificationStore';

@Injectable({
  providedIn: 'root'
})
export class Stores {
  paymentStore: PaymentStore; // Remplacez par le type approprié
  userStore: UserStore;
  betStore: BetStore;
  matchStore: MatchStore;
  leagueStore: LeagueStore;
  tournamentStore: TournamentStore;
  teamStore: TeamStore;
  gambleStore: GambleStore;
  bankInfoStore: BankInfoStore;
  notificationStore: NotificationStore;

  constructor() {
    this.paymentStore = new PaymentStore();
    this.userStore = new UserStore();
    this.betStore = new BetStore();
    this.matchStore = new MatchStore();
    this.leagueStore = new LeagueStore();
    this.tournamentStore = new TournamentStore();
    this.teamStore = new TeamStore();
    this.bankInfoStore = new BankInfoStore();
    this.gambleStore = new GambleStore();
    this.notificationStore = new NotificationStore();
  }
}
