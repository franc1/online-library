import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BookRequest } from '../../book-request/models/book-request.model';
import { PrintingOffice } from '../../printing-office/models/printing-office.model';
import { BaseModel } from '../../shared/models/_base.model';
import { BookCategory } from '../book-category/models/book-category.model';
import { BookPublisher } from '../book-publisher/models/book-publisher.model';

export enum BookStatus {
  free = 'free',
  issued = 'issued',
}

@Entity({ name: 'book' })
export class Book extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('varchar', {
    nullable: false,
    name: 'title',
    length: 100,
  })
  title: string;

  @ApiProperty()
  @Column('varchar', {
    nullable: false,
    name: 'author',
    length: 100,
  })
  author: string;

  @ApiProperty()
  @Column('enum', {
    nullable: false,
    default: BookStatus.free,
    enum: BookStatus,
    name: 'status',
  })
  status: BookStatus;

  @ApiProperty()
  @Column('varchar', {
    nullable: false,
    name: 'isbn',
    length: 50,
  })
  isbn: string;

  @ApiProperty()
  @Column('varchar', {
    nullable: true,
    name: 'picture',
    length: 150,
  })
  picture: string;

  @ApiProperty()
  @Column('date', { name: 'publication_date', nullable: true })
  publicationDate: Date;

  @ApiProperty()
  @ManyToOne(() => BookCategory, (bookCategory) => bookCategory.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'book_category_id' })
  bookCategory: BookCategory;

  @ApiProperty()
  @ManyToOne(() => BookPublisher, (bookPublisher) => bookPublisher.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'book_publisher_id' })
  bookPublisher: BookPublisher;

  @ApiProperty()
  @ManyToOne(() => PrintingOffice, (printingOffice) => printingOffice.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'printing_office_id' })
  printingOffice: PrintingOffice;

  @ApiProperty({ type: () => BookRequest })
  @OneToMany(() => BookRequest, (bookRequest) => bookRequest.book, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  bookRequests: BookRequest[];
}
