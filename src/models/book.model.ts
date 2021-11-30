import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseModel } from './_base.model';
import { BookCategory } from './book_category.model';
import { BookPublisher } from './book_publisher.model';
import { BookRequest } from './book_request.model';
import { PrintingOffice } from './printing_office.model';

export enum BookStatus {
  free = 'free',
  issued = 'issued',
}

@Entity({ name: 'book' })
export class Book extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'title',
    length: 100,
  })
  title: string;

  @Column('varchar', {
    nullable: false,
    name: 'author',
    length: 100,
  })
  author: string;

  @Column('enum', {
    nullable: false,
    default: BookStatus.free,
    enum: BookStatus,
    name: 'status',
  })
  status: BookStatus;

  @Column('varchar', {
    nullable: false,
    name: 'isbn',
    length: 50,
  })
  isbn: string;

  @Column('varchar', {
    nullable: true,
    name: 'picture',
    length: 150,
  })
  picture: string;

  @Column('date', { name: 'publication_date', nullable: true })
  publicationDate: Date;

  @ManyToOne(() => BookCategory, (bookCategory) => bookCategory.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'book_category_id' })
  bookCategory: BookCategory;

  @ManyToOne(() => BookPublisher, (bookPublisher) => bookPublisher.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'book_publisher_id' })
  bookPublisher: BookPublisher;

  @ManyToOne(() => PrintingOffice, (printingOffice) => printingOffice.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'printing_office_id' })
  printingOffice: PrintingOffice;

  @OneToMany(() => BookRequest, (bookRequest) => bookRequest.book, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  bookRequests: BookRequest[];
}
