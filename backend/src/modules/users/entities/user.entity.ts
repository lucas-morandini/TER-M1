import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bet } from '../../bets/entities/bet.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'text', nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'date', nullable: false })
  birth_date: Date;

  @Column({ type: 'text', nullable: false })
  pwd: string;

  @Column({ type: 'text', nullable: false })
  tel: string;

  @Column({ type: 'enum', enum: ['H', 'F'], nullable: false, default: 'H' })
  sex: string;

  @Column({ type: 'text', nullable: true })
  tokens: string;

  @Column({ type: 'float', nullable: false, default: 0 })
  solde: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Bet, bet => bet.user, { cascade: true })
  bets: Bet[];

  // un utilisateur à plusieurs notifications mais une notification n'appartient qu'à un utilisateur
  @OneToMany(() => Notification, notification => notification.user, { cascade: true })
  notifications: Notification[];

  @OneToMany(() => Payment, payment => payment.user, { cascade: true })
  payments: Payment[];
}