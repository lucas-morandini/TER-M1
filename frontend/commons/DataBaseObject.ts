export abstract class DataBaseObject {
    id: any;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: any, createdAt: Date, updatedAt: Date) {
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }

    // Méthode abstraite que chaque classe dérivée doit implémenter
    abstract toJSON(): string;

    // Méthode commune pour mettre à jour la date de mise à jour
    updateTimestamp(): void {
      this.updatedAt = new Date();
    }
  }
