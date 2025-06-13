import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('MatchTeams')
export class MatchTeam {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  matchId: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  teamId: string;

  @ManyToOne(() => Match, match => match.matchTeams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @ManyToOne(() => Team, team => team.matchTeams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;
}
