import { User } from 'src/modules/users/entities/user.entity';
import PaymentInterface from 'src/shared/commons/interface/Payment.interface';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.payments, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    amount: number;

    @Column({ type: 'enum', enum: ['deposit', 'withdrawal'], nullable: false })
    type: 'deposit' | 'withdrawal';

    @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'], nullable: false })
    status: 'pending' | 'completed' | 'failed';

    @CreateDateColumn()
    date: Date;

    @Column({ type: 'varchar', length: 34, nullable: true })
    iban?: string;
    @Column({ type: 'varchar', length: 11, nullable: true })
    bic?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    accountHolderName?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}