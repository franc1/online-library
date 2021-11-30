import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseModel } from './_base.model';
import { BookRequest } from './book_request.model';
import { Role } from './role.model';

@Entity({ name: 'user' })
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'first_name',
    length: 50,
  })
  firstName: string;

  @Column('varchar', {
    nullable: false,
    name: 'last_name',
    length: 50,
  })
  lastName: string;

  @Column('varchar', {
    nullable: false,
    name: 'email',
    length: 100,
  })
  email: string;

  @Column('varchar', {
    nullable: false,
    name: 'password',
    length: 100,
  })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column('char', {
    nullable: true,
    name: 'personal_id',
    length: 13,
  })
  personalId: string;

  @Column('varchar', {
    nullable: true,
    name: 'picture',
    length: 150,
  })
  picture: string;

  @Column('varchar', {
    nullable: true,
    name: 'address',
    length: 150,
  })
  address: string;

  @OneToMany(
    () => BookRequest,
    (bookRequest) => bookRequest.requestResolvedBy,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  resolvedBookRequests: BookRequest[];

  @OneToMany(
    () => BookRequest,
    (bookRequest) => bookRequest.backRequestResolvedBy,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  resolvedBackBookRequests: BookRequest[];
}
