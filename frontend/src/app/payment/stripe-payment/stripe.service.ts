// stripe.service.ts
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripePromise = loadStripe('pk_test_51RN9lnQ186FnP1FmMMLTgENcTvzazPC7KnZ2KRbsZJMkHPeRAFskFQWiTyczm1O1m0EIKphBw7jEwFTruVqtnyhN00nyn8bnY6'); // clé publique Stripe

  async getStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }
}