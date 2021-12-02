import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BookRequest } from '../../book-request/models/book-request.model';
import { Role } from '../../role/models/role.model';
import { BaseModel } from '../../shared/models/_base.model';

@Entity({ name: 'student' })
export class Student extends BaseModel {
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
  role: Role; // For now every student will have STUDENT role. This is added if need other role for students in future

  @OneToMany(() => BookRequest, (bookRequest) => bookRequest.student, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  bookRequests: BookRequest[];
}
