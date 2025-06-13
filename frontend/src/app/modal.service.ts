import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModalComponent } from './notification/notification-modal/notification-modal.component';
import { Notification } from '../../commons/Notification';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openNotificationModal(notification: Notification) {
    console.log("Opening notification modal with notification:", notification.message);
    this.dialog.open(NotificationModalComponent, {
      data: { notification }
    });
  }
}
