import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../commons/User';
import { Stores } from '../../../../stores/Stores';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pay-back',
  templateUrl: './pay-back.component.html',
  styleUrls: ['./pay-back.component.scss'],
  standalone: true,
  imports: [FormsModule],
  providers: [Stores]
})
export class PayBackComponent {
  user: User | null = null;
  public amount: number = 0;
  public bankDetails: any = {
    iban: '',
    bic: '',
    accountHolderName: ''
  };

  constructor(
    private stores: Stores,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const userStore = this.stores.userStore;
      this.user = await userStore.findById(userId);
    }
  }

  async requestWithdrawal() {
    if (!this.user) {
      Swal.fire({
        icon: 'error',
        title: 'Utilisateur non trouvé',
        text: 'Utilisateur non trouvé.'
      });
      return;
    }

    const hasSufficientFunds = await this.checkFunds(this.amount);
    if (!hasSufficientFunds) {
      Swal.fire({
        icon: 'error',
        title: 'Fonds insuffisants',
        text: 'Vous n\'avez pas assez de fonds pour effectuer ce retrait.'
      });
      return;
    }
    // si l'iban fait pas 14 caractères, le bic pas 8 et le nom du titulaire pas vide
    if (this.bankDetails.iban.length !== 27 || this.bankDetails.bic.length !== 8 || !this.bankDetails.accountHolderName) {
      Swal.fire({
        icon: 'error',
        title: 'Détails bancaires invalides',
        text: 'Veuillez vérifier vos détails bancaires.'
      });
      return;
    }

    try {
      await this.stores.paymentStore.requestWithdrawal(this.user.id, this.amount, this.bankDetails);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Demande de retrait soumise avec succès'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la soumission de la demande de retrait'
      });
    }
  }

  async checkFunds(amount: number): Promise<boolean> {
    if (!this.user) { return false; }
    return this.stores.userStore.hasSufficientFunds(this.user.id, amount);
  }
}
