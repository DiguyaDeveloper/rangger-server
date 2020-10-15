import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { City } from './City.model';
import { Country } from './Country.model';

@Entity()
export class State {

  constructor(
    name?: string,
    code?: string,
    countryId?: number
  ) {
    this.name = name,
    this.code = code,
    this.countryId = countryId
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @CreateDateColumn({ type: 'timestamp', name: 'createDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updateDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  updateDate: string;

  @OneToMany(() => City, (city: City) => city.state)
  citys: City[];

  @Column('int')
  countryId!: number;

  @ManyToOne(() => Country, country => country.states)
  country: Country;

}
