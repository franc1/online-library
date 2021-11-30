import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from './_base.model';
import { Student } from './student.model';
import { User } from './user.model';

@Entity({ name: 'role' })
export class Role extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'name',
    length: 50,
  })
  name: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  users: User[];

  @OneToMany(() => Student, (student) => student.role, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  students: Student[];
}
