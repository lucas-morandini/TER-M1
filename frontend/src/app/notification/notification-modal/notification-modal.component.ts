import { Component, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Notification } from '../../../../commons/Notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  imports: [CommonModule,
    MatDialogModule],
})
export class NotificationModalComponent {

  closeModalEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<NotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notification: Notification }
  ) {}

  closeModal() {
    console.log("Close modal event emitted");
    this.dialogRef.close();
  }
}
