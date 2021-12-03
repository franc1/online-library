import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: false,
    select: false,
  })
  updatedDate: Date;

  @Index()
  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedDate: Date;
}
