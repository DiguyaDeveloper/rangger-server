import { IsNotEmpty } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Establishment } from '../establishment-models/Establishment.model';
import { User } from '../user-models/User.model';
import { City } from './City.model';

@Entity()
export class Address {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "Código postal é obrigatório" })
  codigoPostal: string;

  @Column()
  @IsNotEmpty({ message: "logradouro é obrigatório" })
  logradouro: string;

  @Column()
  @IsNotEmpty({ message: "Latitude é obrigatório" })
  latitude: number;

  @Column('int')
  @IsNotEmpty({ message: "Longitude é obrigatório" })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp', name: 'createDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updateDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  updateDate: string;

  @Column('int')
  cityId!: number;

  @ManyToOne(() => City, city => city.citys)
  city: City;

  @OneToMany(() => User, (user: User) => user.address)
  users: User[];

  @OneToMany(() => Establishment, (establishment: Establishment) => establishment.address)
  establishment: Establishment[];

}
