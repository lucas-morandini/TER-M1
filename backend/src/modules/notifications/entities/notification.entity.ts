import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import NotificationInterface from 'src/shared/commons/interface/Notification.interface';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('Notifications')
export class Notification implements NotificationInterface {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    message: string;

    @Column()
    soldeUpdate: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string;

    @ManyToOne(() => User, user => user.notifications, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
}