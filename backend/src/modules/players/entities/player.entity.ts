import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity('Players')
export class Player {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  summonerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  teamId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Team, team => team.players)
  @JoinColumn({ name: 'teamId' })
  team: Team;
}