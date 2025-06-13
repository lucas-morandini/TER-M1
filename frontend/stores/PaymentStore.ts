import { Payment } from "../commons/Payment";
import { Store } from "./Store";

export class PaymentStore extends Store<Payment> {
  protected single: string = 'payment';
  protected multiple: string = 'payments';

  async findById(id: number): Promise<Payment> {
    const url = `/api/${this.single}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  async create(payment: Payment): Promise<Payment> {
    const url = `/api/${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: payment.toJSON(),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(payment: Payment): Promise<Payment> {
    const url = `/api/${this.single}/update/${payment.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: payment.toJSON(),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `/api/${this.single}/delete/${id}`;
    await fetch(url, { method: 'DELETE' });
  }

  async findAll(): Promise<Payment[]> {
    const url = `/api/${this.multiple}/`;
    const response = await fetch(url);
    return response.json();
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    const url = `/api/${this.multiple}/user/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching payments for user with id ${userId}`);
    }
    return response.json();
  }

  async validatePayment(hash: string): Promise<boolean> {
    const url = `/api/${this.single}/validate/${hash}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 403) {
        return false;
      }
      throw new Error(`Error validating payment with hash ${hash}`);
    }
    return response.json();
  }

  async createCheckoutSession(amount: number): Promise<any> {
    const url = `/api/${this.single}/create-checkout-session`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { amount } })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session de paiement Stripe');
    }

    return response.json();
  }

  async requestWithdrawal(userId: number, amount: number, bankDetails: any): Promise<any> {
    const url = `/api/${this.single}/withdraw`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId, amount, bankDetails })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la soumission de la demande de retrait');
    }

    return response.json();
  }

  factory(): Payment {
    return new Payment(
      0,
      new Date(),
      new Date(),
      0, // userId
      0, // amount
      'deposit', // type
      'pending', // status
      new Date(), // date
      '', // iban
      '', // bic
      '' // accountHolderName
    );
  }
}
