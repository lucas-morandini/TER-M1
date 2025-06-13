import { DataBaseObject } from "../commons/DataBaseObject";

export abstract class Store<T extends DataBaseObject> {
    protected abstract single: string;
    protected abstract multiple: string;

    // Méthode abstraite pour trouver un objet par son ID
    abstract findById(id: number): Promise<T>;

    // Méthode abstraite pour créer un nouvel objet
    abstract create(item: T): Promise<T>;

    // Méthode abstraite pour mettre à jour un objet existant
    abstract update(item: T): Promise<T>;

    // Méthode abstraite pour supprimer un objet par son ID
    abstract delete(id: number): Promise<void>;

    // Méthode abstraite pour trouver tous les objets
    abstract findAll(): Promise<T[]>;

    abstract factory(): T;
  }
