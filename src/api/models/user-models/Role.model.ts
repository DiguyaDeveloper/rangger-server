import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User.model';

@Entity({ schema: 'public' })
export class Role {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty({
    message: 'The name is required'
  })
  @Column({ length: 50, type: 'varchar' })
  name: string

  @OneToMany(() => User, (user: User) => user.role)
  users: User[];
}

export enum DefaultRole {
  Usuario = 1,
  Admin = 2
}
