import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseModel } from './_base.model';
import { Book } from './book.model';
import { Student } from './student.model';
import { User } from './user.model';

export enum BookRequestStatus {
  requested = 'requested',
  accepted = 'accepted',
  rejected = 'rejected',
}

@Entity({ name: 'book_request' })
export class BookRequest extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.bookRequests, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Book, (book) => book.bookRequests, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'request_date', type: 'timestamptz', nullable: false })
  requestDate: Date;

  @Column('enum', {
    nullable: false,
    default: BookRequestStatus.requested,
    enum: BookRequestStatus,
    name: 'request_status',
  })
  requestStatus: BookRequestStatus;

  @Column({
    name: 'request_resolved_date',
    type: 'timestamptz',
    nullable: true,
  })
  requestResolvedDate: Date;

  @ManyToOne(() => User, (user) => user.resolvedBookRequests, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'request_resolved_by' })
  requestResolvedBy: User;

  @Column({ name: 'back_request_date', type: 'timestamptz', nullable: true })
  backRequestDate: Date;

  @Column('enum', {
    nullable: true,
    enum: BookRequestStatus,
    name: 'back_request_status',
  })
  backRequestStatus: BookRequestStatus;

  @Column({
    name: 'back_request_resolved_date',
    type: 'timestamptz',
    nullable: true,
  })
  backRequestResolvedDate: Date;

  @ManyToOne(() => User, (user) => user.resolvedBackBookRequests, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'back_request_resolved_by' })
  backRequestResolvedBy: User;
}
