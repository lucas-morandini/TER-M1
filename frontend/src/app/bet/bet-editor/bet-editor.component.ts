import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Stores } from '../../../../stores/Stores';
import { Bet } from '../../../../commons/Bet';
import { Gamble } from '../../../../commons/Gamble';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bet-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bet-editor.component.html',
  styleUrls: ['./bet-editor.component.scss'],
  providers: [Stores]
})
export class BetEditorComponent implements OnInit {
  bet: Bet | null = null;
  gamble: Gamble | null = null;
  editedStake: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stores: Stores,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const idBet = this.route.snapshot.paramMap.get('idBet');
    if (idBet) {
      const betStore = this.stores.betStore;
      const gambleStore = this.stores.gambleStore;
      if(!this.isConnected) {
        this.router.navigate(['/']);
        return;
      }
      this.gamble = await gambleStore.findGambleById(Number(idBet));
      // Get from sessionStorage
      const userId = localStorage.getItem('userId');
      this.bet = new Bet(0, this.gamble.odds, 1,'-1', this.gamble.id, Number(userId), false, new Date(), new Date());
      this.editedStake = this.bet.stake;
    }
  }

  async saveBet(): Promise<void> {
    if (this.bet && this.editedStake !== null) {
        const betStore = this.stores.betStore;
        // Mettre à jour la mise du pari
        this.bet.stake = this.editedStake;
        // Appeler la fonction pour sauvegarder le pari
        try {
            await betStore.gambling(this.bet);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la sauvegarde du pari.';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });
            return;
        }
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Votre pari a été enregistré avec succès.',
        });
        // Rediriger vers une autre page après la sauvegarde
        this.router.navigate(['/']);
    }
}


  get isConnected(): boolean {
    return this.authService.isLoggedIn();
  }
}
