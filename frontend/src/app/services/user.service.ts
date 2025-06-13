import { Injectable } from '@angular/core';
import { User } from '../../../commons/User';
import { Stores } from '../../../stores/Stores';

import { Notification } from '../../../commons/Notification'; // Assurez-vous que le chemin est correct
import { ModalService } from '../modal.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private stores: Stores,
    private modalService: ModalService // Injectez ModalService ici
  ) { }

  async updateBetStatus(user: User) {
    //DEPRECATED
    try {
      const userBets = await this.stores.betStore.getCurrentBets(user.id);
      let totalWinnings = 0;

      // Parcourir chaque pari de l'utilisateur
      for (const betId of userBets) {
        const bet = await this.stores.betStore.findBetById(betId);

        // Vérifier si le pari est gagnant
        if (bet.win) {
          // Ajouter la mise multipliée par la cote au total des gains
          totalWinnings += bet.stake * bet.odds;
        }
      }

      // Mettre à jour le solde de l'utilisateur
      if (totalWinnings > 0) {
        user.solde += totalWinnings;
        await this.stores.userStore.updateUserBalance(user.id, user.solde);
      }

      console.log('Total Winnings:', totalWinnings);
    } catch (error) {
      console.error('Error updating bet status:', error);
    }
  }

  async afficheUserNotifications(user: User): Promise<any> {
    try {
      const notificationsId = await this.stores.notificationStore.getNotificationsByUserId(user.id);
      const notifications = [];
  
      for (const notificationId of notificationsId) {
        const notification = await this.stores.notificationStore.findById(notificationId);
        if (notification.soldeUpdate !== 0) {
          notifications.push(notification);
        }
      }
  
      if (notifications.length > 0) {
        this.modalService.openNotificationModal(notifications[0]); // Envoyez la première notification
      }
    } catch (error) {
      console.error('Error fetching user notifications:', error);
  
      // Créez une notification de test en cas d'erreur
      const notification: Notification = this.stores.notificationStore.factory();
      console.log('Test notification:', notification.message);
      // Affichez la notification de test dans une modal
      this.modalService.openNotificationModal(notification);
    }
  }
  
  
}
