import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';

@Entity('Tournaments')
export class Tournament {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    startDate: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    endDate: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relations
    @OneToMany(() => Match, match => match.tournament, { cascade: true })
    matches: Match[];
}