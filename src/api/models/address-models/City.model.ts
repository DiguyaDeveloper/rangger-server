import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Address } from './Address.model';
import { State } from './State.model';

@Entity()
export class City {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'createDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updateDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  updateDate: string;

  @ManyToOne(() => State, state => state.citys)
  state: State;

  @Column('int')
  stateId!: number;

  @OneToMany(() => Address, (address: Address) => address.city)
  citys: Address[];
}
