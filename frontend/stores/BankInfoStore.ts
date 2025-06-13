import { BankInfo } from "../commons/BankInfo";
import { Store } from "./Store";

export class BankInfoStore extends Store<BankInfo> {
  protected single: string = 'bankInfo';
  protected multiple: string = 'bankInfos';

  async findById(id: number): Promise<BankInfo> {
    const url = `${this.single}/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  async create(bankInfo: BankInfo): Promise<BankInfo> {
    const url = `${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(bankInfo),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(bankInfo: BankInfo): Promise<BankInfo> {
    const url = `${this.single}/update/${bankInfo.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(bankInfo),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `${this.single}/delete/${id}`;
    await fetch(url, { method: 'DELETE' });
  }

  async findAll(): Promise<BankInfo[]> {
    const url = `${this.multiple}/`;
    const response = await fetch(url);
    return response.json();
  }

  factory(): BankInfo {
    return new BankInfo(
      0,
      new Date(),
      new Date(),
      0, // idUser
      "N/A", // cardNumber
      "N/A", // expiryDate
      "N/A", // cvc
      "N/A"  // cardHolderName
    );
  }
}
