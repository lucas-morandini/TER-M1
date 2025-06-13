import { DataBaseObject } from "./DataBaseObject";
import NotificationInterface from "./interface/Notification.interface";

export class Notification extends DataBaseObject implements NotificationInterface {
  private _message: string;
  private _soldeUpdate: number;
  private _title: string;
  // Ajoutez d'autres champs privés si nécessaire

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    message: string,
    soldeUpdate: number,
    title: string,
    // Ajoutez d'autres paramètres si nécessaire
  ) {
    super(id, createdAt, updatedAt);
    this._message = message;
    this._soldeUpdate = soldeUpdate;
    this._title = title;
    // Initialisez d'autres champs si nécessaire
  }

  // Getter et Setter pour message
  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour soldeUpdate
  get soldeUpdate(): number {
    return this._soldeUpdate;
  }

  set soldeUpdate(value: number) {
    this._soldeUpdate = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour title
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
    this.updateTimestamp();
  }

  // Implémentation de la méthode abstraite
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      message: this._message,
      soldeUpdate: this._soldeUpdate,
      // Ajoutez d'autres champs si nécessaire
    });
  }
}
