import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    )
    {}


    async findAll(userId: number): Promise<number[]> {
        const notifications: Notification[] | null = await this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { updatedAt: 'DESC' },
        });
        if (!notifications) {
            return [];
        }
        const notifsIds : number[] = await Promise.all(notifications.map(async (notif) => notif.id));
        return notifsIds;
    }

    async findAllByUser(userId: number): Promise<number[]> {
        const notifications : Notification[] | null = await this.notificationRepository.find({
            where: { user: { id: userId }, isRead: false },
            order: { updatedAt: 'DESC' },
        });
        if (!notifications) {
            return [];
        }
        const notificationsIds: number[] = await Promise.all(notifications.map(async (notif) => notif.id));
        return notificationsIds;
    }


    async findOne(id: number, userId: number): Promise<NotificationDto | null> {
        const notification: Notification | null = await this.notificationRepository.findOne({
            where: { id : id, user: { id: userId } },
        });
        if (!notification) {
            return null;
        }
        notification.isRead = true;
        await this.notificationRepository.save(notification);
        const notificationDto: NotificationDto = plainToInstance(NotificationDto, notification);
        return notificationDto;
    }
}
