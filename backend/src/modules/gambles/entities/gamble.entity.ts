import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Match } from '../../matches/entities/match.entity';
import { Bet } from '../../bets/entities/bet.entity';
import GambleInterface from 'src/shared/commons/interface/Gamble.interface';

@Entity('Gambles')
export class Gamble implements GambleInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  odds: number;

  @Column({ type: 'enum', enum: ['-1', '0', '1'], nullable: false })
  win: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  is_available: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  team_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  match_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Team, team => team.gambles)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @OneToMany(() => Bet, bet => bet.gamble, { cascade: true })
  bets: Bet[];
}
