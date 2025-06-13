import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stores } from '../../../../stores/Stores';
import { Notification } from '../../../../commons/Notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-basic',
  templateUrl: './notification-basic.component.html',
  styleUrls: ['./notification-basic.component.scss'],
  imports: [CommonModule],
  providers: [Stores, Router]
})
export class NotificationBasicComponent implements OnInit {
  notificationId!: number;
  notification!: Notification;

  constructor(
    private stores: Stores,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.notification = stores.notificationStore.factory();
  }

  async ngOnInit(): Promise<void> {
    this.notificationId = Number(this.route.snapshot.paramMap.get('id')) || -1;
    console.log('Notification ID:', this.notificationId);
    await this.loadNotification();
  }

  async loadNotification(): Promise<void> {
    const notificationStore = this.stores.notificationStore;
    try {
      this.notification = await notificationStore.findById(this.notificationId);
      if (!this.notification) {
        this.notification = notificationStore.factory();
      }
    } catch (error) {
      this.notification = notificationStore.factory();
    }
  }
}
