import { DataBaseObject } from "./DataBaseObject";
import PaymentInterface from "./interface/Payment.interface";

export class Payment extends DataBaseObject implements PaymentInterface {
  private _userId: number;
  private _amount: number;
  private _type: 'deposit' | 'withdrawal';
  private _status: 'pending' | 'completed' | 'failed';
  private _date: Date;
  private _iban?: string;
  private _bic?: string;
  private _accountHolderName?: string;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    userId: number,
    amount: number,
    type: 'deposit' | 'withdrawal',
    status: 'pending' | 'completed' | 'failed',
    date: Date,
    iban?: string,
    bic?: string,
    accountHolderName?: string
  ) {
    super(id, createdAt, updatedAt);
    this._userId = userId;
    this._amount = amount;
    this._type = type;
    this._status = status;
    this._date = date;
    this._iban = iban;
    this._bic = bic;
    this._accountHolderName = accountHolderName;
  }

  // Getter et Setter pour userId
  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour amount
  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour type
  get type(): 'deposit' | 'withdrawal' {
    return this._type;
  }

  set type(value: 'deposit' | 'withdrawal') {
    this._type = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour status
  get status(): 'pending' | 'completed' | 'failed' {
    return this._status;
  }

  set status(value: 'pending' | 'completed' | 'failed') {
    this._status = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour date
  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour iban
  get iban(): string | undefined {
    return this._iban;
  }

  set iban(value: string | undefined) {
    this._iban = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour bic
  get bic(): string | undefined {
    return this._bic;
  }

  set bic(value: string | undefined) {
    this._bic = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour accountHolderName
  get accountHolderName(): string | undefined {
    return this._accountHolderName;
  }

  set accountHolderName(value: string | undefined) {
    this._accountHolderName = value;
    this.updateTimestamp();
  }

  // Implémentation de la méthode abstraite
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this._userId,
      amount: this._amount,
      type: this._type,
      status: this._status,
      date: this._date,
      iban: this._iban,
      bic: this._bic,
      accountHolderName: this._accountHolderName
    });
  }
}
