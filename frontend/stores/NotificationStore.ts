import { Store } from "./Store";
import { Notification } from "../commons/Notification";

export class NotificationStore extends Store<Notification> {
  protected single: string = 'notification';
  protected multiple: string = 'notifications';

  async findById(id: number): Promise<Notification> {
    const url = `/api/${this.single}/${id}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async create(notification: Notification): Promise<Notification> {
    const url = `/api/${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(notification),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(notification: Notification): Promise<Notification> {
    const url = `/api/${this.single}/update/${notification.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(notification),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `/api/${this.single}/delete/${id}`;
    await fetch(url, { method: 'DELETE' });
  }

  async findAll(): Promise<Notification[]> {
    const url = `/api/${this.multiple}/`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    return response.json();
  }

  async findAllNotifications(userId: number): Promise<number[]> {
    const url = `/api/${this.single}/all/${userId}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching notifications for user with id ${userId}`);
    }
    return response.json();
  }


  async getNotificationsByUserId(userId: number): Promise<number[]> {
    const url = `/api/${this.single}/user/${userId}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching notifications for user with id ${userId}`);
    }
    return response.json();
  }

  factory(): Notification {
    return new Notification(0, new Date(), new Date(), "Message de test", 42, "Titre de test");
  }
}
