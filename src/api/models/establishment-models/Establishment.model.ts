import { IsNotEmpty } from 'class-validator';
import {
    Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Address } from '../address-models/Address.model';
import { User } from '../user-models/User.model';

@Entity()
export class Establishment {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "Razão social é obrigatório" })
  socialReason: string;

  @Column()
  @IsNotEmpty({ message: "CNPJ é obrigatório" })
  document: string;

  @CreateDateColumn({ type: 'timestamp', name: 'createDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updateDate', default: () => 'CURRENT_TIMESTAMP(6)' })
  updateDate: string;

  @Column('int')
  userId!: number;

  @ManyToOne(() => User, user => user.establishment)
  user: User;

  @Column('int')
  addressId!: number;

  @ManyToOne(() => Address, address => address.establishment)
  address: Address;

}
