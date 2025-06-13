import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { League } from '../../leagues/entities/league.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('Games')
export class Game {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  teamBlueId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  teamRedId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  leagueId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  matchId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Team, team => team.blueGames)
  @JoinColumn({ name: 'teamBlueId' })
  teamBlue: Team;

  @ManyToOne(() => Team, team => team.redGames)
  @JoinColumn({ name: 'teamRedId' })
  teamRed: Team;

  @ManyToOne(() => League, league => league.games)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @ManyToOne(() => Match, match => match.games)
  @JoinColumn({ name: 'matchId' })
  match: Match;
}