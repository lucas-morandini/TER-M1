import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Payment } from '../../../../commons/Payment';
import { Stores } from '../../../../stores/Stores';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {
  @Input() paymentId!: number;
  payment!: Payment;

  constructor(private stores: Stores, private router: Router) {
    this.payment = stores.paymentStore.factory();
  }

  ngOnInit(): void {
    this.loadPayment();
  }

  async loadPayment(): Promise<void> {
    const paymentStore = this.stores.paymentStore;
    try {
      this.payment = await paymentStore.findById(this.paymentId);
      if (!this.payment) {
        this.payment = paymentStore.factory();
      }
    } catch (error) {
      this.payment = paymentStore.factory();
    }
  }
}
