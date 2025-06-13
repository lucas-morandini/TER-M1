export default interface PaymentInterface {
    id: number;
    userId: number; // ID de l'utilisateur associé au paiement
    amount: number; // Montant du paiement
    type: 'deposit' | 'withdrawal'; // Type de transaction : dépôt ou retrait
    status: 'pending' | 'completed' | 'failed'; // Statut de la transaction
    date: Date; // Date de la transaction
    iban?: string; // IBAN pour les retraits
    bic?: string; // BIC pour les retraits
    accountHolderName?: string; // Nom du titulaire du compte pour les retraits
  }
  