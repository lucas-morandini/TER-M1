export default interface BankInfoInterface {
    id: number;
    idUser: number; // Clé étrangère pour lier à l'utilisateur
    cardNumber: string;
    expiryDate: string; // Format MM/AA
    cvc: string;
    cardHolderName: string;
  }
  