import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../commons/Notification';
import { Stores } from '../../../../stores/Stores';



@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [Stores],
})
export class NotificationCardComponent {
  @Input() id!: number;
  notification!: Notification;

  constructor(private router: Router,private stores:Stores) {}

  async ngOnInit(): Promise<void> {
    this.notification= await this.stores.notificationStore.findById(this.id)
    
  }

  openNotificationDetails(): void {
    this.router.navigate([`/notification/${this.notification.id}`]);
  }
}
