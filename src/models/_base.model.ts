import { Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
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
  })
  updatedDate: Date;

  @Index()
  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedDate: Date;
}
