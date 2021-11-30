import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseModel } from './_base.model';
import { Role } from './role.model';

@Entity({ name: 'student' })
export class Student extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column('char', {
    nullable: false,
    name: 'personal_id',
    length: 13,
  })
  personalId: string;

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

  @ManyToOne(() => Role, (role) => role.students, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
