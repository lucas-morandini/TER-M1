import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stores } from '../../../../stores/Stores';
import swal from 'sweetalert2';

@Component({
  selector: 'app-payment-validation',
  template: '',
  standalone: true,
  providers: [Stores],
})
export class PaymentValidationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stores: Stores
  ) {}

  async ngOnInit(): Promise<void> {
    const hash = this.route.snapshot.queryParamMap.get('hash');
    if (hash) {
      const isValid = await this.validatePayment(hash);
      if (isValid) {
        await swal.fire({
          icon: 'success',
          title: 'Paiement validé',
          text: 'Votre paiement a été validé avec succès!',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/profile']);
      } else {
        await swal.fire({
          icon: 'error',
          title: 'Erreur de paiement',
          text: 'Une erreur est survenue lors de la validation de votre paiement.',
          confirmButtonText: 'OK'
        });
      }
    } else {
      await swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun hash de paiement trouvé.',
        confirmButtonText: 'OK'
      });
    }
  }

  async validatePayment(hash: string): Promise<boolean> {
    const paymentStore = this.stores.paymentStore;
    return await paymentStore.validatePayment(hash);
  }
}
