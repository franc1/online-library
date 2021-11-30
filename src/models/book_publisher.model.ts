import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from './_base.model';
import { Book } from './book.model';

@Entity({ name: 'book_publisher' })
export class BookPublisher extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'name',
    length: 100,
  })
  name: string;

  @Column('varchar', {
    nullable: true,
    name: 'address',
    length: 150,
  })
  address: string;

  @OneToMany(() => Book, (book) => book.bookPublisher, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  books: Book[];
}
