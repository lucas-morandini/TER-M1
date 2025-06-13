import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { League } from '../../leagues/entities/league.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { Team } from '../../teams/entities/team.entity';
import { Game } from '../../games/entities/game.entity';
import { MatchTeam } from './matchteam.entity';
import { Expose, Type } from 'class-transformer';

@Entity('Matches')
export class Match {
  @Expose()
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false })
  leagueId: string;


  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false })
  tournamentId: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false })
  startDate: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false, default: 'upcoming' })
  state: string;


  @Expose()
  @Column({ type: 'int', nullable: false })
  bestOf: number;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: true })
  winnerId: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: true })
  loserId: string;

  // Propriétés pour les paris
  @Expose()
  @Column({ type: 'boolean', nullable: false, default: false })
  isBettable: boolean;

  @Expose()
  @Column({ type: 'int', nullable: true })
  idBet1: number;

  @Expose()
  @Column({ type: 'int', nullable: true })
  idBet2: number;

  @Expose()
  @Column({ type: 'datetime', nullable: true })
  betCloseTime: Date;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => League, league => league.matches)
  @Expose()
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @ManyToOne(() => Tournament, tournament => tournament.matches)
  @Expose()
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @ManyToOne(() => Team, team => team.wonMatches)
  @Expose()
  @JoinColumn({ name: 'winnerId' })
  winner: Team;

  @ManyToOne(() => Team, team => team.lostMatches)
  @Expose()
  @JoinColumn({ name: 'loserId' })
  loser: Team;

  @OneToMany(() => MatchTeam, matchTeam => matchTeam.match, { cascade: true })
  matchTeams: MatchTeam[];

  @Expose({ name: 'teams' })
  @Type(() => Team)
  get teams(): Team[] {
    return this.matchTeams?.map(mt => mt.team) || [];
  }

  @Expose()
  @OneToMany(() => Game, game => game.match, { cascade: true })
  games: Game[];
}