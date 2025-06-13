import { DataBaseObject } from "./DataBaseObject";
import UserInterface from "./interface/User.interface";
export class User extends DataBaseObject implements UserInterface {
  private _username: string;
  private _email: string;
  private _pwd: string;
  private _birth_date: Date;
  private _tel: string;
  private _sex: string;
  private _name: string;
  private _first_name: string;
  private _solde: number; // Added solde field

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    username: string,
    email: string,
    pwd: string,
    birth_date: Date,
    tel: string,
    sex: string,
    name: string,
    first_name: string,
    solde: number // Added solde parameter
  ) {
    super(id, createdAt, updatedAt);
    this._username = username;
    this._email = email;
    this._pwd = pwd;
    this._birth_date = birth_date;
    this._tel = tel;
    this._sex = sex;
    this._name = name;
    this._first_name = first_name;
    this._solde = solde; // Initialize solde
  }

  // Getter et Setter pour solde
  get solde(): number {
    return this._solde;
  }

  set solde(value: number) {
    this._solde = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour name
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour first_name
  get first_name(): string {
    return this._first_name;
  }

  set first_name(value: string) {
    this._first_name = value;
    this.updateTimestamp();
  }

  birthday?: Date | undefined;
  password?: string | undefined;
  tokens?: string | undefined;

  // Getter et Setter pour username
  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour email
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour pwd
  get pwd(): string {
    return this._pwd;
  }

  set pwd(value: string) {
    this._pwd = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour birth_date
  get birth_date(): Date {
    return this._birth_date;
  }

  set birth_date(value: Date) {
    this._birth_date = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour tel
  get tel(): string {
    return this._tel;
  }

  set tel(value: string) {
    this._tel = value;
    this.updateTimestamp();
  }

  // Getter et Setter pour sex
  get sex(): string {
    return this._sex;
  }

  set sex(value: string) {
    this._sex = value;
    this.updateTimestamp();
  }

  // Implémentation de la méthode abstraite
  toJSON(): string {
    return JSON.stringify({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    username: this._username,
    email: this._email,
    pwd: this._pwd,
    birth_date: this._birth_date,
    tel: this._tel,
    sex: this._sex,
    name: this._name,
    first_name: this._first_name,
    solde: this._solde, // Include solde in JSON
    });
  }
  }
