import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Gamble } from '../../gambles/entities/gamble.entity';

@Entity('Bets')
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  odds: number;

  @Column({ type: 'float', nullable: false })
  stake: number;

  @Column({ type: 'enum', enum: ['-1', '0', '1'], nullable: false })
  win: string;

  @Column({ type: 'int', nullable: false })
  gamble_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.bets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Gamble, gamble => gamble.bets)
  @JoinColumn({ name: 'gamble_id' })
  gamble: Gamble;
}