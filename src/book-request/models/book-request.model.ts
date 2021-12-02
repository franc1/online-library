import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from '../../book/models/book.model';
import { BaseModel } from '../../shared/models/_base.model';
import { Student } from '../../student/model/student.model';
import { User } from '../../user/models/user.model';

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

  @Column({ name: 'return_request_date', type: 'timestamptz', nullable: true })
  returnRequestDate: Date; // Date when student requests to return back the book

  @Column('enum', {
    nullable: true,
    enum: BookRequestStatus,
    name: 'return_request_status',
  })
  returnRequestStatus: BookRequestStatus; // Status of student's request to return back the book

  @Column({
    name: 'return_request_resolved_date',
    type: 'timestamptz',
    nullable: true,
  })
  returnRequestResolvedDate: Date; // Date when librarian resolves student's request to return back the book

  @ManyToOne(() => User, (user) => user.resolvedReturnBookRequests, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'return_request_resolved_by' })
  returnRequestResolvedBy: User; // Librarian who resolved student's request to return back the book
}
