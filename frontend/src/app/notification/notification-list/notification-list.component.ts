import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardComponent } from '../notification-card/notification-card.component';

import { Stores } from '../../../../stores/Stores';
import { Notification } from '../../../../commons/Notification';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  providers: [Stores],
})
export class NotificationListComponent implements OnInit {
  notifications: number[] = [];
  isLoading = true;
  

  constructor(private stores: Stores,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  async loadNotifications(): Promise<void> {
    const notificationStore = this.stores.notificationStore;
    console.log('Loading notifications for user:', this.authService.getUserId());
    this.notifications = await notificationStore.findAllNotifications(this.authService.getUserId());
    this.isLoading = false;
  }
}
