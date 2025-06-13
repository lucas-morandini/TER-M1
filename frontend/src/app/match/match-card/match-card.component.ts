import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Match } from '../../../../commons/Match';
import { Stores } from '../../../../stores/Stores';
import { Gamble } from '../../../../commons/Gamble';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [Stores],
})
export class MatchCardComponent {

  @Input() match!: Match;
  leagueName!: string;
  gamble1!:Gamble;
  gamble2!:Gamble;

  constructor(private stores: Stores, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.leagueName = (await this.stores.leagueStore.findLeagueById(this.match.leagueId)).name;
    this.gamble1 = await this.stores.gambleStore.findGambleById(this.match.idBet1);
    this.gamble2 = await this.stores.gambleStore.findGambleById(this.match.idBet2);
  }

  openMatchDetails(): void {
    console.log('Match ID:', this.match.id);
    this.router.navigate([`/match/${this.match.id}`]);
  }

  getTeamInitials(teamName: string): string {
    if (!teamName) return '??';
    return teamName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  isWinner(teamIndex: number): boolean {
    if (!this.match.winner) return false;
    return this.match.teams[teamIndex]?.id === this.match.winner.id;
  }

  placeGamble(event: Event, teamIndex: number): void {
    event.stopPropagation();
    console.log(`Placing gamble on team ${teamIndex + 1}`);
    // Ajoutez ici la logique pour placer un pari
  }

  redirectToEditGamble(idGamble: number) {
    this.router.navigate([`/bet/${idGamble}/edit`]);
  }
  

}
