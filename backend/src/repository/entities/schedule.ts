import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Film } from './film';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  daytime!: string;

  @Column({ type: 'int' })
  hall!: number;

  @Column({ type: 'int' })
  rows!: number;

  @Column({ type: 'int' })
  seats!: number;

  @Column({ type: 'double precision' })
  price!: number;

  @Column('simple-array')
  taken!: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film!: Film;
}
