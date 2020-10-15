import {
    Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { State } from './State.model';

@Entity()
export class Country {

constructor(
  name?: string,
  code?: string
) {
  this.name = name,
  this.code = code
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

@OneToMany(() => State, (state: State) => state.country)
states: State[];

}
