import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from '../../../shared/models/_base.model';
import { Book } from '../../models/book.model';

@Entity({ name: 'book_category' })
export class BookCategory extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'name',
    length: 100,
  })
  name: string;

  @OneToMany(() => Book, (book) => book.bookCategory, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  books: Book[];
}
