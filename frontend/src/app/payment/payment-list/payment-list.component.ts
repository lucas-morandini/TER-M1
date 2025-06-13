import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { Payment } from '../../../../commons/Payment';
import { Stores } from '../../../../stores/Stores';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PaymentCardComponent], // Assurez-vous que PaymentCardComponent est importé ici
  providers: [Stores],
})
export class PaymentListComponent implements OnInit {
  @Input() payments: Payment[] = []; // Recevez les paiements en tant qu'entrée
  isLoading = false;

  constructor(private stores: Stores) {}

  ngOnInit(): void {
    // Si les paiements ne sont pas fournis en entrée, chargez-les ici
    if (this.payments.length === 0) {
      this.loadPayments();
    }
  }

  async loadPayments(): Promise<void> {
    this.isLoading = true;
    const paymentStore = this.stores.paymentStore;
    this.payments = await paymentStore.findAll();
    this.isLoading = false;
  }
}
