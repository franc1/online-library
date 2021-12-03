import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Book } from '../../book/models/book.model';
import { BaseModel } from '../../shared/models/_base.model';

@Entity({ name: 'printing_office' })
export class PrintingOffice extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('varchar', {
    nullable: false,
    name: 'name',
    length: 100,
  })
  name: string;

  @ApiProperty()
  @Column('varchar', {
    nullable: true,
    name: 'address',
    length: 150,
  })
  address: string;

  @OneToMany(() => Book, (book) => book.printingOffice, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  books: Book[];
}
