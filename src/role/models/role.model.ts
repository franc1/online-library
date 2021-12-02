import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from '../../shared/models/_base.model';
import { Student } from '../../student/model/student.model';
import { User } from '../../user/models/user.model';

export enum RoleEnum {
  admin = 'ADMIN',
  librarian = 'LIBRARIAN',
  student = 'STUDENT',
}

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
