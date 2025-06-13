import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Game } from '../../games/entities/game.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('Leagues')
export class League {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Team, team => team.homeLeague, { cascade: true })
  teams: Team[];

  @OneToMany(() => Game, game => game.league, { cascade: true })
  games: Game[];

  @OneToMany(() => Match, match => match.league, { cascade: true })
  matches: Match[];
}