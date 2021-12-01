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
  @PrimaryGeneratedColumn()
  id: number;

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
  requestDate: Date; // Date when student requests to take the book

  @Column('enum', {
    nullable: false,
    default: BookRequestStatus.requested,
    enum: BookRequestStatus,
    name: 'request_status',
  })
  requestStatus: BookRequestStatus; // Status of student's request to take the book

  @Column({
    name: 'request_resolved_date',
    type: 'timestamptz',
    nullable: true,
  })
  requestResolvedDate: Date; // Date when librarian resolves student's request to take the book

  @ManyToOne(() => User, (user) => user.resolvedBookRequests, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'request_resolved_by' })
  requestResolvedBy: User; // Librarian who resolved student's request to take the book

  @Column({ name: 'back_request_date', type: 'timestamptz', nullable: true })
  backRequestDate: Date; // Date when student requests to return back the book

  @Column('enum', {
    nullable: true,
    enum: BookRequestStatus,
    name: 'back_request_status',
  })
  backRequestStatus: BookRequestStatus; // Status of student's request to return back the book

  @Column({
    name: 'back_request_resolved_date',
    type: 'timestamptz',
    nullable: true,
  })
  backRequestResolvedDate: Date; // Date when librarian resolves student's request to return back the book

  @ManyToOne(() => User, (user) => user.resolvedBackBookRequests, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'back_request_resolved_by' })
  backRequestResolvedBy: User; // Librarian who resolved student's request to return back the book
}
