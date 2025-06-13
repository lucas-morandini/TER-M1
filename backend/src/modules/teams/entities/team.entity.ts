import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { League } from '../../leagues/entities/league.entity';
import { Player } from '../../players/entities/player.entity';
import { Game } from '../../games/entities/game.entity';
import { Match } from '../../matches/entities/match.entity';
import { MatchTeam } from '../../matches/entities/matchteam.entity';
import { Gamble } from '../../gambles/entities/gamble.entity';

@Entity('Teams')
export class Team {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternativeImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  homeLeagueId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => League, league => league.teams)
  @JoinColumn({ name: 'homeLeagueId' })
  homeLeague: League;

  @OneToMany(() => Player, player => player.team, { cascade: true })
  players: Player[];

  @OneToMany(() => Game, game => game.teamBlue, { cascade: true })
  blueGames: Game[];

  @OneToMany(() => Game, game => game.teamRed, { cascade: true })
  redGames: Game[];

  @OneToMany(() => Match, match => match.winner, { cascade: true })
  wonMatches: Match[];

  @OneToMany(() => Match, match => match.loser, { cascade: true })
  lostMatches: Match[];

  @OneToMany(() => MatchTeam, matchTeam => matchTeam.team, { cascade: true })
  matchTeams: MatchTeam[];

  get matches(): Match[] {
    return this.matchTeams?.map(mt => mt.match) || [];
  }

  @OneToMany(() => Gamble, gamble => gamble.team, { cascade: true })
  gambles: Gamble[];
}