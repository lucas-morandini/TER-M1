import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxStripeModule,
  StripeCardComponent,
  StripeFactoryService,
  StripeInstance,
} from 'ngx-stripe';
import { Subscription, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Stores } from '../../../../stores/Stores';
import { Payment } from '../../../../commons/Payment';
import { HttpClient,HttpClientModule,HttpHeaders,HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [
    CommonModule,
    StripeCardComponent,
    NgxStripeModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
  providers: [Stores]
})
export class StripePaymentComponent implements OnInit, OnDestroy {
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  public stripePublicKey = 'key';

  private subscriptions = new Subscription();

  constructor(
    private stripeFactory: StripeFactoryService,
    private stores: Stores,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.stripe = this.stripeFactory.create();
    this.stripeAmount = 100;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkout() {
    const host = 'http://localhost:3000/api/payment/create-checkout-session';
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const amountInCents = this.stripeAmount * 100;
    const body = { amount: amountInCents };

    const sessionObservable = this.http.post<IStripeSession>(host, body, { headers }).pipe(
      switchMap((session: IStripeSession) => {
        return this.stripe.redirectToCheckout({ sessionId: session.id });
      })
    );

    this.subscriptions.add(
      sessionObservable.subscribe({
        next: (result) => {
          if (result.error) {
            console.error(result.error.message);
          }
        },
        error: (error) => {
          console.error('HTTP Error:', error);
        }
      })
    );
  }
}

interface IStripeSession {
  id: string;
}
