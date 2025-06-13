import { DataBaseObject } from "./DataBaseObject";
import BankInfoInterface from "./interface/BankInfo.interface";

export class BankInfo extends DataBaseObject implements BankInfoInterface {
    private _idUser: number; // Clé étrangère pour lier à l'utilisateur
    private _cardNumber: string;
    private _expiryDate: string; // Format MM/AA
    private _cvc: string;
    private _cardHolderName: string;

    constructor(
      id: number,
      createdAt: Date,
      updatedAt: Date,
      idUser: number,
      cardNumber: string,
      expiryDate: string,
      cvc: string,
      cardHolderName: string
    ) {
      super(id, createdAt, updatedAt);
      this._idUser = idUser;
      this._cardNumber = cardNumber;
      this._expiryDate = expiryDate;
      this._cvc = cvc;
      this._cardHolderName = cardHolderName;
    }

    // Getter et Setter pour idUser
    get idUser(): number {
      return this._idUser;
    }

    set idUser(value: number) {
      this._idUser = value;
      this.updateTimestamp();
    }

    // Getter et Setter pour cardNumber
    get cardNumber(): string {
      return this._cardNumber;
    }

    set cardNumber(value: string) {
      this._cardNumber = value;
      this.updateTimestamp();
    }

    // Getter et Setter pour expiryDate
    get expiryDate(): string {
      return this._expiryDate;
    }

    set expiryDate(value: string) {
      this._expiryDate = value;
      this.updateTimestamp();
    }

    // Getter et Setter pour cvc
    get cvc(): string {
      return this._cvc;
    }

    set cvc(value: string) {
      this._cvc = value;
      this.updateTimestamp();
    }

    // Getter et Setter pour cardHolderName
    get cardHolderName(): string {
      return this._cardHolderName;
    }

    set cardHolderName(value: string) {
      this._cardHolderName = value;
      this.updateTimestamp();
    }

    // Implémentation de la méthode abstraite
    toJSON(): string {
      return JSON.stringify({
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        idUser: this._idUser,
        cardNumber: this._cardNumber,
        expiryDate: this._expiryDate,
        cvc: this._cvc,
        cardHolderName: this._cardHolderName,
      });
    }
}
